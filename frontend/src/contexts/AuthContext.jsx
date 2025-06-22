import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { apiService, apiCall } from "../utils/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = Cookies.get("accessToken");
      if (token) {
        const result = await apiCall(apiService.auth.profile);
        if (result.success) {
          setUser(result.data);
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear it
          logout();
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const result = await apiCall(apiService.auth.login, credentials);

      if (result.success) {
        const { accessToken, refreshToken, user: userData } = result.data;

        // Store tokens in cookies
        Cookies.set("accessToken", accessToken, { expires: 1 }); // 1 day
        Cookies.set("refreshToken", refreshToken, { expires: 7 }); // 7 days

        setUser(userData);
        setIsAuthenticated(true);
        toast.success("Login successful!");
        return { success: true };
      } else {
        toast.error(result.error || "Login failed");
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const result = await apiCall(apiService.auth.register, userData);

      if (result.success) {
        toast.success("Registration successful! Please log in.");
        return { success: true };
      } else {
        toast.error(result.error || "Registration failed");
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to invalidate refresh token
      await apiCall(apiService.auth.logout);
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Clear tokens and user state regardless of API call result
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const result = await apiCall(apiService.auth.profile, profileData);

      if (result.success) {
        setUser(result.data);
        toast.success("Profile updated successfully!");
        return { success: true };
      } else {
        toast.error(result.error || "Profile update failed");
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Profile update failed. Please try again.");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
