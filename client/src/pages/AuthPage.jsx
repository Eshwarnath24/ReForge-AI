import { useState } from "react";
import toast from "react-hot-toast";
import { signup, login } from "../api.js";
import { saveAuth } from "../auth.js";

function AuthPage({ onAuthSuccess }) {
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
      toast.success(mode === "login" ? "Logged in!" : "Account created!");
      onAuthSuccess();
    } catch (err) {
      const message = err.response?.data?.detail || "Something went wrong.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-green-800 mb-1">ReForge AI</h1>
        <p className="text-gray-600 mb-6">
          {mode === "login" ? "Log in to continue" : "Create an account"}
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block font-semibold mb-1 text-gray-800">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <label className="block font-semibold mb-1 text-gray-800">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full px-5 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-green-700 font-semibold hover:underline"
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;