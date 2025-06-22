const express = require("express");
const { successResponse } = require("../utils/response");
const {
  asyncHandler,
  NotFoundError,
  ValidationError,
  ConflictError,
} = require("../utils/errorHandler");

const router = express.Router();

// Mock user database for demonstration
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    createdAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "user",
    createdAt: "2024-01-03T00:00:00.000Z",
  },
];

/**
 * Get all users
 * GET /api/users
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;

    let filteredUsers = [...users];

    // Apply search filter if provided
    if (search) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const response = {
      users: paginatedUsers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredUsers.length / limit),
        totalUsers: filteredUsers.length,
        hasNextPage: endIndex < filteredUsers.length,
        hasPrevPage: page > 1,
      },
    };

    return successResponse(res, response, "Users retrieved successfully");
  })
);

/**
 * Get user by ID
 * GET /api/users/:id
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      throw new ValidationError("Invalid user ID");
    }

    const user = users.find((u) => u.id === userId);

    if (!user) {
      throw new NotFoundError("User");
    }

    return successResponse(res, user, "User retrieved successfully");
  })
);

/**
 * Create new user
 * POST /api/users
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email, role = "user" } = req.body;

    // Validate required fields
    if (!name || !email) {
      throw new ValidationError("Name and email are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError("Invalid email format");
    }

    // Check if user already exists
    const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    // Create new user
    const newUser = {
      id: users.length + 1,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    return successResponse(res, newUser, "User created successfully", 201);
  })
);

/**
 * Update user
 * PUT /api/users/:id
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, email, role } = req.body;

    if (isNaN(userId)) {
      throw new ValidationError("Invalid user ID");
    }

    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      throw new NotFoundError("User");
    }

    // Check if email is being changed and if it conflicts with existing user
    if (email && email !== users[userIndex].email) {
      const existingUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== userId
      );
      if (existingUser) {
        throw new ConflictError("User with this email already exists");
      }
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...(name && { name: name.trim() }),
      ...(email && { email: email.toLowerCase().trim() }),
      ...(role && { role }),
      updatedAt: new Date().toISOString(),
    };

    return successResponse(res, users[userIndex], "User updated successfully");
  })
);

/**
 * Delete user
 * DELETE /api/users/:id
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      throw new ValidationError("Invalid user ID");
    }

    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      throw new NotFoundError("User");
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    return successResponse(res, deletedUser, "User deleted successfully");
  })
);

/**
 * Get user statistics
 * GET /api/users/stats/overview
 */
router.get(
  "/stats/overview",
  asyncHandler(async (req, res) => {
    const stats = {
      totalUsers: users.length,
      usersByRole: users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {}),
      recentUsers: users
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    };

    return successResponse(
      res,
      stats,
      "User statistics retrieved successfully"
    );
  })
);

module.exports = router;
