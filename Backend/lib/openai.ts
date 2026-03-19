import OpenAI from "openai";
import type {
  AnalyzeRequestPayload,
  AnalyzeResponsePayload,
  GenerateRequestPayload,
  GenerateResponsePayload,
} from "./types";
import { buildAnalyzeSystemPrompt } from "./prompts";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing required OPENAI_API_KEY environment variable.");
  }
  return new OpenAI({ apiKey });
}

function safeParseJson(raw: unknown): unknown {
  if (typeof raw !== "string") return raw;
  const jsonMatch = raw.trim().match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return raw;
  }
}

/**
 * Analyze an uploaded cosplay image and return structured analysis metadata.
 */
export async function analyzeImage(
  payload: AnalyzeRequestPayload,
): Promise<AnalyzeResponsePayload> {
  const systemPrompt = buildAnalyzeSystemPrompt(payload.effectType);

  // Build user message with the image in OpenAI vision format (image_url with data URI).
  const textParts = [`User request: ${payload.userPrompt}`];
  if (payload.effectType) {
    textParts.push(`Requested effect: ${payload.effectType}`);
  }
  textParts.push(
    "Please analyze the cosplay photo and return a JSON object with the required fields.",
  );

  const dataUri = `data:${payload.image.mimeType};base64,${payload.image.base64}`;

  const client = getOpenAIClient();
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "input_text", text: textParts.join("\n\n") },
          {
            type: "input_image",
            image_url: dataUri,
          },
        ],
      },
    ],
  });

  // The OpenAI responses API may return output text in different fields depending on the model and SDK version.
  const rawOutput =
    (response as any)?.output_text ??
    (response as any)?.output?.[0]?.text ??
    (response as any)?.output?.[0]?.content?.[0]?.text ??
    "";

  const parsed = safeParseJson(rawOutput) as Record<string, unknown>;

  const sceneDescription =
    typeof parsed?.scene_description === "string"
      ? parsed.scene_description
      : "";
  const detectedSubject =
    typeof parsed?.detected_subject === "string"
      ? parsed.detected_subject
      : "cosplayer";
  const recommendedEffects = Array.isArray(parsed?.recommended_effects)
    ? parsed.recommended_effects.filter((item) => typeof item === "string")
    : [];
  const compositionNotes =
    typeof parsed?.composition_notes === "string"
      ? parsed.composition_notes
      : "";
  const finalPrompt =
    typeof parsed?.final_prompt === "string" ? parsed.final_prompt : "";

  return {
    sceneDescription,
    detectedSubject,
    recommendedEffects,
    compositionNotes,
    finalPrompt,
    raw: {
      openaiResponse: response,
      parsed,
      rawOutput,
    },
  };
}

/**
 * Generate a placeholder / initial response for an image generation request.
 * This is designed to be easy to upgrade later with real image generation.
 */
export async function generateImage(
  payload: GenerateRequestPayload,
): Promise<GenerateResponsePayload> {
  const generationMetadata = {
    model: "gpt-image-1",
    createdAt: new Date().toISOString(),
  };

  const client = getOpenAIClient();

  try {
    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt: payload.finalPrompt,
      // Optional: you can adjust size or other params here if needed.
      // size: "1024x1024",
    });

    const firstItem = (response as any)?.data?.[0];
    const imageUrl =
      typeof firstItem?.url === "string" ? firstItem.url : undefined;
    const b64 =
      typeof firstItem?.b64_json === "string" ? firstItem.b64_json : undefined;

    // Some OpenAI deployments return a base64 PNG image instead of a hosted URL.
    // The client can render data URIs directly in an <img> tag.
    const imageDataUri = b64 ? `data:image/png;base64,${b64}` : undefined;
    const finalImageUrl = imageUrl ?? imageDataUri;

    return {
      finalPrompt: payload.finalPrompt,
      generation: generationMetadata,
      output: {
        imageUrl: finalImageUrl,
        placeholder: finalImageUrl
          ? undefined
          : "Image generation completed but no usable output was returned.",
      },
      raw: {
        openaiResponse: response,
      },
    };
  } catch (error) {
    // Fallback for environments where the Images API is not enabled.
    return {
      finalPrompt: payload.finalPrompt,
      generation: generationMetadata,
      output: {
        placeholder:
          "Image generation is not yet implemented in the backend MVP.",
      },
      raw: {
        error,
        note: "Replace this with actual OpenAI images.generate response when enabled.",
      },
    };
  }
}
