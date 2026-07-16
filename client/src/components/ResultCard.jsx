import { useState } from "react";
import toast from "react-hot-toast";
import { sendFeedback } from "../api.js";

function MatchItem({ match, index }) {
  const [voted, setVoted] = useState(null); // "like" | "dislike" | null

  async function handleVote(vote) {
    const newVote = voted === vote ? null : vote; // clicking same button again clears it

    try {
      if (newVote) {
        await sendFeedback(match.source, match.id, match.title, [match.difficulty], newVote);
        toast.success(newVote === "like" ? "Thanks for the feedback!" : "Got it, noted.");
      }
      setVoted(newVote);
    } catch (err) {
      toast.error("Couldn't save feedback. Try again.");
    }
  }

  const isYoutube = match.source === "youtube_video";

  return (
    <div className={`rounded-3xl p-6 mb-5 bg-white/90 shadow-sm border transition-all duration-300 hover:shadow-md ${
      isYoutube
        ? "border-l-4 border-l-red-500 border-t-[#e6dfcd]/80 border-r-[#e6dfcd]/80 border-b-[#e6dfcd]/80"
        : "border-l-4 border-l-[#386641] border-t-[#e6dfcd]/80 border-r-[#e6dfcd]/80 border-b-[#e6dfcd]/80"
    }`}>
      {/* Title + badge row */}
      <div className="flex items-start gap-3 mb-4">
        <h3 className="text-[#1a2f22] font-bold text-lg flex-1 leading-snug">
          #{index + 1} — {match.title}
        </h3>
        {isYoutube ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-red-500 text-white whitespace-nowrap shadow-sm">
            <span className="text-[10px]">▶</span> YouTube
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-[#f4eee2] text-[#234b32] whitespace-nowrap border border-[#e6dfcd]">
            ✓ Verified
          </span>
        )}
      </div>

      {/* YouTube thumbnail */}
      {isYoutube && match.thumbnail && (
        <a href={match.url} target="_blank" rel="noreferrer" className="block mb-3">
          <img
            src={match.thumbnail}
            alt={match.title}
            className="rounded-xl max-w-[280px] border border-gray-100 hover:opacity-90 transition-opacity"
          />
        </a>
      )}

      {isYoutube && match.channel && (
        <p className="text-xs text-gray-400 mb-3 font-medium">Channel: {match.channel}</p>
      )}

      {/* Reason */}
      <div className="mb-4 bg-[#f9f8f3] rounded-2xl p-4 border border-[#e6dfcd]/50">
        <p className="text-[#1a2f22] text-sm leading-relaxed">
          <span className="font-bold text-[#234b32]">Why this:</span> {match.reason}
        </p>
      </div>

      {/* Difficulty + time */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-xl bg-[#f4eee2] text-[#4f6355]">
          🎯 {match.difficulty}
        </span>
        <span className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-xl bg-[#f4eee2] text-[#4f6355]">
          ⏱ {match.estimated_time_minutes} min
        </span>
      </div>

      {/* Missing items */}
      {match.missing_items?.length > 0 && (
        <div className="mb-3 bg-amber-50/60 rounded-xl p-3">
          <span className="font-semibold text-amber-800 text-sm">You'll also need:</span>
          <ul className="list-disc list-inside text-gray-600 text-sm mt-1 space-y-0.5">
            {match.missing_items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Adapted steps */}
      {match.adapted_steps && (
        <div className="mb-4">
          <span className="font-bold text-[#1a2f22] text-sm">Steps:</span>
          <ol className="list-decimal list-inside text-[#4f6355] text-sm mt-2 space-y-1.5">
            {match.adapted_steps.map((step, i) => (
              <li key={i} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Safety notes */}
      {match.safety_notes?.length > 0 && (
        <div className="mb-3 bg-amber-50 border border-amber-200/60 rounded-xl p-3">
          <span className="font-semibold text-amber-700 text-sm">⚠ Heads up:</span>
          <ul className="list-disc list-inside text-amber-700 text-sm mt-1 space-y-0.5">
            {match.safety_notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* YouTube link */}
      {isYoutube && (
        <a
          href={match.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium mb-3 transition-colors no-underline hover:underline"
        >
          <span>▶</span> Watch on YouTube →
        </a>
      )}

      {/* Voting */}
      <div className="flex gap-2 pt-4 border-t border-[#e6dfcd]/60 mt-2">
        <button
          onClick={() => handleVote("like")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${voted === "like"
            ? "bg-[#386641] text-white shadow-md shadow-[#386641]/20"
            : "bg-[#f9f8f3] text-[#4f6355] hover:bg-[#f4eee2] hover:text-[#234b32] border border-[#e6dfcd]"
            }`}
        >
          👍 Helpful
        </button>
        <button
          onClick={() => handleVote("dislike")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${voted === "dislike"
            ? "bg-red-600 text-white shadow-md shadow-red-600/20"
            : "bg-[#f9f8f3] text-[#4f6355] hover:bg-[#f4eee2] hover:text-red-700 border border-[#e6dfcd]"
            }`}
        >
          👎 Not useful
        </button>
      </div>
    </div>
  );
}

function ResultCard({ result }) {
  if (!result) return null;

  if (result.recommendation === "no_suitable_idea") {
    return (
      <div className="rounded-3xl p-8 mt-2 bg-white/90 border border-[#e6dfcd]/80 shadow-sm backdrop-blur-sm">
        <div className="text-center py-4">
          <div className="text-5xl mb-4">🤔</div>
          <h2 className="text-xl font-bold text-[#1a2f22] mb-2">
            Hmm, nothing quite fits
          </h2>
          <p className="text-[#4f6355] mb-5 max-w-sm mx-auto text-sm leading-relaxed">{result.reason}</p>
          <div className="bg-[#f9f8f3] rounded-2xl p-5 border border-[#e6dfcd]/50 max-w-sm mx-auto">
            <p className="text-[#234b32] text-sm">
              <span className="font-bold">Try this instead:</span>{" "}
              {result.fallback_suggestion}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (result.recommendation === "upcycle" && result.matches) {
    return (
      <div className="mt-2">
        <h2 className="text-xl font-bold text-[#1a2f22] mb-5 flex items-center gap-2">
          <span>✨</span> Here's what you can make
        </h2>
        {result.matches.map((match, index) => (
          <MatchItem key={match.id || index} match={match} index={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 mt-2 bg-white border border-gray-100 shadow-sm">
      <p className="text-gray-500 mb-2 text-sm">Unexpected response format:</p>
      <pre className="text-xs overflow-x-auto bg-gray-50 p-3 rounded-xl">{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}

export default ResultCard;