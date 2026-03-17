"use client";

interface GeneratePanelProps {
  enabled: boolean;
  loading: boolean;
  onGenerate: () => Promise<void>;
}

export default function GeneratePanel({
  enabled,
  loading,
  onGenerate,
}: GeneratePanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Generate output</h2>
      <p className="mt-1 text-sm text-slate-600">
        Use the final prompt from analysis to generate a polished cosplay effect
        result.
      </p>

      <button
        type="button"
        onClick={onGenerate}
        disabled={!enabled || loading}
        className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {!enabled ? (
        <p className="mt-3 text-sm text-slate-500">
          Analyze a photo first to enable generation.
        </p>
      ) : null}
    </div>
  );
}
