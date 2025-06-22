import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = Cookies.get("refreshToken");
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          Cookies.set("accessToken", accessToken, { expires: 1 }); // 1 day

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const message =
      error.response?.data?.message || error.message || "An error occurred";

    // Don't show toast for 401 errors (handled above)
    if (error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// API Helper Functions
export const apiService = {
  // Auth endpoints
  auth: {
    login: (credentials) => api.post("/auth/login", credentials),
    register: (userData) => api.post("/auth/register", userData),
    logout: () => api.post("/auth/logout"),
    refresh: (refreshToken) => api.post("/auth/refresh", { refreshToken }),
    profile: () => api.get("/auth/profile"),
  },

  // User endpoints
  users: {
    getAll: (params) => api.get("/users", { params }),
    getById: (id) => api.get(`/users/${id}`),
    create: (userData) => api.post("/users", userData),
    update: (id, userData) => api.put(`/users/${id}`, userData),
    delete: (id) => api.delete(`/users/${id}`),
  },

  // Health check
  health: {
    check: () => api.get("/health"),
    detailed: () => api.get("/health/detailed"),
    database: () => api.get("/health/database"),
  },

  // Protected routes
  protected: {
    test: () => api.get("/protected"),
  },
};

// Response helper functions
export const handleApiResponse = (response) => {
  return {
    success: true,
    data: response.data.data,
    message: response.data.message,
    meta: response.data.meta,
  };
};

export const handleApiError = (error) => {
  return {
    success: false,
    error: error.response?.data?.message || error.message,
    status: error.response?.status,
  };
};

// Generic API call wrapper
export const apiCall = async (apiFunction, ...args) => {
  try {
    const response = await apiFunction(...args);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

export default api;
