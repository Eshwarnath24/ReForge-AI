import { clearAuth, getEmail } from "../auth.js";

function LogoutButton({ onLogout }) {
  function handleLogout() {
    clearAuth();
    onLogout();
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-green-700/50 font-medium hidden sm:inline">
        {getEmail()}
      </span>
      <button
        onClick={handleLogout}
        className="text-xs text-gray-400 hover:text-red-500 font-medium px-2.5 py-1 rounded-lg hover:bg-red-50 transition-all bg-transparent"
      >
        Log out
      </button>
    </div>
  );
}

export default LogoutButton;