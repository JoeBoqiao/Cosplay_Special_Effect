// Shared TypeScript types used throughout the backend.

export interface AnalyzeRequestPayload {
  userPrompt: string;
  effectType?: string;
  // image is represented in an input-friendly form for OpenAI calls
  image: {
    filename: string;
    mimeType: string;
    size: number;
    base64: string;
  };
}

export interface AnalyzeResponsePayload {
  sceneDescription: string;
  detectedSubject: string;
  recommendedEffects: string[];
  compositionNotes: string;
  finalPrompt: string;
  // raw can include full OpenAI response for debugging / audit purposes
  raw?: unknown;
}

export interface GenerateRequestPayload {
  finalPrompt: string;
  effectType?: string;
}

export interface GenerateResponsePayload {
  finalPrompt: string;
  generation: {
    model: string;
    createdAt: string;
  };
  output: {
    // In MVP we may return a placeholder or a URL to an image result
    imageUrl?: string;
    placeholder?: string;
  };
  raw?: unknown;
}
