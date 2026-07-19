import { createContext, useContext, useState } from "react";
import { saveAuth as saveAuthStorage, clearAuth as clearAuthStorage, getToken, getEmail } from "./auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [email, setEmail] = useState(getEmail());

  function login(newToken, newEmail) {
    saveAuthStorage(newToken, newEmail);
    setToken(newToken);
    setEmail(newEmail);
  }

  function logout() {
    clearAuthStorage();
    setToken(null);
    setEmail(null);
  }

  const value = {
    isLoggedIn: !!token,
    email,
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