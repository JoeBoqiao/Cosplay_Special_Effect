/**
 * Replicate API client for IP-Adapter + ControlNet SDXL
 * Model: chigozienri/ip_adapter-sdxl-controlnet-canny
 *
 * This model takes:
 * - image: reference style/effect image (IP-Adapter uses this for style transfer)
 * - controlnet_input: the original photo (ControlNet preserves its structure)
 * - prompt: text description of desired effect
 */

const REPLICATE_MODEL_VERSION =
  "6a095e6e0feec0f857752e809946fc0e995a0f126c8bbcfdc5d0e715fbb1989e";

function getReplicateToken(): string {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error("Missing required REPLICATE_API_TOKEN environment variable.");
  }
  return token;
}

interface ReplicateGenerateInput {
  originalImageUrl: string;     // cosplay photo (used as controlnet_input to preserve structure)
  referenceImageUrl: string;    // effect reference image (used as IP-Adapter image input)
  prompt: string;               // text description of the effect
  scale?: number;               // IP-Adapter influence (0-1, default 0.6)
  controlnetScale?: number;     // ControlNet strength (0-2, default 1.0)
  numInferenceSteps?: number;   // quality steps (default 30)
  negativePrompt?: string;
}

interface ReplicateGenerateResult {
  imageUrl: string | null;
  predictionId: string;
  error?: string;
}

/**
 * Start a prediction and poll until complete.
 */
export async function replicateGenerate(
  input: ReplicateGenerateInput,
): Promise<ReplicateGenerateResult> {
  const token = getReplicateToken();

  // Step 1: Create prediction
  const createRes = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: REPLICATE_MODEL_VERSION,
      input: {
        prompt: input.prompt,
        image: input.referenceImageUrl,              // IP-Adapter: reference effect image
        controlnet_input: input.originalImageUrl,     // ControlNet: original photo (preserve structure)
        scale: input.scale ?? 0.6,
        controlnet_conditioning_scale: input.controlnetScale ?? 1.0,
        num_inference_steps: input.numInferenceSteps ?? 30,
        num_outputs: 1,
        negative_prompt:
          input.negativePrompt ??
          "blurry, low quality, distorted face, deformed, ugly, watermark, text",
      },
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => null);
    throw new Error(
      `Replicate API error: ${createRes.status} - ${(err as any)?.detail ?? "Unknown error"}`,
    );
  }

  const prediction = (await createRes.json()) as any;
  const predictionId = prediction.id as string;

  // Step 2: Poll for completion (max ~5 minutes)
  const maxAttempts = 60;
  const pollInterval = 5000; // 5 seconds

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, pollInterval));

    const pollRes = await fetch(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!pollRes.ok) continue;

    const status = (await pollRes.json()) as any;

    if (status.status === "succeeded") {
      const output = status.output;
      const imageUrl = Array.isArray(output) ? output[0] : output;
      return { imageUrl, predictionId };
    }

    if (status.status === "failed" || status.status === "canceled") {
      return {
        imageUrl: null,
        predictionId,
        error: status.error ?? "Prediction failed",
      };
    }
    // still processing, continue polling
  }

  return {
    imageUrl: null,
    predictionId,
    error: "Prediction timed out after 5 minutes",
  };
}
