import { clearAuth, getEmail } from "../auth.js";

function LogoutButton({ onLogout }) {
  function handleLogout() {
    clearAuth();
    onLogout();
  }

  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm text-gray-600">Logged in as {getEmail()}</span>
      <button
        onClick={handleLogout}
        className="text-sm text-red-600 hover:underline"
      >
        Log out
      </button>
    </div>
  );
}

export default LogoutButton;