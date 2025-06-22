import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { apiService, apiCall } from "../utils/api";

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      const result = await apiCall(apiService.health.check);
      if (result.success) {
        setHealthData(result.data);
      }
    } catch (error) {
      console.error("Error fetching health data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center py-16 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Welcome to Fullstack Boilerplate
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          A modern, production-ready full-stack application with Express.js
          backend and React frontend
        </p>

        {isAuthenticated ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="btn btn-primary text-lg px-8 py-4">
              Go to Dashboard
            </Link>
            <Link
              to="/users"
              className="btn btn-secondary text-lg px-8 py-4 bg-white/10 text-white border-white/30 hover:bg-white/20"
            >
              Manage Users
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn btn-primary text-lg px-8 py-4">
              Get Started
            </Link>
            <Link
              to="/register"
              className="btn btn-secondary text-lg px-8 py-4 bg-white/10 text-white border-white/30 hover:bg-white/20"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Authentication
            </h3>
            <p className="text-gray-600 leading-relaxed">
              JWT-based authentication with refresh tokens and role-based access
              control
            </p>
          </div>

          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Security
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Built-in security middleware including CORS, rate limiting, and
              input validation
            </p>
          </div>

          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4">🗄️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Database
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Prisma ORM with PostgreSQL, MySQL, or SQLite support and automatic
              migrations
            </p>
          </div>

          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Performance
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Optimized for speed with Vite, connection pooling, and efficient
              queries
            </p>
          </div>

          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Responsive
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Modern, responsive UI that works perfectly on all devices
            </p>
          </div>

          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Production Ready
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Error handling, logging, monitoring, and deployment configurations
              included
            </p>
          </div>
        </div>
      </div>

      {/* User Welcome Section */}
      {isAuthenticated && (
        <div className="py-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-2xl text-center">
            <h3 className="text-2xl font-semibold mb-2">
              Welcome back, {user?.name}!
            </h3>
            <p className="mb-4 opacity-90">You're logged in as {user?.email}</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {user?.roles?.map((role) => (
                <span key={role} className="badge bg-white/20 text-white">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Status Section */}
      <div className="py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          System Status
        </h2>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="loading-spinner"></div>
            <p className="mt-4 text-gray-600">Checking system status...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                API Status
              </h3>
              <span
                className={`badge ${
                  healthData?.status === "healthy"
                    ? "badge-success"
                    : "badge-error"
                }`}
              >
                {healthData?.status || "Unknown"}
              </span>
            </div>

            <div className="card text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Database
              </h3>
              <span
                className={`badge ${
                  healthData?.database?.status === "healthy"
                    ? "badge-success"
                    : "badge-error"
                }`}
              >
                {healthData?.database?.status || "Unknown"}
              </span>
            </div>

            <div className="card text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Environment
              </h3>
              <span className="text-lg font-semibold text-gray-800">
                {healthData?.environment || "Unknown"}
              </span>
            </div>

            <div className="card text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Uptime
              </h3>
              <span className="text-lg font-semibold text-gray-800">
                {healthData?.uptime
                  ? `${Math.round(healthData.uptime)}s`
                  : "Unknown"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="text-center py-16 bg-gray-50 rounded-3xl">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Ready to get started?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of developers building amazing applications
        </p>
        {!isAuthenticated && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn btn-primary text-lg px-8 py-4">
              Create Free Account
            </Link>
            <Link to="/about" className="btn btn-secondary text-lg px-8 py-4">
              Learn More
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
