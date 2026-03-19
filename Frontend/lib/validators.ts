import type { AnalyzeRequestPayload, GenerateRequestPayload } from "./backend-types";

export const SUPPORTED_IMAGE_MIME_PREFIX = "image/";
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function assertCondition(
  condition: boolean,
  message: string,
): asserts condition {
  if (!condition) {
    const error: any = new Error(message);
    error.status = 400;
    throw error;
  }
}

export function validateAnalyzeFormData(
  formData: FormData,
): AnalyzeRequestPayload {
  const userPrompt = formData.get("userPrompt");
  const effectType = formData.get("effectType") as string | null;
  const file = formData.get("image") as File | null;

  assertCondition(
    typeof userPrompt === "string" && userPrompt.trim().length > 0,
    "userPrompt is required.",
  );
  assertCondition(file instanceof File, "image file is required.");
  assertCondition(
    file.type.startsWith(SUPPORTED_IMAGE_MIME_PREFIX),
    "Uploaded file must be an image.",
  );
  assertCondition(
    file.size > 0 && file.size <= MAX_IMAGE_SIZE_BYTES,
    `Image must be <= ${MAX_IMAGE_SIZE_BYTES} bytes.`,
  );

  return {
    userPrompt: userPrompt.trim(),
    effectType: effectType?.trim() || undefined,
    image: {
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      base64: "", // populated later after reading the file
    },
  };
}

export function validateGenerateBody(body: unknown): GenerateRequestPayload {
  const parsed = body as GenerateRequestPayload;
  assertCondition(
    typeof parsed === "object" && parsed !== null,
    "Request body must be a JSON object.",
  );
  assertCondition(
    typeof parsed.finalPrompt === "string" &&
      parsed.finalPrompt.trim().length > 0,
    "finalPrompt is required.",
  );
  assertCondition(
    typeof parsed.imageBase64 === "string" &&
      parsed.imageBase64.length > 0,
    "imageBase64 is required.",
  );

  return {
    finalPrompt: parsed.finalPrompt.trim(),
    effectType:
      typeof parsed.effectType === "string" &&
      parsed.effectType.trim().length > 0
        ? parsed.effectType.trim()
        : undefined,
    imageBase64: parsed.imageBase64,
    imageMimeType: typeof parsed.imageMimeType === "string" ? parsed.imageMimeType : undefined,
  };
}
