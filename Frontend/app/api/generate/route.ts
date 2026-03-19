import { NextResponse } from "next/server";
import { generateImage } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const finalPrompt = formData.get("finalPrompt") as string | null;
    const effectType = formData.get("effectType") as string | null;
    const file = formData.get("image") as File | null;

    if (!finalPrompt || finalPrompt.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "finalPrompt is required." },
        { status: 400 },
      );
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "image file is required for editing." },
        { status: 400 },
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const result = await generateImage({
      finalPrompt: finalPrompt.trim(),
      effectType: effectType?.trim() || undefined,
      imageBase64: base64,
      imageMimeType: file.type,
    });

    return NextResponse.json({ ok: true, data: result });
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
