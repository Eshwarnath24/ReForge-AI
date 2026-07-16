import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ImageUpload from "../components/ImageUpload.jsx";
import SkillLevelSelect from "../components/SkillLevelSelect.jsx";
import ResultCard from "../components/ResultCard.jsx";
import ImpactBanner from "../components/ImpactBanner.jsx";
import LogoutButton from "../components/LogoutButton.jsx";
import AnalyzingOverlay from "../components/AnalyzingOverlay.jsx";
import { analyzeItem } from "../api.js";
import { isLoggedIn } from "../auth.js";

function ReForgePage() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Protect route
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  function handleImageSelect(file) {
    setSelectedImage(file);
    setResult(null);
  }

  function handleLogout() {
    navigate("/");
  }

  async function handleAnalyze() {
    if (!selectedImage) {
      toast.error("Pick a photo first!");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await analyzeItem(selectedImage, skillLevel);
      setResult(data);
      toast.success("Analysis complete!");
    } catch (err) {
      console.error(err);

      if (err.code === "ERR_NETWORK") {
        toast.error("Can't reach the server. Is uvicorn running on port 8000?");
      } else if (err.response) {
        toast.error(`Server error (${err.response.status}). Check server logs.`);
      } else {
        toast.error("Something went wrong. Check the console for details.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (!isLoggedIn()) return null;

  return (
    <div className="min-h-screen" style={{
      background: "linear-gradient(180deg, #e8f5e9 0%, #f4f7f4 40%, #f9faf9 100%)"
    }}>
      {/* Header bar */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">♻️</span>
            <h1 className="text-xl font-bold text-green-800 leading-none">ReForge AI</h1>
          </div>
          <LogoutButton onLogout={handleLogout} />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Upload & controls card */}
        <div className="relative bg-white rounded-2xl shadow-sm border border-green-100/80 p-6 mb-6">
          <h2 className="text-lg font-semibold text-green-900 mb-1">What do you have?</h2>
          <p className="text-sm text-green-700/60 mb-5">
            Upload a photo and we'll find upcycling ideas for it.
          </p>

          <ImageUpload onImageSelect={handleImageSelect} />
          <SkillLevelSelect value={skillLevel} onChange={setSkillLevel} />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-3 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>

          {/* Staged loading overlay */}
          {loading && <AnalyzingOverlay />}
        </div>

        {/* Impact banner */}
        {result && <ImpactBanner impact={result.impact_estimate} />}

        {/* Results */}
        <ResultCard result={result} />
      </main>
    </div>
  );
}

export default ReForgePage;
