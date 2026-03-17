"use client";

import type { ChangeEvent } from "react";

interface UploadFormProps {
  file: File | null;
  userPrompt: string;
  effectType: string;
  onFileChange: (file: File | null) => void;
  onPromptChange: (value: string) => void;
  onEffectTypeChange: (value: string) => void;
  onAnalyze: () => Promise<void>;
  loading: boolean;
  disabled: boolean;
}

const EFFECT_OPTIONS = [
  { value: "lightning", label: "Lightning" },
  { value: "fire", label: "Fire" },
  { value: "magic_circle", label: "Magic Circle" },
  { value: "weapon_glow", label: "Glowing Weapon" },
  { value: "wings", label: "Wings" },
  { value: "aura", label: "Aura" },
  { value: "particles", label: "Particles" },
  { value: "atmosphere", label: "Atmosphere" },
];

export default function UploadForm({
  file,
  userPrompt,
  effectType,
  onFileChange,
  onPromptChange,
  onEffectTypeChange,
  onAnalyze,
  loading,
  disabled,
}: UploadFormProps) {
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const nextFile = e.target.files?.[0] ?? null;
    onFileChange(nextFile);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        1. Upload & describe
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Choose a cosplay photo and tell us what effect you want. The AI will
        analyze the image and suggest a prompt.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Cosplay image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          disabled={loading}
        />
        <label className="block text-sm font-medium text-slate-700">
          Effect type
        </label>
        <select
          value={effectType}
          onChange={(e) => onEffectTypeChange(e.target.value)}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          disabled={loading}
        >
          {EFFECT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium text-slate-700">
          Describe the effect
        </label>
        <textarea
          value={userPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          placeholder="e.g., Add a glowing magic circle and soft blue aura around the cosplay character"
          disabled={loading}
        />

        <button
          type="button"
          onClick={onAnalyze}
          disabled={disabled || loading}
          className="inline-flex w-full items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "Analyzing..." : "Analyze image"}
        </button>
      </div>
    </div>
  );
}
