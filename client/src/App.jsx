import { useState } from "react";
import toast from "react-hot-toast";
import ImageUpload from "./components/ImageUpload.jsx";
import SkillLevelSelect from "./components/SkillLevelSelect.jsx";
import ResultCard from "./components/ResultCard.jsx";
import ImpactBanner from "./components/ImpactBanner.jsx";
import LogoutButton from "./components/LogoutButton.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { analyzeItem } from "./api.js";
import { isLoggedIn } from "./auth.js";

function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [selectedImage, setSelectedImage] = useState(null);
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!loggedIn) {
    return <AuthPage onAuthSuccess={() => setLoggedIn(true)} />;
  }

  function handleImageSelect(file) {
    setSelectedImage(file);
    setResult(null);
  }

  async function handleAnalyze() {
    if (!selectedImage) {
      toast.error("Please select an image first.");
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

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        <LogoutButton onLogout={() => setLoggedIn(false)} />

        <h1 className="text-3xl font-bold text-green-800">ReForge AI</h1>
        <p className="text-gray-600 mb-6">
          Give every discarded item its smartest second life.
        </p>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <ImageUpload onImageSelect={handleImageSelect} />
          <SkillLevelSelect value={skillLevel} onChange={setSkillLevel} />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-2 px-5 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {result && <ImpactBanner impact={result.impact_estimate} />}
        <ResultCard result={result} />
      </div>
    </div>
  );
}

export default App;