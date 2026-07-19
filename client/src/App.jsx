import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ReForgePage from "./pages/ReForgePage.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function App() {
  const { isLoggedIn, checking } = useAuth();

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/auth"
        element={isLoggedIn ? <Navigate to="/reforgepage" replace /> : <AuthPage />}
      />
      <Route
        path="/reforgepage"
        element={isLoggedIn ? <ReForgePage /> : <Navigate to="/auth" replace />}
      />
      <Route path="/app" element={<Navigate to="/reforgepage" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;