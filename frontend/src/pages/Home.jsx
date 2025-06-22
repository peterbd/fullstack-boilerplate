import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { apiService, apiCall } from "../utils/api";
import "./Home.css";

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
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Fullstack Boilerplate</h1>
          <p className="hero-subtitle">
            A modern, production-ready full-stack application with Express.js
            backend and React frontend
          </p>

          {isAuthenticated ? (
            <div className="hero-actions">
              <Link to="/dashboard" className="cta-button primary">
                Go to Dashboard
              </Link>
              <Link to="/users" className="cta-button secondary">
                Manage Users
              </Link>
            </div>
          ) : (
            <div className="hero-actions">
              <Link to="/login" className="cta-button primary">
                Get Started
              </Link>
              <Link to="/register" className="cta-button secondary">
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Authentication</h3>
            <p>
              JWT-based authentication with refresh tokens and role-based access
              control
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Security</h3>
            <p>
              Built-in security middleware including CORS, rate limiting, and
              input validation
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🗄️</div>
            <h3>Database</h3>
            <p>
              Prisma ORM with PostgreSQL, MySQL, or SQLite support and automatic
              migrations
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Performance</h3>
            <p>
              Optimized for speed with Vite, connection pooling, and efficient
              queries
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Responsive</h3>
            <p>Modern, responsive UI that works perfectly on all devices</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Production Ready</h3>
            <p>
              Error handling, logging, monitoring, and deployment configurations
              included
            </p>
          </div>
        </div>
      </div>

      {isAuthenticated && (
        <div className="user-welcome-section">
          <div className="welcome-card">
            <h3>Welcome back, {user?.name}!</h3>
            <p>You're logged in as {user?.email}</p>
            <div className="user-roles">
              {user?.roles?.map((role) => (
                <span key={role} className="role-badge">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="status-section">
        <h2>System Status</h2>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Checking system status...</p>
          </div>
        ) : (
          <div className="status-grid">
            <div className="status-card">
              <h3>API Status</h3>
              <span
                className={`status-badge ${
                  healthData?.status === "healthy" ? "healthy" : "unhealthy"
                }`}
              >
                {healthData?.status || "Unknown"}
              </span>
            </div>

            <div className="status-card">
              <h3>Database</h3>
              <span
                className={`status-badge ${
                  healthData?.database?.status === "healthy"
                    ? "healthy"
                    : "unhealthy"
                }`}
              >
                {healthData?.database?.status || "Unknown"}
              </span>
            </div>

            <div className="status-card">
              <h3>Environment</h3>
              <span className="status-value">
                {healthData?.environment || "Unknown"}
              </span>
            </div>

            <div className="status-card">
              <h3>Uptime</h3>
              <span className="status-value">
                {healthData?.uptime
                  ? `${Math.round(healthData.uptime)}s`
                  : "Unknown"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="cta-section">
        <h2>Ready to get started?</h2>
        <p>Join thousands of developers building amazing applications</p>
        {!isAuthenticated && (
          <div className="cta-actions">
            <Link to="/register" className="cta-button primary">
              Create Free Account
            </Link>
            <Link to="/about" className="cta-button secondary">
              Learn More
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
