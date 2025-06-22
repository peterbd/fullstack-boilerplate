import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiService, apiCall } from "../utils/api";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center min-h-96">
          <div className="loading-spinner"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to your Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Hello, {user?.name}! Here's what's happening with your account.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Profile Card */}
        <div className="card">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
            Profile Information
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-medium text-gray-600">Name:</span>
              <span className="font-semibold text-gray-800">{user?.name}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-medium text-gray-600">Email:</span>
              <span className="font-semibold text-gray-800">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-medium text-gray-600">Roles:</span>
              <div className="flex gap-2 flex-wrap">
                {user?.roles?.map((role) => (
                  <span key={role} className="badge badge-primary">
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="font-medium text-gray-600">Status:</span>
              <span
                className={`badge ${
                  user?.isActive ? "badge-success" : "badge-error"
                }`}
              >
                {user?.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* System Health Card */}
        <div className="card">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
            System Health
          </h3>
          {healthData ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-medium text-gray-600">Status:</span>
                <span
                  className={`badge ${
                    healthData.status === "healthy"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {healthData.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-medium text-gray-600">Database:</span>
                <span
                  className={`badge ${
                    healthData.database?.status === "healthy"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {healthData.database?.status || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-medium text-gray-600">Uptime:</span>
                <span className="font-semibold text-gray-800">
                  {Math.round(healthData.uptime)}s
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="font-medium text-gray-600">Environment:</span>
                <span className="font-semibold text-gray-800">
                  {healthData.environment}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-red-600 font-medium p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              Unable to fetch health data
            </p>
          )}
        </div>

        {/* Protected Data Card */}
        <div className="card">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
            Protected Content
          </h3>
          {protectedData ? (
            <div className="space-y-4">
              <p className="text-green-600 font-medium p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                {protectedData.message}
              </p>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-medium text-gray-600">User ID:</span>
                <span className="font-semibold text-gray-800">
                  {protectedData.userId}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="font-medium text-gray-600">Timestamp:</span>
                <span className="font-semibold text-gray-800">
                  {new Date(protectedData.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-red-600 font-medium p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              Unable to fetch protected data
            </p>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="card">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="btn btn-primary">View Profile</button>
            <button className="btn btn-secondary">Manage Users</button>
            <button className="btn btn-secondary">System Settings</button>
            <button className="btn btn-secondary">View Logs</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
