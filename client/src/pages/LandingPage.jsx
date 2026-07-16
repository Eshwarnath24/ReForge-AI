import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../auth.js";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import {
  Sprout, ScanLine, ArrowRight,
  Database, Bot, Activity,
} from "../components/Icons.jsx";

function LandingPage() {
  const navigate = useNavigate();

  function handleGetStarted() {
    navigate(isLoggedIn() ? "/app" : "/auth");
  }

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-emerald-200 relative">
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-2xl tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            ReForge<span className="text-emerald-600 font-light">AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleGetStarted}
              className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors bg-transparent"
            >
              Log in
            </button>
            <button
              onClick={handleGetStarted}
              className="group relative px-6 py-2.5 bg-slate-900 text-white rounded-full font-medium text-sm hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-emerald-600 text-xs font-medium uppercase tracking-wider mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Agentic Upcycling Engine
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 tracking-tight leading-[1.15] mb-6 animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            Give every discarded item its <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 font-bold">
              smartest second life.
            </span>
          </h1>

          <p
            className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up font-normal"
            style={{ animationDelay: "200ms" }}
          >
            Upload one photo. Our AI identifies the materials, reasons across
            verified databases and YouTube, and recommends the top realistic
            upcycling projects matched to your exact skill level.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center gap-5 justify-center animate-fade-in-up"
            style={{ animationDelay: "300ms" }}
          >
            <button
              onClick={handleGetStarted}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-white font-medium text-lg rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
            >
              <ScanLine className="w-5 h-5" />
              Scan an Item Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 py-32 bg-white/40 backdrop-blur-xl border-t border-white/50 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-semibold text-slate-900 mb-6">
              More than just a search engine.
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              ReForge doesn't just return links. It uses agentic reasoning to
              understand your materials, check safety, and build personalized
              projects.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-sm hover:shadow-xl hover:bg-white/80 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-indigo-500">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Verified-First Engine</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We prioritize our curated, human-verified database to ensure
                safety and realism. YouTube tutorials are only suggested when
                they genuinely outperform our internal data.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-sm hover:shadow-xl hover:bg-white/80 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-emerald-500">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Agentic Reasoning</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our AI acts as an agent. It dynamically calculates missing
                materials based on your profile, evaluates difficulty, and
                decides the best path forward.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-sm hover:shadow-xl hover:bg-white/80 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-amber-500">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Honest Limitations</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                AI shouldn't hallucinate projects. If an item is truly trash, we
                tell you plainly and provide instructions for proper recycling or
                safe disposal.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
