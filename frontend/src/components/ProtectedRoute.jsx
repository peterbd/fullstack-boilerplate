import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="loading-spinner"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login page with the current location as the return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authentication is not required and user is authenticated
  if (!requireAuth && isAuthenticated) {
    // Redirect to dashboard or home page
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and can access the protected route
  return children;
};

export default ProtectedRoute;
