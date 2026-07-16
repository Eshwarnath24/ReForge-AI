import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../auth.js";

function LandingPage() {
  const navigate = useNavigate();

  function handleGetStarted() {
    if (isLoggedIn()) {
      navigate("/app");
    } else {
      navigate("/auth");
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: "linear-gradient(160deg, #e8f5e9 0%, #f1f8e9 30%, #fff8e1 70%, #fce4ec08 100%)"
    }}>
      {/* Decorative floating elements */}
      <div className="absolute top-16 left-8 text-5xl opacity-20 animate-float select-none pointer-events-none" aria-hidden="true">🍃</div>
      <div className="absolute top-40 right-12 text-4xl opacity-15 animate-float-reverse select-none pointer-events-none" aria-hidden="true">🌱</div>
      <div className="absolute bottom-32 left-16 text-3xl opacity-15 animate-float select-none pointer-events-none" aria-hidden="true">♻️</div>
      <div className="absolute bottom-20 right-20 text-5xl opacity-10 animate-float-reverse select-none pointer-events-none" aria-hidden="true">🌿</div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo / Title */}
        <div className="landing-fade-in text-center mb-2">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-4xl">♻️</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight" style={{
            background: "linear-gradient(135deg, #2e7d32, #388e3c, #1b5e20)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            ReForge AI
          </h1>
        </div>

        {/* Tagline */}
        <p className="landing-fade-in landing-fade-in-delay-1 text-xl sm:text-2xl text-green-900/70 font-medium text-center max-w-lg mt-3 mb-8 leading-relaxed">
          Give every discarded item its smartest second life.
        </p>

        {/* Explanation */}
        <div className="landing-fade-in landing-fade-in-delay-2 max-w-md text-center mb-10">
          <p className="text-base text-green-900/60 leading-relaxed">
            Got stuff you'd normally toss? Take a photo, tell us your skill level,
            and we'll find real upcycling projects you can actually make —
            with step-by-step instructions and everything.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="landing-fade-in landing-fade-in-delay-3 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full mb-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 text-center border border-green-200/50 hover:border-green-300/70 hover:bg-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-3xl mb-3">📸</div>
            <p className="text-sm font-semibold text-green-800 mb-1">Snap a photo</p>
            <p className="text-xs text-green-700/60">of anything you'd throw away</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 text-center border border-green-200/50 hover:border-green-300/70 hover:bg-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-3xl mb-3">🧠</div>
            <p className="text-sm font-semibold text-green-800 mb-1">AI finds real projects</p>
            <p className="text-xs text-green-700/60">matched to your skill level</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 text-center border border-green-200/50 hover:border-green-300/70 hover:bg-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-3xl mb-3">🌱</div>
            <p className="text-sm font-semibold text-green-800 mb-1">See your impact</p>
            <p className="text-xs text-green-700/60">waste diverted, CO₂ saved</p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          className="landing-fade-in landing-fade-in-delay-4 px-8 py-3.5 rounded-xl bg-green-600 text-white text-lg font-semibold hover:bg-green-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/30"
        >
          Get Started →
        </button>

        {/* Subtle footer note */}
        <p className="landing-fade-in landing-fade-in-delay-4 text-xs text-green-800/30 mt-8">
          Free to use · No credit card needed
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
