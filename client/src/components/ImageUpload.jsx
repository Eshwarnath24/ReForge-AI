import { useState } from "react";
import CameraCapture from "./CameraCapture.jsx";

function ImageUpload({ onImageSelect }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  function setSelectedFile(file) {
    setPreviewUrl(URL.createObjectURL(file));
    onImageSelect(file);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
  }

  function handleCameraCapture(file) {
    setSelectedFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setSelectedFile(file);
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
      <label className="block font-semibold mb-2 text-gray-800 text-sm">
        Upload a photo of your item
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-xl border-2 border-dashed transition-all duration-200 ${
          isDragging
            ? "border-green-500 bg-green-50"
            : previewUrl
              ? "border-green-300 bg-green-50/30"
              : "border-gray-200 bg-gray-50/50 hover:border-green-400 hover:bg-green-50/30"
        }`}
      >
        {previewUrl ? (
          <div className="p-4 relative z-20">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-[240px] mx-auto rounded-lg border border-gray-200 shadow-sm object-contain"
            />
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <label className="cursor-pointer text-sm bg-white border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium shadow-sm transition-colors">
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                Browse Gallery
              </label>
              <button
                onClick={() => setShowCamera(true)}
                className="text-sm bg-green-600 border border-transparent px-4 py-2 rounded-lg text-white hover:bg-green-700 font-medium shadow-sm transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                Use Camera
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 px-4 text-center relative z-20">
            <div className="text-4xl mb-3 opacity-40">📸</div>
            <p className="text-sm text-gray-600 font-medium mb-5">
              Drag and drop your photo here, or
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <label className="cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 text-gray-700 shadow-sm transition-colors">
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                Browse Gallery
              </label>
              <button
                onClick={() => setShowCamera(true)}
                className="cursor-pointer bg-green-600 border border-transparent rounded-lg px-4 py-2 text-sm font-medium hover:bg-green-700 text-white shadow-sm transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                Use Camera
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-5">JPG, PNG, WebP — any size</p>
          </div>
        )}
      </div>

      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}

export default ImageUpload;