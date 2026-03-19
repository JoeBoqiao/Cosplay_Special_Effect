"use client";

import UploadForm from "@/components/UploadForm";
import type { AnalyzeResponse, GenerateResponse } from "@/lib/types";
import AnalysisResult from "@/components/AnalysisResult";
import GeneratePanel from "@/components/GeneratePanel";
import ImagePreview from "@/components/ImagePreview";
import ResultDisplay from "@/components/ResultDisplay";
import { useMemo, useState } from "react";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [userPrompt, setUserPrompt] = useState("");
  const [effectType, setEffectType] = useState<string>("lightning");

  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResponse | null>(
    null,
  );
  const [generateResult, setGenerateResult] = useState<GenerateResponse | null>(
    null,
  );

  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canAnalyze = !!file && userPrompt.trim().length > 0;
  const canGenerate =
    !!analyzeResult && analyzeResult.finalPrompt?.trim().length > 0;

  const handleFileChange = (nextFile: File | null) => {
    setFile(nextFile);
    setAnalyzeResult(null);
    setGenerateResult(null);
    setErrorMessage(null);

    if (!nextFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(nextFile);
    setPreviewUrl(url);
  };

  const resetAll = () => {
    setFile(null);
    setPreviewUrl(null);
    setUserPrompt("");
    setAnalyzeResult(null);
    setGenerateResult(null);
    setErrorMessage(null);
  };

  const analyzePayload = useMemo(() => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("userPrompt", userPrompt);
    formData.append("effectType", effectType);
    return formData;
  }, [file, userPrompt, effectType]);

  return (
    <main className="container py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Cosplay Effects Studio
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Upload a cosplay photo, describe the effect you want, and let the AI
          suggest cinematic effect prompts. Then generate a polished result for
          your next share.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-6">
          <UploadForm
            file={file}
            userPrompt={userPrompt}
            effectType={effectType}
            onFileChange={handleFileChange}
            onPromptChange={setUserPrompt}
            onEffectTypeChange={setEffectType}
            loading={analyzeLoading}
            disabled={!canAnalyze}
            onAnalyze={async () => {
              if (!analyzePayload) return;
              setErrorMessage(null);
              setAnalyzeLoading(true);
              setGenerateResult(null);

              try {
                const { analyzeImage } = await import("@/lib/api");
                const data = await analyzeImage(analyzePayload);
                setAnalyzeResult(data);
              } catch (err: any) {
                setErrorMessage(err?.message || "Failed to analyze image.");
              } finally {
                setAnalyzeLoading(false);
              }
            }}
          />

          <ImagePreview imageUrl={previewUrl} />

          {errorMessage ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <strong>Error:</strong> {errorMessage}
            </div>
          ) : null}
        </section>

        <section className="space-y-6">
          <AnalysisResult result={analyzeResult} />

          <GeneratePanel
            enabled={canGenerate}
            loading={generateLoading}
            onGenerate={async () => {
              if (!analyzeResult) return;
              setErrorMessage(null);
              setGenerateLoading(true);
              try {
                const { generateImage } = await import("@/lib/api");
                const resp = await generateImage({
                  finalPrompt: analyzeResult.finalPrompt,
                  effectType,
                  image: file ?? undefined,
                });
                setGenerateResult(resp);
              } catch (err: any) {
                setErrorMessage(err?.message || "Failed to generate result.");
              } finally {
                setGenerateLoading(false);
              }
            }}
          />

          <ResultDisplay result={generateResult} />

          <button
            type="button"
            onClick={resetAll}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Reset all
          </button>
        </section>
      </div>
    </main>
  );
}
