import type { GenerateResponse } from "@/lib/types";

interface ResultDisplayProps {
  result: GenerateResponse | null;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  if (!result) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Generated result
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          After generation, you will see the result here. This could be a
          generated image or a structured output.
        </p>
      </div>
    );
  }

  const imageUrl = result.output?.imageUrl;
  const placeholder = result.output?.placeholder;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Generated result</h2>
      <div className="mt-4 space-y-4">
        {imageUrl ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <img
              src={imageUrl}
              alt="Generated result"
              className="mx-auto max-h-72 w-full object-contain"
            />
          </div>
        ) : placeholder ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-600">{placeholder}</p>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            No generated output is available.
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-slate-700">
            Generation metadata
          </h3>
          <pre className="mt-1 max-h-40 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
