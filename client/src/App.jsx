import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ReForgePage from "./pages/ReForgePage.jsx";
import { isLoggedIn } from "./auth.js";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/auth"
        element={
          isLoggedIn() ? <Navigate to="/reforgepage" replace /> : <AuthPage />
        }
      />
      <Route
        path="/reforgepage"
        element={isLoggedIn() ? <ReForgePage /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/app"
        element={<Navigate to="/reforgepage" replace />}
      />
      {/* Catch-all: send unknown paths to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;