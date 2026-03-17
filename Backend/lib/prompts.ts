import type { AnalyzeRequestPayload } from "./types";

const MAX_PROMPT_LENGTH = 2000;

/**
 * Build a system prompt for analyzing a cosplay photo.
 * The model is instructed to be aware of cosplay culture and to avoid generic beauty filter language.
 */
export function buildAnalyzeSystemPrompt(effectType?: string): string {
  const base =
    `You are an assistant specialized in analyzing cosplay photos for creative special effects. ` +
    `Your goal is to understand the costume, pose, setting, and character intent, then recommend cosplay-themed visual effects. ` +
    `Avoid generic beauty filter language (e.g., "enhance skin" or "smooth tones"). Focus on cinematic, fantasy, and character-driven cues.`;

  const effectHint = effectType
    ? ` The user may be interested in adding the following effect style: ${effectType}.`
    : "";

  return `${base}${effectHint} Respond with valid JSON only, with these keys: scene_description, detected_subject, recommended_effects (array), composition_notes, final_prompt.`;
}

/**
 * Build a final prompt that can be used later for image editing or generation.
 * It should preserve the subject identity, costume details, pose, and cosplay style.
 */
export function buildFinalPrompt(
  analysis: Omit<AnalyzeRequestPayload, "image">,
  analysisResult: {
    sceneDescription: string;
    detectedSubject: string;
    compositionNotes: string;
  },
): string {
  const promptParts: string[] = [];

  promptParts.push(`Photo of ${analysisResult.detectedSubject}`);
  promptParts.push(analysisResult.sceneDescription);

  if (analysis.userPrompt) {
    promptParts.push(`User request: ${analysis.userPrompt}`);
  }

  if (analysis.effectType) {
    promptParts.push(`Effect style: ${analysis.effectType}`);
  }

  if (analysisResult.compositionNotes) {
    promptParts.push(`Composition notes: ${analysisResult.compositionNotes}`);
  }

  const prompt = promptParts.join(" | ");
  return prompt.length > MAX_PROMPT_LENGTH
    ? prompt.slice(0, MAX_PROMPT_LENGTH)
    : prompt;
}
