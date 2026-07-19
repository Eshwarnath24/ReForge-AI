import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import AnalyzingOverlay, { LOADING_MESSAGES } from "../components/AnalyzingOverlay.jsx";
import { analyzeItem, sendFeedback } from "../api.js";
import { isLoggedIn, clearAuth, getEmail } from "../auth.js";
import {
  Sprout, UploadCloud, X, Check,
  Leaf, Wind, Clock, Wrench, AlertTriangle,
  ThumbsUp, ThumbsDown, Bot, Database, Youtube,
  Target, ChevronRight,
} from "../components/Icons.jsx";

// Delays between loading-message advances (ms). Front-loaded so it feels
// responsive, then slows down to match deeper AI processing.
const MESSAGE_DELAYS = [1500, 1800, 2000, 1500, 2200, 1500];

/* ── tiny inline SVG icon ──────────────────────────── */
function PlusIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

/* ── Single result card (used inside ResultsState) ─── */
function MatchCard({ match, index }) {
  const [voted, setVoted] = useState(null); // "like" | "dislike" | null

  const isYoutube = match.source === "youtube_video";

  async function handleVote(vote) {
    const newVote = voted === vote ? null : vote; // toggle off if same
    try {
      if (newVote) {
        await sendFeedback(
          match.source,
          match.id,
          match.title,
          [match.difficulty],
          newVote,
        );
        toast.success(
          newVote === "like" ? "Thanks for the feedback!" : "Got it, noted.",
        );
      }
      setVoted(newVote);
    } catch {
      toast.error("Couldn't save feedback. Try again.");
    }
  }

  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all relative overflow-hidden group">
      {/* ── Header: badges, title, reasoning, vote ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {!isYoutube ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-semibold uppercase tracking-wider">
                <Database className="w-3 h-3" /> ReForge DB Match
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[10px] font-semibold uppercase tracking-wider">
                <Youtube className="w-3 h-3" /> YouTube Match
              </span>
            )}
            {index === 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-semibold uppercase tracking-wider">
                <Target className="w-3 h-3" /> Optimal For You
              </span>
            )}
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            {match.title}
          </h3>

          {/* AI reasoning box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100">
              <Bot className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-900 block mb-1">AI Agent Reasoning</span>
              <p className="text-slate-600 text-sm leading-relaxed">{match.reason}</p>
            </div>
          </div>
        </div>

        {/* Vote buttons */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => handleVote("like")}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all shadow-sm ${voted === "like"
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "bg-white border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50"
              }`}
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleVote("dislike")}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all shadow-sm ${voted === "dislike"
                ? "bg-rose-500 border-rose-500 text-white"
                : "bg-white border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50"
              }`}
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Grid: specs / steps ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col gap-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Time Needed</span>
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <Clock className="w-4 h-4 text-emerald-500" /> {match.estimated_time_minutes} min
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col gap-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Required Skill</span>
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <Wrench className="w-4 h-4 text-emerald-500" /> {match.difficulty}
              </div>
            </div>
          </div>

          {/* YouTube thumbnail (clickable) */}
          {isYoutube && match.thumbnail && (
            <a href={match.url} target="_blank" rel="noreferrer" className="block">
              <div className="relative rounded-xl overflow-hidden group/thumb cursor-pointer border border-slate-200 aspect-video shadow-sm">
                <img src={match.thumbnail} alt={match.title} className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-slate-900/20 group-hover/thumb:bg-slate-900/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover/thumb:scale-110 transition-transform">
                    <Youtube className="w-5 h-5 text-rose-600" />
                  </div>
                </div>
              </div>
              {match.channel && (
                <p className="text-xs text-slate-500 font-medium mt-2">Channel: {match.channel}</p>
              )}
            </a>
          )}

          {/* YouTube link fallback (no thumbnail) */}
          {isYoutube && match.url && !match.thumbnail && (
            <a href={match.url} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-rose-600 hover:text-rose-700 font-medium">
              <Youtube className="w-4 h-4" /> Watch on YouTube →
            </a>
          )}

          {/* Missing materials */}
          {match.missing_items?.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Missing Materials</h4>
              <ul className="space-y-3">
                {match.missing_items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                    <div className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                      <PlusIcon className="w-3 h-3" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right column (2-wide) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Steps */}
          {match.adapted_steps?.length > 0 && (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex-1">
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-6">Execution Steps</h4>
              <div className="space-y-6">
                {match.adapted_steps.map((step, i) => (
                  <div key={i} className="flex gap-4 group/step">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 font-semibold text-xs flex items-center justify-center shrink-0 group-hover/step:bg-emerald-50 group-hover/step:text-emerald-600 group-hover/step:border-emerald-200 transition-colors z-10 relative shadow-sm">
                        {i + 1}
                      </div>
                      {i !== match.adapted_steps.length - 1 && (
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-full bg-slate-200 group-hover/step:bg-emerald-200 transition-colors" />
                      )}
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed pt-1.5 font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety notes */}
          {match.safety_notes?.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4 items-start shadow-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-800 text-xs font-semibold uppercase tracking-wider mb-1">Safety Protocol</h4>
                {match.safety_notes.map((note, i) => (
                  <p key={i} className="text-amber-700/80 text-sm leading-relaxed font-medium">{note}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   ReForgePage — the main working app page
   ════════════════════════════════════════════════════════ */
function ReForgePage() {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────
  const [appState, setAppState] = useState("idle"); // idle | analyzing | results
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [selectedImage, setSelectedImage] = useState(null); // File object
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const pendingResult = useRef(null);
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  // ── Route protection ───────────────────────────────
  // Handled by App.jsx guard

  // ── Loading-message cycling + transition to results ─
  //
  // Messages advance on their own timers while the real API call runs.
  // • If the API finishes early (before all messages shown), we let
  //   messages continue to at least step 2, then jump to the final
  //   "Finalizing..." message so the animation doesn't feel cut short.
  // • If the API takes longer than the full message cycle, we hold
  //   on the last message until the response arrives.
  //
  useEffect(() => {
    if (appState !== "analyzing") return;

    const isLast = loadingStep >= LOADING_MESSAGES.length - 1;

    if (isLast) {
      // On last message — poll until API result is ready
      const check = setInterval(() => {
        if (pendingResult.current) {
          clearInterval(check);
          setTimeout(() => {
            setResult(pendingResult.current);
            setAppState("results");
            toast.success("Analysis complete!");
          }, 600);
        }
      }, 300);
      return () => clearInterval(check);
    }

    const timer = setTimeout(() => {
      // API already responded and we've shown at least 3 messages?
      // Jump to the final message so we can transition soon.
      if (pendingResult.current && loadingStep >= 2) {
        setLoadingStep(LOADING_MESSAGES.length - 1);
      } else {
        setLoadingStep((prev) => prev + 1);
      }
    }, MESSAGE_DELAYS[loadingStep]);

    return () => clearTimeout(timer);
  }, [appState, loadingStep]);

  // ── File handling ──────────────────────────────────
  function handleFileSelect(file) {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setFileName(file.name);
    setResult(null);
  }

  function handleFileInputChange(e) {
    handleFileSelect(e.target.files[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function clearUpload() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedImage(null);
    setPreviewUrl(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Analyze (real API call) ────────────────────────
  async function startAnalysis() {
    if (!selectedImage) {
      toast.error("Pick a photo first!");
      return;
    }
    setAppState("analyzing");
    setLoadingStep(0);
    setResult(null);
    pendingResult.current = null;

    abortControllerRef.current = new AbortController();

    try {
      const data = await analyzeItem(selectedImage, skillLevel, abortControllerRef.current.signal);
      pendingResult.current = data;
    } catch (err) {
      if (err.code === "ERR_CANCELED" || err.name === "CanceledError") {
        // User cancelled — already handled in cancelAnalysis(), do nothing here
        return;
      }
      console.error(err);
      if (err.code === "ERR_NETWORK") {
        toast.error("Can't reach the server. Is uvicorn running on port 8000?");
      } else if (err.response) {
        toast.error(`Server error (${err.response.status}). Check server logs.`);
      } else {
        toast.error("Something went wrong. Check the console.");
      }
      setAppState("idle");
      pendingResult.current = null;
    }
  }

  // ── Reset / Logout ─────────────────────────────────
  function resetApp() {
    setAppState("idle");
    clearUpload();
    setResult(null);
    setLoadingStep(0);
  }

  function handleLogout() {
    clearAuth();
    navigate("/");
  }

  // ── Guard ──────────────────────────────────────────
  // Handled by App.jsx guard

  const userEmail = getEmail() || "";
  const userInitial = userEmail.charAt(0).toUpperCase() || "?";

  function formatWeight(grams) {
    if (grams == null) return "—";
    return grams >= 1000 ? `${(grams / 1000).toFixed(1)}kg` : `${grams}g`;
  }

  // ──────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen relative flex flex-col z-0">
      <AnimatedBackground />

      {/* ── App Header ───────────────────────────────── */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 text-slate-900 font-bold text-xl cursor-pointer hover:opacity-80 transition-opacity"
            onClick={resetApp}
          >
            <div className="w-8 h-8 rounded-[11px] bg-[#00cfa5] flex items-center justify-center">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            ReForge <span className="text-[#00cfa5] font-bold">AI</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              title={`Logged in as ${userEmail} — click to log out`}
              className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-sm cursor-pointer hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
            >
              {userInitial}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 lg:px-8 relative z-10">
        {/* ── IDLE: Upload + controls ──────────────── */}
        {appState === "idle" && (
          <div className="max-w-2xl mx-auto w-full animate-fade-in-up text-center pt-8">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                What are we upcycling?
              </h2>
              <p className="text-slate-500">
                Upload a photo of your discarded item. Our AI will analyze
                materials and generate projects.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
              {/* Hidden real file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {!selectedImage ? (
                /* ─ Drop zone ─ */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all group ${isDragging
                      ? "border-emerald-400 bg-emerald-50/50"
                      : "border-slate-200 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300"
                    }`}
                >
                  <div className="w-16 h-16 bg-white border border-slate-100 text-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <p className="text-slate-800 font-semibold text-lg mb-1">
                    Click or drag to upload photo
                  </p>
                  <p className="text-slate-400 text-sm font-medium">
                    Supports JPG, PNG, WebP
                  </p>
                </div>
              ) : (
                /* ─ Image preview ─ */
                <div className="relative rounded-3xl overflow-hidden bg-slate-100 aspect-[16/9] flex items-center justify-center border border-slate-200 shadow-inner">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Upload preview"
                      className="w-full h-full object-contain"
                    />
                  )}

                  {/* Remove button */}
                  <div className="absolute top-4 right-4 z-20">
                    <button
                      onClick={clearUpload}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-500 hover:bg-white hover:text-red-500 transition-colors shadow-sm border border-slate-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Status badges */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 z-20">
                    <span className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-lg">
                      <Check className="w-3.5 h-3.5" />
                      Upload Secure
                    </span>
                    <span className="px-3 py-1.5 bg-white/80 backdrop-blur-sm text-slate-600 text-xs font-medium rounded-lg border border-slate-200 shadow-sm truncate max-w-[200px]">
                      {fileName}
                    </span>
                  </div>
                </div>
              )}

              {/* Skill level + Generate button */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full text-left">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Available Tools / Skill Level
                  </label>
                  <div className="relative">
                    <select
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium appearance-none cursor-pointer"
                    >
                      <option value="Beginner">Beginner (Scissors, glue, basic tools)</option>
                      <option value="Intermediate">Intermediate (Drill, basic hardware)</option>
                      <option value="Advanced">Advanced (Power tools, crafting experience)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      ▼
                    </div>
                  </div>
                </div>
                <button
                  onClick={startAnalysis}
                  disabled={!selectedImage}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${selectedImage
                      ? "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    }`}
                >
                  Generate Ideas
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ANALYZING ───────────────────────────────── */}
        {appState === "analyzing" && (
          <AnalyzingOverlay currentStep={loadingStep} />
        )}

        {/* ── RESULTS ─────────────────────────────────── */}
        {appState === "results" && result && (
          <div className="max-w-5xl mx-auto w-full animate-fade-in-up pb-20 pt-8">
            {result.recommendation === "no_suitable_idea" ? (
              /* ─ Empty state ─ */
              <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center max-w-2xl mx-auto">
                <div className="text-5xl mb-4">🤔</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Hmm, nothing quite fits
                </h2>
                <p className="text-slate-500 mb-6 leading-relaxed">
                  {result.reason}
                </p>
                {result.fallback_suggestion && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-left">
                    <div className="flex gap-3 items-start">
                      <Bot className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-slate-900 block mb-1">
                          AI Suggestion
                        </span>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {result.fallback_suggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={resetApp}
                  className="mt-8 px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all"
                >
                  Try another item
                </button>
              </div>
            ) : result.recommendation === "upcycle" && result.matches ? (
              <>
                {/* ─ Impact banner ─ */}
                {result.impact_estimate && (
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-50 rounded-full blur-[60px] pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium uppercase tracking-wider mb-2">
                        <Check className="w-4 h-4" /> Analysis Complete
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-1">
                        Found {result.matches.length} realistic project
                        {result.matches.length !== 1 ? "s" : ""}.
                      </h2>
                      <p className="text-slate-500 text-sm">
                        Optimized for &lsquo;{skillLevel}&rsquo; tools based on
                        your uploaded image.
                      </p>
                      {result.impact_estimate.note && (
                        <p className="text-xs text-slate-400 mt-2">
                          {result.impact_estimate.note}
                        </p>
                      )}
                    </div>

                    <div className="flex bg-slate-50 border border-slate-100 rounded-xl p-4 gap-8 relative z-10">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-1.5 mb-0.5">
                          <Leaf className="w-5 h-5 text-emerald-500" />
                          {formatWeight(result.impact_estimate.estimated_waste_diverted_grams)}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                          Waste Diverted
                        </div>
                      </div>
                      <div className="w-px bg-slate-200" />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-1.5 mb-0.5">
                          <Wind className="w-5 h-5 text-teal-500" />
                          {formatWeight(result.impact_estimate.estimated_co2_saved_grams)}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                          CO₂ Saved
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─ Result cards ─ */}
                <div className="space-y-6">
                  {result.matches.map((match, index) => (
                    <MatchCard
                      key={match.id || index}
                      match={match}
                      index={index}
                    />
                  ))}
                </div>

                <div className="mt-12 text-center">
                  <button
                    onClick={resetApp}
                    className="text-emerald-600 font-semibold text-sm hover:text-emerald-700 inline-flex items-center gap-1 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 transition-colors"
                  >
                    Scan another item <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              /* ─ Unexpected response shape ─ */
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm max-w-2xl mx-auto">
                <p className="text-slate-500 mb-3 text-sm">
                  Unexpected response format:
                </p>
                <pre className="text-xs overflow-x-auto bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {JSON.stringify(result, null, 2)}
                </pre>
                <button
                  onClick={resetApp}
                  className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default ReForgePage;
