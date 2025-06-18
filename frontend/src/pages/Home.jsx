import { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

function Home() {
  const [apiStatus, setApiStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await axios.get("/api/health");
      setApiStatus(response.data);
    } catch (error) {
      setApiStatus({ status: "ERROR", error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Fullstack Boilerplate</h1>
        <p className="hero-subtitle">
          A modern, production-ready full-stack application with Express.js
          backend and React frontend
        </p>
      </div>

      <div className="features grid grid-cols-1 md:grid-cols-3">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Fast Development</h3>
          <p>
            Built with Vite for lightning-fast development and hot module
            replacement.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>Secure Backend</h3>
          <p>
            Express.js server with security middleware, rate limiting, and CORS
            protection.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>Responsive Design</h3>
          <p>
            Modern, mobile-first UI with clean components and smooth animations.
          </p>
        </div>
      </div>

      <div className="api-status-section">
        <h2>API Status</h2>
        <div className="api-status-card">
          {loading ? (
            <div className="loading">Checking API status...</div>
          ) : apiStatus?.status === "OK" ? (
            <div className="success">
              <strong>✅ API is running</strong>
              <p>Server uptime: {Math.floor(apiStatus.uptime)}s</p>
              <p>Environment: {apiStatus.environment}</p>
              <p>Version: {apiStatus.version}</p>
            </div>
          ) : (
            <div className="error">
              <strong>❌ API connection failed</strong>
              <p>
                {apiStatus?.error || "Unable to connect to the backend server"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="getting-started">
        <h2>Getting Started</h2>
        <div className="code-block">
          <h4>Install dependencies:</h4>
          <pre>
            <code>npm run install:all</code>
          </pre>

          <h4>Start development servers:</h4>
          <pre>
            <code>npm run dev</code>
          </pre>

          <h4>Build for production:</h4>
          <pre>
            <code>npm run build</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default Home;
