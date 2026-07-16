import { useState, useEffect } from "react";

const STAGES = [
  { message: "Looking at your photo", delay: 0 },
  { message: "Checking what\u2019s possible", delay: 3000 },
  { message: "Comparing a few ideas", delay: 7500 },
  { message: "Almost done", delay: 13000 },
];

function AnalyzingOverlay() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const timers = STAGES.slice(1).map((stage, i) =>
      setTimeout(() => setCurrentStage(i + 1), stage.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const stage = STAGES[currentStage];

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 px-6 py-8">
        {/* Pulsing leaf icon */}
        <div className="text-4xl" style={{ animation: "gentlePulse 2s ease-in-out infinite" }}>
          🌿
        </div>

        {/* Stage message */}
        <p
          key={currentStage}
          className="stage-message-enter text-lg font-medium text-green-800 text-center"
        >
          {stage.message}
          <span className="dot-animation inline-flex ml-0.5 gap-0.5">
            <span className="inline-block text-green-600">.</span>
            <span className="inline-block text-green-600">.</span>
            <span className="inline-block text-green-600">.</span>
          </span>
        </p>

        {/* Subtle progress dots */}
        <div className="flex gap-2 mt-2">
          {STAGES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= currentStage
                  ? "w-6 bg-green-500"
                  : "w-1.5 bg-green-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnalyzingOverlay;
