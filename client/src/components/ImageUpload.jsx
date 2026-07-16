import { useState } from "react";

function ImageUpload({ onImageSelect }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    onImageSelect(file);
  }

  return (
    <div className="mb-4">
      <label htmlFor="image-input" className="block font-semibold mb-2 text-gray-800">
        Upload a photo of your item(s)
      </label>
      <input
        id="image-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-green-600 file:text-white file:font-medium hover:file:bg-green-700 file:cursor-pointer cursor-pointer"
      />

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="mt-3 max-w-[300px] rounded-lg border border-gray-200 shadow-sm"
        />
      )}
    </div>
  );
}

export default ImageUpload;