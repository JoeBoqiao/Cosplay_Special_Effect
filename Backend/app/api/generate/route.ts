import { NextResponse } from "next/server";
import { generateImage } from "../../../lib/openai";
import { validateGenerateBody } from "../../../lib/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = validateGenerateBody(body);

    const result = await generateImage(payload);
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
