import type {
  AnalyzeResponse,
  GenerateRequest,
  GenerateResponse,
  HealthResponse,
} from "./types";

const DEFAULT_HEADERS = {
  Accept: "application/json",
};

export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch("/api/health", {
    headers: DEFAULT_HEADERS,
  });
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }
  return res.json();
}

export async function analyzeImage(
  formData: FormData,
): Promise<AnalyzeResponse> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      (body && (body as any).error) || `Analyze request failed (${res.status})`;
    throw new Error(message);
  }
  const payload = await res.json();
  // Debug helper: log the raw analyze response so we can see if final_prompt is missing
  // (remove or adjust this in production if you don't want console output).
  console.debug("[api] analyze response", payload);
  return payload?.data ?? payload;
}

export async function generateImage(
  payload: GenerateRequest,
): Promise<GenerateResponse> {
  const formData = new FormData();
  formData.append("finalPrompt", payload.finalPrompt);
  if (payload.effectType) {
    formData.append("effectType", payload.effectType);
  }
  if (payload.image) {
    formData.append("image", payload.image);
  }
  if (payload.referenceImage) {
    formData.append("referenceImage", payload.referenceImage);
  }
  if (payload.scale !== undefined) {
    formData.append("scale", String(payload.scale));
  }

  const res = await fetch("/api/generate", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      (body && (body as any).error) ||
      `Generate request failed (${res.status})`;
    throw new Error(message);
  }
  const responseBody = await res.json();
  return responseBody?.data ?? responseBody;
}
