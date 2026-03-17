import type { AnalyzeResponse } from "@/lib/types";

interface AnalysisResultProps {
  result: AnalyzeResponse | null;
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  if (!result) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Analysis result
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          After analysis, you will see the suggested effects, description, and a
          final prompt.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Analysis result</h2>

      <div className="mt-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">
            Scene description
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {result.sceneDescription}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-700">
            Detected subject
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {result.detectedSubject}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-700">
            Recommended effects
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {Array.isArray(result.recommendedEffects) &&
            result.recommendedEffects.length ? (
              result.recommendedEffects.map((effect, index) => (
                <span
                  key={typeof effect === "string" ? effect : index}
                  className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700"
                >
                  {typeof effect === "string"
                    ? effect
                    : typeof effect === "object" && effect !== null
                      ? (effect as any).type || JSON.stringify(effect)
                      : String(effect)}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">
                No recommendations available.
              </span>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-700">
            Composition notes
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {result.compositionNotes}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-700">Final prompt</h3>
          <pre className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            {result.finalPrompt}
          </pre>
        </div>
      </div>
    </div>
  );
}
