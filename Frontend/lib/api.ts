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
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: {
      ...DEFAULT_HEADERS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
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
