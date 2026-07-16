import { Bot } from "./Icons.jsx";

export const LOADING_MESSAGES = [
  "Initializing visual recognition...",
  "Analyzing material properties...",
  "Querying ReForge verified database...",
  "Evaluating YouTube alternatives...",
  "Calculating environmental impact...",
  "Finalizing recommendations...",
];

function AnalyzingOverlay({ currentStep }) {
  const step = Math.min(currentStep, LOADING_MESSAGES.length - 1);

  return (
    <div className="max-w-lg mx-auto w-full text-center py-24 flex flex-col items-center animate-fade-in">
      {/* Dual-ring spinner */}
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
        <div
          className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent border-r-transparent animate-spin"
          style={{ animationDuration: "1.5s" }}
        />
        <div
          className="absolute inset-4 border-4 border-teal-200 rounded-full border-b-transparent border-l-transparent animate-spin-reverse"
          style={{ animationDuration: "2s" }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full m-2 shadow-sm">
          <Bot className="w-10 h-10 text-emerald-500 animate-pulse" />
        </div>
      </div>

      <h3 className="text-2xl font-semibold text-slate-900 mb-2">Agentic Processing</h3>
      <div className="h-6">
        <p key={step} className="text-emerald-600 font-medium text-sm animate-pulse">
          {LOADING_MESSAGES[step]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-10 w-full max-w-sm bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-1000 ease-linear rounded-full"
          style={{ width: `${((step + 1) / LOADING_MESSAGES.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default AnalyzingOverlay;
