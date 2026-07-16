import { useState } from "react";

function ImageUpload({ onImageSelect }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    onImageSelect(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    setPreviewUrl(URL.createObjectURL(file));
    onImageSelect(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  return (
    <div className="mb-5">
      <label htmlFor="image-input" className="block font-semibold mb-2 text-gray-800 text-sm">
        Upload a photo of your item
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
          isDragging
            ? "border-green-500 bg-green-50"
            : previewUrl
              ? "border-green-300 bg-green-50/30"
              : "border-gray-200 bg-gray-50/50 hover:border-green-400 hover:bg-green-50/30"
        }`}
      >
        <input
          id="image-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        {previewUrl ? (
          <div className="p-3">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-[240px] mx-auto rounded-lg border border-gray-200 shadow-sm object-contain"
            />
            <p className="text-xs text-green-600/60 text-center mt-2 font-medium">
              Click or drag to replace
            </p>
          </div>
        ) : (
          <div className="py-8 px-4 text-center">
            <div className="text-3xl mb-2 opacity-40">📷</div>
            <p className="text-sm text-gray-500 font-medium">
              Drop a photo here, or <span className="text-green-600 font-semibold">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — any size</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;