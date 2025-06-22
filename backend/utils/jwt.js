const jwt = require("jsonwebtoken");

/**
 * JWT Utility Functions
 * Handles token generation, verification, and authentication middleware
 */

/**
 * Generate JWT Token
 * @param {Object} payload - Data to encode in token
 * @param {string} expiresIn - Token expiration time (default: '24h')
 * @returns {string} JWT token
 */
const generateToken = (payload, expiresIn = "24h") => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign(payload, secret, {
      expiresIn,
      issuer: "fullstack-boilerplate",
      audience: "fullstack-boilerplate-users",
    });
  } catch (error) {
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

/**
 * Generate Access Token (short-lived)
 * @param {Object} payload - User data to encode
 * @returns {string} Access token
 */
const generateAccessToken = (payload) => {
  return generateToken(payload, "15m"); // 15 minutes
};

/**
 * Generate Refresh Token (long-lived)
 * @param {Object} payload - User data to encode
 * @returns {string} Refresh token
 */
const generateRefreshToken = (payload) => {
  return generateToken(payload, "7d"); // 7 days
};

/**
 * Verify JWT Token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    return jwt.verify(token, secret, {
      issuer: "fullstack-boilerplate",
      audience: "fullstack-boilerplate-users",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    } else {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }
};

/**
 * Decode JWT Token (without verification)
 * @param {string} token - JWT token to decode
 * @returns {Object} Decoded token payload
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error(`Token decoding failed: ${error.message}`);
  }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null if not found
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
};

/**
 * Authentication Middleware
 * Verifies JWT token and adds user data to request object
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
        statusCode: 401,
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
      statusCode: 401,
    });
  }
};

/**
 * Optional Authentication Middleware
 * Verifies JWT token if present, but doesn't require it
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
const authorizeRoles = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        statusCode: 401,
      });
    }

    const userRoles = req.user.roles || [];
    const roles = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];

    const hasRequiredRole = roles.some((role) => userRoles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
        statusCode: 403,
      });
    }

    next();
  };
};

/**
 * Check if token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} True if expired, false otherwise
 */
const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null if invalid
 */
const getTokenExpiration = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return null;

    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

/**
 * Refresh token pair
 * @param {string} refreshToken - Valid refresh token
 * @returns {Object} New access and refresh tokens
 */
const refreshTokenPair = (refreshToken) => {
  try {
    const decoded = verifyToken(refreshToken);

    // Remove token-specific fields
    const { iat, exp, iss, aud, ...payload } = decoded;

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: payload,
    };
  } catch (error) {
    throw new Error(`Token refresh failed: ${error.message}`);
  }
};

module.exports = {
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  extractTokenFromHeader,
  authenticateToken,
  optionalAuth,
  authorizeRoles,
  isTokenExpired,
  getTokenExpiration,
  refreshTokenPair,
};
