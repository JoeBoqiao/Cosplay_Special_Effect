import { NextResponse } from "next/server";
import { analyzeImage } from "../../../lib/openai";
import { validateAnalyzeFormData } from "../../../lib/validators";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const payload = validateAnalyzeFormData(formData);

    // Convert file to base64 so it can be passed to the OpenAI API.
    const file = formData.get("image") as File;
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    payload.image.base64 = base64;

    const analysis = await analyzeImage(payload);
    return NextResponse.json({ ok: true, data: analysis });
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
