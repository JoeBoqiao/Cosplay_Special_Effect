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

  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referencePreviewUrl, setReferencePreviewUrl] = useState<string | null>(null);

  const [userPrompt, setUserPrompt] = useState("");
  const [effectType, setEffectType] = useState<string>("lightning");
  const [effectStrength, setEffectStrength] = useState<number>(0.6);

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
    !!analyzeResult &&
    analyzeResult.finalPrompt?.trim().length > 0 &&
    !!referenceFile;

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

  const handleReferenceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = e.target.files?.[0] ?? null;
    setReferenceFile(nextFile);
    setGenerateResult(null);

    if (!nextFile) {
      setReferencePreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(nextFile);
    setReferencePreviewUrl(url);
  };

  const resetAll = () => {
    setFile(null);
    setPreviewUrl(null);
    setReferenceFile(null);
    setReferencePreviewUrl(null);
    setUserPrompt("");
    setEffectStrength(0.6);
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
          Upload a cosplay photo and a reference effect image. The AI will
          analyze your photo and apply the reference effects onto it while
          preserving your original image.
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

          {/* Reference Effect Image Upload */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              2. Reference effect image
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Upload a reference image showing the effect you want (e.g., a game
              screenshot with special effects, a character with wings/fire/lightning).
            </p>

            <div className="mt-4 space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleReferenceFileChange}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                disabled={generateLoading}
              />

              {referencePreviewUrl ? (
                <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                  <img
                    src={referencePreviewUrl}
                    alt="Reference effect preview"
                    className="h-full w-full rounded-lg object-contain"
                  />
                </div>
              ) : null}

              {/* Effect Strength Slider */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Effect strength: {effectStrength.toFixed(1)}
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  Lower = more faithful to original photo. Higher = stronger effect transfer.
                </p>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.1"
                  value={effectStrength}
                  onChange={(e) => setEffectStrength(parseFloat(e.target.value))}
                  className="w-full"
                  disabled={generateLoading}
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtle (0.2)</span>
                  <span>Strong (1.0)</span>
                </div>
              </div>
            </div>
          </div>

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
              if (!analyzeResult || !referenceFile) return;
              setErrorMessage(null);
              setGenerateLoading(true);
              try {
                const { generateImage } = await import("@/lib/api");
                const resp = await generateImage({
                  finalPrompt: analyzeResult.finalPrompt,
                  effectType,
                  image: file ?? undefined,
                  referenceImage: referenceFile,
                  scale: effectStrength,
                });
                setGenerateResult(resp);
              } catch (err: any) {
                setErrorMessage(err?.message || "Failed to generate result.");
              } finally {
                setGenerateLoading(false);
              }
            }}
          />

          {!referenceFile && analyzeResult ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              ⬅ Upload a reference effect image to enable generation.
            </div>
          ) : null}

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
