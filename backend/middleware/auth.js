const {
  unauthorizedResponse,
  forbiddenResponse,
} = require("../utils/response");
const { verifyToken, extractTokenFromHeader } = require("../utils/jwt");
const {
  AuthenticationError,
  AuthorizationError,
} = require("../utils/errorHandler");

/**
 * Authentication Middleware
 * Provides various authentication and authorization middleware functions
 */

/**
 * Require Authentication Middleware
 * Ensures user is authenticated with valid JWT token
 */
const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      throw new AuthenticationError("Access token required");
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional Authentication Middleware
 * Adds user data if token is present, but doesn't require it
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

/**
 * Role-based Authorization Middleware
 * @param {string|Array} requiredRoles - Role(s) required to access the route
 */
const requireRoles = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError("Authentication required"));
    }

    const userRoles = req.user.roles || [];
    const roles = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];

    const hasRequiredRole = roles.some((role) => userRoles.includes(role));

    if (!hasRequiredRole) {
      return next(new AuthorizationError("Insufficient permissions"));
    }

    next();
  };
};

/**
 * Admin Only Middleware
 * Requires user to have admin role
 */
const requireAdmin = (req, res, next) => {
  return requireRoles(["admin"])(req, res, next);
};

/**
 * User or Admin Middleware
 * Requires user to have either user or admin role
 */
const requireUserOrAdmin = (req, res, next) => {
  return requireRoles(["user", "admin"])(req, res, next);
};

/**
 * Owner or Admin Middleware
 * Allows access if user owns the resource or is admin
 * @param {Function} getResourceOwnerId - Function to get resource owner ID from request
 */
const requireOwnerOrAdmin = (getResourceOwnerId) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError("Authentication required"));
    }

    const userRoles = req.user.roles || [];
    const isAdmin = userRoles.includes("admin");

    if (isAdmin) {
      return next();
    }

    const resourceOwnerId = getResourceOwnerId(req);
    if (req.user.id === resourceOwnerId) {
      return next();
    }

    return next(new AuthorizationError("Access denied"));
  };
};

/**
 * API Key Authentication Middleware
 * Validates API key from headers
 * @param {string} apiKey - Expected API key
 */
const requireApiKey = (apiKey) => {
  return (req, res, next) => {
    const providedKey =
      req.headers["x-api-key"] || req.headers["authorization"];

    if (!providedKey) {
      return next(new AuthenticationError("API key required"));
    }

    // Remove 'Bearer ' prefix if present
    const cleanKey = providedKey.replace("Bearer ", "");

    if (cleanKey !== apiKey) {
      return next(new AuthenticationError("Invalid API key"));
    }

    next();
  };
};

/**
 * Rate Limiting by User Middleware
 * Applies rate limiting based on user ID (if authenticated) or IP
 * @param {Object} rateLimitConfig - Rate limiting configuration
 */
const rateLimitByUser = (rateLimitConfig = {}) => {
  const { windowMs = 15 * 60 * 1000, max = 100 } = rateLimitConfig;
  const userRequests = new Map();

  return (req, res, next) => {
    const identifier = req.user ? `user_${req.user.id}` : `ip_${req.ip}`;
    const now = Date.now();

    if (!userRequests.has(identifier)) {
      userRequests.set(identifier, { count: 0, resetTime: now + windowMs });
    }

    const userData = userRequests.get(identifier);

    if (now > userData.resetTime) {
      userData.count = 0;
      userData.resetTime = now + windowMs;
    }

    userData.count++;

    if (userData.count > max) {
      return res.status(429).json({
        success: false,
        message: "Rate limit exceeded",
        statusCode: 429,
      });
    }

    next();
  };
};

/**
 * Validate Request Body Middleware
 * Validates required fields in request body
 * @param {Array} requiredFields - Array of required field names
 */
const validateBody = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        errors: missingFields.map((field) => ({
          field,
          message: `${field} is required`,
        })),
        statusCode: 400,
      });
    }

    next();
  };
};

/**
 * Validate Request Parameters Middleware
 * Validates required parameters in request
 * @param {Array} requiredParams - Array of required parameter names
 */
const validateParams = (requiredParams) => {
  return (req, res, next) => {
    const missingParams = requiredParams.filter((param) => !req.params[param]);

    if (missingParams.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
        errors: missingParams.map((param) => ({
          field: param,
          message: `${param} parameter is required`,
        })),
        statusCode: 400,
      });
    }

    next();
  };
};

/**
 * Log Request Middleware
 * Logs incoming requests for debugging
 */
const logRequest = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get("User-Agent");
  const ip = req.ip;
  const userId = req.user ? req.user.id : "anonymous";

  console.log(
    `[${timestamp}] ${method} ${url} - IP: ${ip}, User: ${userId}, UA: ${userAgent}`
  );

  next();
};

/**
 * Error Handler Middleware
 * Catches and formats errors
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return unauthorizedResponse(res, "Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    return unauthorizedResponse(res, "Token expired");
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      })),
      statusCode: 400,
    });
  }

  // Default error response
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    statusCode: 500,
  });
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireRoles,
  requireAdmin,
  requireUserOrAdmin,
  requireOwnerOrAdmin,
  requireApiKey,
  rateLimitByUser,
  validateBody,
  validateParams,
  logRequest,
  errorHandler,
};
