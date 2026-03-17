export interface AnalyzeResponse {
  sceneDescription: string;
  detectedSubject: string;
  recommendedEffects: unknown[];
  compositionNotes: string;
  finalPrompt: string;
  [key: string]: unknown;
}

export interface GenerateRequest {
  finalPrompt: string;
  effectType?: string;
}

export interface GenerateResponse {
  finalPrompt: string;
  generation?: {
    model?: string;
    createdAt?: string;
    [key: string]: unknown;
  };
  output?: {
    imageUrl?: string;
    placeholder?: string;
    [key: string]: unknown;
  };
  raw?: unknown;
}

export interface HealthResponse {
  ok: boolean;
  service?: string;
  [key: string]: unknown;
}
