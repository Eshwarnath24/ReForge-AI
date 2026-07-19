import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../auth.js";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import {
  Sprout, ScanLine, ArrowRight,
  Database, Bot, Activity,
} from "../components/Icons.jsx";

function MailIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ExternalLinkIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.classList.remove('opacity-0');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  function handleGetStarted() {
    navigate(isLoggedIn() ? "/reforgepage" : "/auth");
  }

  function handleScroll(e, targetId) {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-emerald-200 relative">
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-2xl tracking-tight">
            <div className="w-10 h-10 rounded-[14px] bg-[#00cfa5] flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            ReForge <span className="text-[#00cfa5] font-bold">AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="hover:text-emerald-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" onClick={(e) => handleScroll(e, 'how-it-works')} className="hover:text-emerald-600 transition-colors">
              How it works
            </a>
            <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="hover:text-emerald-600 transition-colors">
              Contact
            </a>
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
      <section id="features" className="relative z-10 py-32 bg-white/40 backdrop-blur-xl border-t border-white/50 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
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


        {/* How It Works - Pipeline */}
        <section id="how-it-works" className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
                How it works
              </h2>
              <p className="text-slate-600">From photo to project, in a few seconds.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "01", label: "Upload a photo", desc: "Snap or drag in a picture of what you'd normally throw out." },
                { step: "02", label: "AI detects items", desc: "We identify the materials and condition automatically." },
                { step: "03", label: "Agent reasons", desc: "Checks our verified database, YouTube, and your past preferences." },
                { step: "04", label: "Get your project", desc: "Top 3 ranked ideas — with steps, safety notes, and impact." },
              ].map((item, i) => (
                <div key={i} className="scroll-animate opacity-0 relative bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm p-6 group hover:-translate-y-2 hover:shadow-xl hover:bg-white/80 transition-all duration-300" style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="inline-flex items-center justify-center min-w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-3xl font-bold mb-4 shadow-sm group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{item.label}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-5 z-20 -translate-y-1/2 text-emerald-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-300">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / About Footer */}
        <footer id="contact" className="relative z-10 py-16 px-6 border-t border-white/50">
          <div className="max-w-sm mx-auto">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500">
                <span className="text-emerald-700 font-bold text-lg">GE</span>
              </div>

              <h3 className="font-bold text-slate-900 text-lg">Gajula Eshwarnath</h3>
              <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wider mt-1 mb-6">
                Full Stack Developer & AI Engineer
              </p>

              <div className="flex items-center justify-center gap-4">
                <a
                  href="mailto:gajulaeshwarnath13@gmail.com"
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300"
                >
                  <MailIcon className="w-4 h-4" />
                </a>

                <a
                  href="https://github.com/Eshwarnath24/ReForge-AI"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}

export default LandingPage;
