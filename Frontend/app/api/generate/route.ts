import { NextResponse } from "next/server";
import { replicateGenerate } from "@/lib/replicate";

/**
 * POST /api/generate
 *
 * Accepts FormData with:
 * - image: original cosplay photo (File)
 * - referenceImage: effect reference image (File)
 * - finalPrompt: text description of desired effect
 * - effectType: optional effect type string
 * - scale: optional IP-Adapter strength (0-1)
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const finalPrompt = formData.get("finalPrompt") as string | null;
    const effectType = formData.get("effectType") as string | null;
    const originalImage = formData.get("image") as File | null;
    const referenceImage = formData.get("referenceImage") as File | null;
    const scaleStr = formData.get("scale") as string | null;

    if (!finalPrompt || finalPrompt.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "finalPrompt is required." },
        { status: 400 },
      );
    }

    if (!originalImage || !(originalImage instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Original cosplay image is required." },
        { status: 400 },
      );
    }

    if (!referenceImage || !(referenceImage instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Reference effect image is required." },
        { status: 400 },
      );
    }

    // Convert images to base64 data URIs for Replicate
    const originalBuffer = Buffer.from(await originalImage.arrayBuffer());
    const originalDataUri = `data:${originalImage.type};base64,${originalBuffer.toString("base64")}`;

    const referenceBuffer = Buffer.from(await referenceImage.arrayBuffer());
    const referenceDataUri = `data:${referenceImage.type};base64,${referenceBuffer.toString("base64")}`;

    const scale = scaleStr ? parseFloat(scaleStr) : 0.6;

    // Build enhanced prompt
    const promptParts = [finalPrompt.trim()];
    if (effectType) {
      promptParts.push(`${effectType} special effect`);
    }
    promptParts.push(
      "preserve the original character's face, pose, and costume exactly",
      "cinematic lighting, high quality, detailed",
    );

    const result = await replicateGenerate({
      originalImageUrl: originalDataUri,
      referenceImageUrl: referenceDataUri,
      prompt: promptParts.join(", "),
      scale,
    });

    if (result.error) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      data: {
        finalPrompt: promptParts.join(", "),
        generation: {
          model: "ip_adapter-sdxl-controlnet-canny",
          createdAt: new Date().toISOString(),
          predictionId: result.predictionId,
        },
        output: {
          imageUrl: result.imageUrl,
        },
      },
    });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json(
      {
        ok: false,
        error: error?.message ?? "Unexpected error",
      },
      { status },
    );
  }
}
