import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../utils/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [email, setEmail] = useState(null);
  const [checking, setChecking] = useState(true); // true while we verify the token on first load

  useEffect(() => {
    verifyToken();
  }, []);

  async function verifyToken() {
    const token = localStorage.getItem("reforge_token");
    if (!token) {
      setChecking(false);
      return;
    }

    try {
      const data = await getMe(); // calls /auth/me with the Bearer token
      setEmail(data.email);
    } catch {
      // Token invalid or expired — clean up
      localStorage.removeItem("reforge_token");
      localStorage.removeItem("reforge_email");
      setEmail(null);
    } finally {
      setChecking(false);
    }
  }

  function login(token, userEmail) {
    localStorage.setItem("reforge_token", token);
    localStorage.setItem("reforge_email", userEmail);
    setEmail(userEmail);
  }

  function logout() {
    localStorage.removeItem("reforge_token");
    localStorage.removeItem("reforge_email");
    setEmail(null);
  }

  const value = {
    isLoggedIn: !!email,
    email,
    checking,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}