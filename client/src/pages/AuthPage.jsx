import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { signup, login } from "../api.js";
import { saveAuth } from "../auth.js";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = mode === "login"
        ? await login(email, password)
        : await signup(email, password);

      saveAuth(data.access_token, data.email);
      toast.success(mode === "login" ? "Welcome back!" : "Account created!");
      navigate("/app");
    } catch (err) {
      const message = err.response?.data?.detail || "Something went wrong.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{
      background: "linear-gradient(160deg, #e8f5e9 0%, #f1f8e9 40%, #f9faf9 100%)"
    }}>
      <div className="w-full max-w-sm">
        {/* Back to home */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-green-700/70 hover:text-green-800 mb-6 transition-colors no-underline"
        >
          <span>←</span> Back to home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-green-100/80 p-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">♻️</span>
            <h1 className="text-2xl font-bold text-green-800">ReForge AI</h1>
          </div>
          <p className="text-green-700/60 mb-6">
            {mode === "login" ? "Welcome back! Log in to continue." : "Create an account to get started."}
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block font-semibold mb-1.5 text-gray-800 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-gray-50/50 transition-all"
            />

            <label className="block font-semibold mb-1.5 text-gray-800 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl mb-5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-gray-50/50 transition-all"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {loading ? "Please wait…" : mode === "login" ? "Log In" : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-green-700/60 mt-5 text-center">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-green-700 font-semibold hover:underline bg-transparent p-0 text-sm"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;