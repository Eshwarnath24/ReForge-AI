import { useState } from "react";
import toast from "react-hot-toast";
import { sendFeedback } from "../api.js";

function MatchItem({ match, index }) {
  const [voted, setVoted] = useState(null); // "like" | "dislike" | null

  async function handleVote(vote) {
    try {
      await sendFeedback(match.source, match.id, match.title, [match.difficulty], vote);
      setVoted(vote);
      toast.success(vote === "like" ? "Thanks for the feedback!" : "Got it, noted.");
    } catch (err) {
      toast.error("Couldn't save feedback. Try again.");
    }
  }

  const isYoutube = match.source === "youtube_video";

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-3 bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-green-700 font-semibold">
          #{index + 1} — {match.title}
        </h3>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            isYoutube ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
          }`}
        >
          {isYoutube ? "YouTube" : "Verified"}
        </span>
      </div>

      {isYoutube && match.thumbnail && (
        <a href={match.url} target="_blank" rel="noreferrer">
          <img
            src={match.thumbnail}
            alt={match.title}
            className="rounded-md mb-2 max-w-[240px]"
          />
        </a>
      )}

      {isYoutube && match.channel && (
        <p className="text-xs text-gray-500 mb-2">Channel: {match.channel}</p>
      )}

      <p className="text-gray-700 mb-2">
        <span className="font-semibold">Why:</span> {match.reason}
      </p>

      <p className="text-gray-700 mb-2">
        <span className="font-semibold">Difficulty:</span> {match.difficulty}
        {"  "}|{"  "}
        <span className="font-semibold">Time:</span> {match.estimated_time_minutes} min
      </p>

      {match.missing_items?.length > 0 && (
        <div className="mb-2">
          <span className="font-semibold text-gray-800">Missing items:</span>
          <ul className="list-disc list-inside text-gray-600">
            {match.missing_items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {match.adapted_steps && (
        <div className="mb-2">
          <span className="font-semibold text-gray-800">Steps:</span>
          <ol className="list-decimal list-inside text-gray-600">
            {match.adapted_steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {match.safety_notes?.length > 0 && (
        <div className="mb-3">
          <span className="font-semibold text-amber-700">⚠ Safety notes:</span>
          <ul className="list-disc list-inside text-amber-700">
            {match.safety_notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {isYoutube && (
        <a
          href={match.url}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-600 hover:underline block mb-3"
        >
          Watch on YouTube →
        </a>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => handleVote("like")}
          disabled={voted !== null}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            voted === "like"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-green-100"
          } disabled:cursor-not-allowed`}
        >
          👍 Like
        </button>
        <button
          onClick={() => handleVote("dislike")}
          disabled={voted !== null}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            voted === "dislike"
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-red-100"
          } disabled:cursor-not-allowed`}
        >
          👎 Dislike
        </button>
      </div>
    </div>
  );
}

function ResultCard({ result }) {
  if (!result) return null;

  if (result.recommendation === "no_suitable_idea") {
    return (
      <div className="border border-gray-200 rounded-lg p-4 mt-4 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          No Suitable Upcycling Idea Found
        </h2>
        <p className="text-gray-600 mb-2">{result.reason}</p>
        <p className="text-gray-800">
          <span className="font-semibold">Suggested alternative:</span>{" "}
          {result.fallback_suggestion}
        </p>
      </div>
    );
  }

  if (result.recommendation === "upcycle" && result.matches) {
    return (
      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Top Recommendations
        </h2>
        {result.matches.map((match, index) => (
          <MatchItem key={match.id || index} match={match} index={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 mt-4 bg-gray-50">
      <p className="text-gray-600 mb-2">Unexpected response format:</p>
      <pre className="text-xs overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}

export default ResultCard;