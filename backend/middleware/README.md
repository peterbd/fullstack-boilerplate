# Authentication Middleware

This directory contains authentication and authorization middleware functions for protecting routes and managing access control.

## Available Middleware

### Authentication Middleware

#### `requireAuth`

Requires a valid JWT token for access.

```javascript
const { requireAuth } = require("../middleware/auth");

router.get("/profile", requireAuth, (req, res) => {
  // req.user contains the decoded token
  return successResponse(res, req.user);
});
```

#### `optionalAuth`

Adds user data if token is present, but doesn't require authentication.

```javascript
const { optionalAuth } = require("../middleware/auth");

router.get("/posts", optionalAuth, (req, res) => {
  if (req.user) {
    // User is authenticated
    return getPersonalizedPosts(req.user.id);
  } else {
    // User is not authenticated
    return getPublicPosts();
  }
});
```

### Authorization Middleware

#### `requireRoles(roles)`

Requires specific role(s) for access.

```javascript
const { requireRoles } = require("../middleware/auth");

// Single role
router.get("/admin", requireAuth, requireRoles(["admin"]), (req, res) => {
  // Admin only access
});

// Multiple roles
router.get(
  "/moderator",
  requireAuth,
  requireRoles(["admin", "moderator"]),
  (req, res) => {
    // Admin or moderator access
  }
);
```

#### `requireAdmin`

Shorthand for requiring admin role.

```javascript
const { requireAdmin } = require("../middleware/auth");

router.delete("/users/:id", requireAuth, requireAdmin, (req, res) => {
  // Admin only access
});
```

#### `requireUserOrAdmin`

Requires either user or admin role.

```javascript
const { requireUserOrAdmin } = require("../middleware/auth");

router.get("/dashboard", requireAuth, requireUserOrAdmin, (req, res) => {
  // User or admin access
});
```

#### `requireOwnerOrAdmin(getResourceOwnerId)`

Allows access if user owns the resource or is admin.

```javascript
const { requireOwnerOrAdmin } = require("../middleware/auth");

router.get(
  "/posts/:id",
  requireAuth,
  requireOwnerOrAdmin((req) => {
    const post = getPost(req.params.id);
    return post ? post.authorId : null;
  }),
  (req, res) => {
    // User can access their own posts or admin can access any
  }
);
```

### API Key Authentication

#### `requireApiKey(apiKey)`

Validates API key from headers.

```javascript
const { requireApiKey } = require("../middleware/auth");

router.get("/api-data", requireApiKey(process.env.API_KEY), (req, res) => {
  // API key authenticated
});
```

### Rate Limiting

#### `rateLimitByUser(config)`

Applies rate limiting based on user ID or IP.

```javascript
const { rateLimitByUser } = require("../middleware/auth");

router.get(
  "/sensitive-data",
  rateLimitByUser({ windowMs: 60 * 1000, max: 10 }), // 10 requests per minute
  (req, res) => {
    // Rate limited endpoint
  }
);
```

### Validation Middleware

#### `validateBody(requiredFields)`

Validates required fields in request body.

```javascript
const { validateBody } = require("../middleware/auth");

router.post(
  "/users",
  validateBody(["name", "email", "password"]),
  (req, res) => {
    // Body validation passed
  }
);
```

#### `validateParams(requiredParams)`

Validates required parameters in request.

```javascript
const { validateParams } = require("../middleware/auth");

router.get("/users/:id", validateParams(["id"]), (req, res) => {
  // Parameter validation passed
});
```

### Utility Middleware

#### `logRequest`

Logs incoming requests for debugging.

```javascript
const { logRequest } = require("../middleware/auth");

router.get("/debug", logRequest, (req, res) => {
  // Request will be logged
});
```

#### `errorHandler`

Catches and formats errors.

```javascript
const { errorHandler } = require("../middleware/auth");

// Add to your app
app.use(errorHandler);
```

## Usage Examples

### Basic Protected Route

```javascript
const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { successResponse } = require("../utils/response");

const router = express.Router();

router.get("/profile", requireAuth, (req, res) => {
  return successResponse(res, req.user, "Profile retrieved");
});
```

### Role-Based Access Control

```javascript
const { requireAuth, requireRoles } = require("../middleware/auth");

// Admin only
router.get(
  "/admin/dashboard",
  requireAuth,
  requireRoles(["admin"]),
  (req, res) => {
    return successResponse(res, { adminData: "secret" });
  }
);

// Multiple roles
router.get(
  "/moderator/posts",
  requireAuth,
  requireRoles(["admin", "moderator"]),
  (req, res) => {
    return successResponse(res, { posts: getAllPosts() });
  }
);
```

### Resource Ownership

```javascript
const { requireOwnerOrAdmin } = require("../middleware/auth");

router.put(
  "/posts/:id",
  requireAuth,
  requireOwnerOrAdmin((req) => {
    const post = getPostById(req.params.id);
    return post ? post.authorId : null;
  }),
  (req, res) => {
    // User can update their own posts, admin can update any
    return successResponse(res, updatedPost);
  }
);
```

### Multiple Middleware

```javascript
router.post(
  "/posts",
  logRequest, // Log the request
  requireAuth, // Require authentication
  validateBody(["title"]), // Validate body
  rateLimitByUser({ max: 5 }), // Rate limit
  (req, res) => {
    // All middleware passed
    return successResponse(res, newPost);
  }
);
```

### API Key Protection

```javascript
const { requireApiKey } = require("../middleware/auth");

router.get(
  "/external-data",
  requireApiKey(process.env.EXTERNAL_API_KEY),
  (req, res) => {
    return successResponse(res, { data: "sensitive" });
  }
);
```

## Environment Variables

Make sure to set these environment variables:

```bash
# Required for JWT authentication
JWT_SECRET=your-super-secret-jwt-key

# Optional for API key authentication
API_KEY=your-api-key-here
```

## Best Practices

1. **Always use HTTPS in production** - JWT tokens should be transmitted securely
2. **Set appropriate token expiration** - Short for access tokens, longer for refresh tokens
3. **Validate input** - Use validation middleware for all user inputs
4. **Log requests** - Use logging middleware for debugging and monitoring
5. **Rate limit sensitive endpoints** - Prevent abuse of your API
6. **Use role-based access** - Implement proper authorization
7. **Handle errors gracefully** - Use error handling middleware

## Security Considerations

- JWT tokens should be stored securely on the client side
- Refresh tokens should be stored in a secure, HTTP-only cookie
- API keys should be kept secret and rotated regularly
- Rate limiting should be applied to prevent abuse
- Input validation should be used to prevent injection attacks
- Error messages should not leak sensitive information
