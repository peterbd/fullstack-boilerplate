import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiService, apiCall } from "../utils/api";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState(null);
  const [protectedData, setProtectedData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch health data
      const healthResult = await apiCall(apiService.health.check);
      if (healthResult.success) {
        setHealthData(healthResult.data);
      }

      // Fetch protected data
      const protectedResult = await apiCall(apiService.protected.test);
      if (protectedResult.success) {
        setProtectedData(protectedResult.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to your Dashboard</h1>
        <p>Hello, {user?.name}! Here's what's happening with your account.</p>
      </div>

      <div className="dashboard-grid">
        {/* User Profile Card */}
        <div className="dashboard-card">
          <h3>Profile Information</h3>
          <div className="profile-info">
            <div className="info-item">
              <span className="label">Name:</span>
              <span className="value">{user?.name}</span>
            </div>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Roles:</span>
              <span className="value">
                {user?.roles?.map((role) => (
                  <span key={role} className="role-badge">
                    {role}
                  </span>
                ))}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Status:</span>
              <span
                className={`status-badge ${
                  user?.isActive ? "active" : "inactive"
                }`}
              >
                {user?.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* System Health Card */}
        <div className="dashboard-card">
          <h3>System Health</h3>
          {healthData ? (
            <div className="health-info">
              <div className="info-item">
                <span className="label">Status:</span>
                <span
                  className={`status-badge ${
                    healthData.status === "healthy" ? "healthy" : "unhealthy"
                  }`}
                >
                  {healthData.status}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Database:</span>
                <span
                  className={`status-badge ${
                    healthData.database?.status === "healthy"
                      ? "healthy"
                      : "unhealthy"
                  }`}
                >
                  {healthData.database?.status || "Unknown"}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Uptime:</span>
                <span className="value">{Math.round(healthData.uptime)}s</span>
              </div>
              <div className="info-item">
                <span className="label">Environment:</span>
                <span className="value">{healthData.environment}</span>
              </div>
            </div>
          ) : (
            <p className="error-message">Unable to fetch health data</p>
          )}
        </div>

        {/* Protected Data Card */}
        <div className="dashboard-card">
          <h3>Protected Content</h3>
          {protectedData ? (
            <div className="protected-content">
              <p className="success-message">{protectedData.message}</p>
              <div className="info-item">
                <span className="label">User ID:</span>
                <span className="value">{protectedData.userId}</span>
              </div>
              <div className="info-item">
                <span className="label">Timestamp:</span>
                <span className="value">
                  {new Date(protectedData.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="error-message">Unable to fetch protected data</p>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button className="action-btn primary">View Profile</button>
            <button className="action-btn secondary">Manage Users</button>
            <button className="action-btn secondary">System Settings</button>
            <button className="action-btn secondary">View Logs</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
