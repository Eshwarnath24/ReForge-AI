import { useEffect, useRef, useState } from "react";

function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error(err);
        setError("Couldn't access the camera. Check your browser permissions.");
      }
    }

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  function handleCapture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
      onCapture(file);
      handleClose();
    }, "image/jpeg", 0.9);
  }

  function handleClose() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl overflow-hidden max-w-lg w-full">
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Take a photo</h3>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 text-xl leading-none">
            ✕
          </button>
        </div>

        <div className="relative bg-black aspect-video flex items-center justify-center">
          {error ? (
            <p className="text-white text-sm p-6 text-center">{error}</p>
          ) : (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain" />
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="p-4 flex justify-center">
          <button
            onClick={handleCapture}
            disabled={!!error}
            className="px-6 py-3 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            📸 Capture
          </button>
        </div>
      </div>
    </div>
  );
}

export default CameraCapture;