import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import { signup, login } from "../api.js";
import { saveAuth } from "../auth.js";
import { Sprout, Mail, Lock, LogIn, ArrowLeft } from "../components/Icons.jsx";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const data =
        mode === "login"
          ? await login(email, password)
          : await signup(email, password);

      saveAuth(data.access_token, data.email);
      toast.success(mode === "login" ? "Welcome back!" : "Account created!");
      navigate("/reforgepage");
    } catch (err) {
      const message = err.response?.data?.detail || "Something went wrong.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 font-sans">
      <AnimatedBackground />

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 relative z-10 animate-fade-in-up">
        <button 
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 text-slate-400 hover:text-emerald-600 hover:-translate-x-1 transition-all bg-transparent p-0 flex items-center justify-center"
          title="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-[16px] bg-[#00cfa5] flex items-center justify-center">
            <Sprout className="w-6 h-6 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-slate-900 mb-2 text-center">
          {mode === "login" ? "Welcome back" : "Create an account"}
        </h2>
        <p className="text-slate-500 text-center mb-8 text-sm">
          {mode === "login"
            ? "Sign in to sync your tools, skills, and impact data."
            : "Get started with ReForge AI — it's free."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-medium py-4 rounded-xl hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            <LogIn className="w-5 h-5" />
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Log In"
                : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          {mode === "login"
            ? "New to ReForge?"
            : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-emerald-600 font-medium cursor-pointer hover:text-emerald-700 bg-transparent p-0 text-sm"
          >
            {mode === "login" ? "Create an account" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;