interface ImagePreviewProps {
  imageUrl: string | null;
}

export default function ImagePreview({ imageUrl }: ImagePreviewProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Image preview</h2>
      <p className="mt-1 text-sm text-slate-600">
        The selected image will appear here. If nothing is selected, you can
        still enter a prompt.
      </p>

      <div className="mt-4 flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Selected cosplay preview"
            className="h-full w-full rounded-lg object-contain"
          />
        ) : (
          <span className="text-sm text-slate-400">No image selected</span>
        )}
      </div>
    </div>
  );
}
