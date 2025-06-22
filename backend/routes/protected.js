const express = require("express");
const { successResponse } = require("../utils/response");
const {
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
} = require("../middleware/auth");
const { asyncHandler, NotFoundError } = require("../utils/errorHandler");

const router = express.Router();

// Mock data for demonstration
const posts = [
  {
    id: 1,
    title: "Public Post",
    content: "This is public",
    authorId: 1,
    isPublic: true,
  },
  {
    id: 2,
    title: "Private Post",
    content: "This is private",
    authorId: 2,
    isPublic: false,
  },
  {
    id: 3,
    title: "Admin Post",
    content: "Admin only content",
    authorId: 1,
    isPublic: false,
  },
];

/**
 * Public route - no authentication required
 * GET /api/protected/public
 */
router.get(
  "/public",
  asyncHandler(async (req, res) => {
    const publicPosts = posts.filter((post) => post.isPublic);
    return successResponse(res, publicPosts, "Public posts retrieved");
  })
);

/**
 * Optional auth route - shows different content based on authentication
 * GET /api/protected/optional
 */
router.get(
  "/optional",
  optionalAuth,
  asyncHandler(async (req, res) => {
    if (req.user) {
      // User is authenticated - show personalized content
      const userPosts = posts.filter((post) => post.authorId === req.user.id);
      return successResponse(
        res,
        {
          message: "Welcome back!",
          user: req.user,
          posts: userPosts,
        },
        "Personalized content retrieved"
      );
    } else {
      // User is not authenticated - show generic content
      return successResponse(
        res,
        {
          message: "Welcome guest!",
          posts: posts.filter((post) => post.isPublic),
        },
        "Guest content retrieved"
      );
    }
  })
);

/**
 * Protected route - requires authentication
 * GET /api/protected/profile
 */
router.get(
  "/profile",
  requireAuth,
  asyncHandler(async (req, res) => {
    return successResponse(
      res,
      {
        user: req.user,
        message: "Profile accessed successfully",
      },
      "Profile retrieved"
    );
  })
);

/**
 * Role-based route - requires specific role
 * GET /api/protected/admin
 */
router.get(
  "/admin",
  requireAuth,
  requireRoles(["admin"]),
  asyncHandler(async (req, res) => {
    return successResponse(
      res,
      {
        message: "Admin dashboard",
        allPosts: posts,
        stats: {
          totalPosts: posts.length,
          publicPosts: posts.filter((p) => p.isPublic).length,
          privatePosts: posts.filter((p) => !p.isPublic).length,
        },
      },
      "Admin data retrieved"
    );
  })
);

/**
 * Admin only route - simplified version
 * GET /api/protected/admin-only
 */
router.get(
  "/admin-only",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    return successResponse(
      res,
      {
        message: "Admin only content",
        secretData: "This is only visible to admins",
      },
      "Admin only content retrieved"
    );
  })
);

/**
 * User or Admin route
 * GET /api/protected/user-content
 */
router.get(
  "/user-content",
  requireAuth,
  requireUserOrAdmin,
  asyncHandler(async (req, res) => {
    const userPosts = posts.filter(
      (post) =>
        post.authorId === req.user.id || req.user.roles.includes("admin")
    );

    return successResponse(
      res,
      {
        posts: userPosts,
        message: "User content retrieved",
      },
      "User content retrieved"
    );
  })
);

/**
 * Owner or Admin route - user can only access their own posts unless admin
 * GET /api/protected/posts/:id
 */
router.get(
  "/posts/:id",
  requireAuth,
  validateParams(["id"]),
  requireOwnerOrAdmin((req) => {
    const post = posts.find((p) => p.id === parseInt(req.params.id));
    return post ? post.authorId : null;
  }),
  asyncHandler(async (req, res) => {
    const post = posts.find((p) => p.id === parseInt(req.params.id));

    if (!post) {
      throw new NotFoundError("Post");
    }

    return successResponse(res, post, "Post retrieved");
  })
);

/**
 * API Key protected route
 * GET /api/protected/api-data
 */
router.get(
  "/api-data",
  requireApiKey(process.env.API_KEY || "demo-api-key"),
  asyncHandler(async (req, res) => {
    return successResponse(
      res,
      {
        message: "API key authenticated",
        data: "Sensitive API data",
      },
      "API data retrieved"
    );
  })
);

/**
 * Rate limited route
 * GET /api/protected/rate-limited
 */
router.get(
  "/rate-limited",
  rateLimitByUser({ windowMs: 60 * 1000, max: 5 }), // 5 requests per minute
  asyncHandler(async (req, res) => {
    return successResponse(
      res,
      {
        message: "Rate limited endpoint accessed",
        timestamp: new Date().toISOString(),
      },
      "Rate limited endpoint accessed"
    );
  })
);

/**
 * Route with body validation
 * POST /api/protected/posts
 */
router.post(
  "/posts",
  requireAuth,
  validateBody(["title", "content"]),
  asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    const newPost = {
      id: posts.length + 1,
      title,
      content,
      authorId: req.user.id,
      isPublic: false,
      createdAt: new Date().toISOString(),
    };

    posts.push(newPost);

    return successResponse(res, newPost, "Post created successfully", 201);
  })
);

/**
 * Route with multiple middleware
 * PUT /api/protected/posts/:id
 */
router.put(
  "/posts/:id",
  logRequest, // Log the request
  requireAuth, // Require authentication
  validateParams(["id"]), // Validate parameters
  validateBody(["title"]), // Validate body
  requireOwnerOrAdmin((req) => {
    const post = posts.find((p) => p.id === parseInt(req.params.id));
    return post ? post.authorId : null;
  }), // Owner or admin only
  asyncHandler(async (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex((p) => p.id === postId);

    if (postIndex === -1) {
      throw new NotFoundError("Post");
    }

    posts[postIndex] = {
      ...posts[postIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    return successResponse(res, posts[postIndex], "Post updated successfully");
  })
);

/**
 * Delete route with admin only access
 * DELETE /api/protected/posts/:id
 */
router.delete(
  "/posts/:id",
  requireAuth,
  requireAdmin,
  validateParams(["id"]),
  asyncHandler(async (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex((p) => p.id === postId);

    if (postIndex === -1) {
      throw new NotFoundError("Post");
    }

    const deletedPost = posts.splice(postIndex, 1)[0];

    return successResponse(res, deletedPost, "Post deleted successfully");
  })
);

/**
 * Test route to demonstrate error handling
 * GET /api/protected/test-error
 */
router.get(
  "/test-error",
  asyncHandler(async (req, res) => {
    // Simulate different types of errorsçß
    const errorType = req.query.type || "generic";

    switch (errorType) {
      case "validation":
        throw new Error("Validation failed");
      case "notfound":
        throw new NotFoundError("Test resource");
      case "async":
        // Simulate async error
        await new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error("Async operation failed")), 100);
        });
        break;
      case "syntax":
        // This will cause a syntax error
        eval("invalid syntax");
        break;
      default:
        throw new Error("Generic error for testing");
    }
  })
);

module.exports = router;
