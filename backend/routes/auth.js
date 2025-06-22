const express = require("express");
const {
  successResponse,
  errorResponse,
  validationErrorResponse,
  unauthorizedResponse,
} = require("../utils/response");
const {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
  refreshTokenPair,
  verifyToken,
} = require("../utils/jwt");
const {
  asyncHandler,
  ValidationError,
  AuthenticationError,
  ConflictError,
} = require("../utils/errorHandler");
const router = express.Router();

// Mock users database (in real app, this would be a database)
const users = [
  {
    id: 1,
    email: "admin@example.com",
    password: "$2b$10$example-hash", // In real app, use bcrypt
    name: "Admin User",
    roles: ["admin", "user"],
  },
  {
    id: 2,
    email: "user@example.com",
    password: "$2b$10$example-hash", // In real app, use bcrypt
    name: "Regular User",
    roles: ["user"],
  },
];

// Mock refresh tokens storage (in real app, use Redis or database)
const refreshTokens = new Set();

/**
 * Register new user
 * POST /api/auth/register
 */
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      throw new ValidationError("Missing required fields", [
        { field: "email", message: "Email is required" },
        { field: "password", message: "Password is required" },
        { field: "name", message: "Name is required" },
      ]);
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password, // In real app, hash the password
      name,
      roles: ["user"], // Default role
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Generate tokens
    const accessToken = generateAccessToken({
      id: newUser.id,
      email: newUser.email,
      roles: newUser.roles,
    });

    const refreshToken = generateRefreshToken({
      id: newUser.id,
      email: newUser.email,
    });

    // Store refresh token
    refreshTokens.add(refreshToken);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return successResponse(
      res,
      {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      },
      "User registered successfully",
      201
    );
  })
);

/**
 * Login user
 * POST /api/auth/login
 */
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    // Find user
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    // Store refresh token
    refreshTokens.add(refreshToken);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return successResponse(
      res,
      {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      },
      "Login successful"
    );
  })
);

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError("Refresh token is required");
    }

    // Check if refresh token exists
    if (!refreshTokens.has(refreshToken)) {
      throw new AuthenticationError("Invalid refresh token");
    }

    try {
      // Verify refresh token
      const decoded = verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      );

      // Find user
      const user = users.find((u) => u.id === decoded.id);
      if (!user) {
        throw new AuthenticationError("User not found");
      }

      // Generate new access token
      const newAccessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        roles: user.roles,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return successResponse(
        res,
        {
          user: userWithoutPassword,
          accessToken: newAccessToken,
        },
        "Token refreshed successfully"
      );
    } catch (error) {
      // Remove invalid refresh token
      refreshTokens.delete(refreshToken);
      throw new AuthenticationError("Invalid refresh token");
    }
  })
);

/**
 * Logout user
 * POST /api/auth/logout
 */
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Remove refresh token
      refreshTokens.delete(refreshToken);
    }

    return successResponse(res, null, "Logout successful");
  })
);

/**
 * Logout all sessions
 * POST /api/auth/logout-all
 */
router.post(
  "/logout-all",
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
      try {
        // Verify token to get user ID
        const decoded = verifyToken(
          refreshToken,
          process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
        );

        // Remove all refresh tokens for this user (in real app, you'd store tokens with user ID)
        // For this demo, we'll just remove the provided token
        refreshTokens.delete(refreshToken);
      } catch (error) {
        // Token is invalid, but we still return success
      }
    }

    return successResponse(res, null, "All sessions logged out successfully");
  })
);

/**
 * Get current user profile
 * GET /api/auth/me
 */
router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError("Access token required");
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyToken(token);
      const user = users.find((u) => u.id === decoded.id);

      if (!user) {
        throw new AuthenticationError("User not found");
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return successResponse(
        res,
        userWithoutPassword,
        "Profile retrieved successfully"
      );
    } catch (error) {
      throw new AuthenticationError("Invalid access token");
    }
  })
);

module.exports = router;
