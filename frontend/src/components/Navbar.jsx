import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-white text-xl font-bold hover:opacity-80 transition-opacity"
          >
            Fullstack Boilerplate
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-white font-medium hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-white font-medium hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
            >
              About
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white font-medium hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/users"
                  className="text-white font-medium hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
                >
                  Users
                </Link>
                <div className="flex items-center space-x-4 text-white">
                  <span className="text-sm font-medium">
                    Hello, {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-white/20 text-white border border-white/30 px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white font-medium hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white font-medium hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
