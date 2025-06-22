# Backend Utilities

This directory contains utility functions for standardized API responses and JWT authentication.

## Response Utilities (`response.js`)

Provides consistent API response formats across all endpoints.

### Available Functions

#### `successResponse(res, data, message, statusCode)`

Returns a standardized success response.

```javascript
const { successResponse } = require("../utils/response");

// Basic success response
return successResponse(res, userData, "User retrieved successfully");

// With custom status code
return successResponse(res, newUser, "User created", 201);
```

#### `errorResponse(res, message, statusCode, error)`

Returns a standardized error response.

```javascript
const { errorResponse } = require("../utils/response");

// Basic error response
return errorResponse(res, "Failed to fetch user", 500);

// With error details (only shown in development)
return errorResponse(res, "Database error", 500, error);
```

#### `validationErrorResponse(res, errors, message)`

Returns validation error response with field-specific errors.

```javascript
const { validationErrorResponse } = require("../utils/response");

const errors = [
  { field: "email", message: "Valid email is required" },
  { field: "password", message: "Password must be at least 6 characters" },
];

return validationErrorResponse(res, errors, "Validation failed");
```

#### `notFoundResponse(res, message)`

Returns 404 not found response.

```javascript
const { notFoundResponse } = require("../utils/response");

return notFoundResponse(res, "User not found");
```

#### `unauthorizedResponse(res, message)`

Returns 401 unauthorized response.

```javascript
const { unauthorizedResponse } = require("../utils/response");

return unauthorizedResponse(res, "Invalid credentials");
```

#### `forbiddenResponse(res, message)`

Returns 403 forbidden response.

```javascript
const { forbiddenResponse } = require("../utils/response");

return forbiddenResponse(res, "Insufficient permissions");
```

#### `createdResponse(res, data, message)`

Returns 201 created response.

```javascript
const { createdResponse } = require("../utils/response");

return createdResponse(res, newUser, "User created successfully");
```

#### `noContentResponse(res)`

Returns 204 no content response.

```javascript
const { noContentResponse } = require("../utils/response");

return noContentResponse(res);
```

#### `paginatedResponse(res, data, page, limit, total, message)`

Returns paginated response with metadata.

```javascript
const { paginatedResponse } = require("../utils/response");

return paginatedResponse(
  res,
  users,
  1,
  10,
  100,
  "Users retrieved successfully"
);
```

## JWT Utilities (`jwt.js`)

Handles JWT token generation, verification, and authentication middleware.

### Available Functions

#### `generateToken(payload, expiresIn)`

Generates a JWT token.

```javascript
const { generateToken } = require("../utils/jwt");

const token = generateToken({ userId: 1, email: "user@example.com" }, "24h");
```

#### `generateAccessToken(payload)`

Generates a short-lived access token (15 minutes).

```javascript
const { generateAccessToken } = require("../utils/jwt");

const accessToken = generateAccessToken({
  userId: 1,
  email: "user@example.com",
});
```

#### `generateRefreshToken(payload)`

Generates a long-lived refresh token (7 days).

```javascript
const { generateRefreshToken } = require("../utils/jwt");

const refreshToken = generateRefreshToken({
  userId: 1,
  email: "user@example.com",
});
```

#### `verifyToken(token)`

Verifies and decodes a JWT token.

```javascript
const { verifyToken } = require("../utils/jwt");

try {
  const decoded = verifyToken(token);
  console.log(decoded); // { userId: 1, email: 'user@example.com', iat: ..., exp: ... }
} catch (error) {
  console.error("Token verification failed:", error.message);
}
```

#### `authenticateToken(req, res, next)`

Express middleware for JWT authentication.

```javascript
const { authenticateToken } = require("../utils/jwt");

// Protected route
router.get("/profile", authenticateToken, (req, res) => {
  // req.user contains the decoded token payload
  return successResponse(res, req.user, "Profile retrieved");
});
```

#### `optionalAuth(req, res, next)`

Optional authentication middleware (doesn't require token).

```javascript
const { optionalAuth } = require("../utils/jwt");

// Optional authentication
router.get("/posts", optionalAuth, (req, res) => {
  if (req.user) {
    // User is authenticated
    return getPrivatePosts(req.user.id);
  } else {
    // User is not authenticated
    return getPublicPosts();
  }
});
```

#### `authorizeRoles(requiredRoles)`

Role-based authorization middleware.

```javascript
const { authorizeRoles } = require("../utils/jwt");

// Admin only route
router.delete(
  "/users/:id",
  authenticateToken,
  authorizeRoles(["admin"]),
  (req, res) => {
    // Only users with 'admin' role can access this
  }
);

// Multiple roles
router.get(
  "/admin",
  authenticateToken,
  authorizeRoles(["admin", "moderator"]),
  (req, res) => {
    // Users with 'admin' or 'moderator' role can access this
  }
);
```

#### `refreshTokenPair(refreshToken)`

Refreshes access and refresh tokens.

```javascript
const { refreshTokenPair } = require("../utils/jwt");

const newTokens = refreshTokenPair(refreshToken);
// Returns: { accessToken, refreshToken, user }
```

### Environment Variables

Make sure to set the following environment variables:

```bash
# Required for JWT functionality
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Security Best Practices

1. **Use strong JWT secrets** - Generate a random 32+ character string
2. **Set appropriate expiration times** - Short for access tokens, longer for refresh tokens
3. **Store refresh tokens securely** - Use Redis or database, not in memory
4. **Implement token rotation** - Generate new refresh tokens on each use
5. **Validate tokens on every request** - Don't trust client-side validation
6. **Use HTTPS in production** - JWT tokens should be transmitted securely

### Example Usage in Routes

```javascript
const express = require("express");
const { successResponse, errorResponse } = require("../utils/response");
const { authenticateToken, authorizeRoles } = require("../utils/jwt");

const router = express.Router();

// Public route
router.get("/public", (req, res) => {
  return successResponse(res, { message: "Public data" });
});

// Protected route
router.get("/protected", authenticateToken, (req, res) => {
  return successResponse(res, { user: req.user });
});

// Admin only route
router.get(
  "/admin",
  authenticateToken,
  authorizeRoles(["admin"]),
  (req, res) => {
    return successResponse(res, { adminData: "secret" });
  }
);
```

# Utilities Documentation

This directory contains utility functions for the Express.js backend application.

## Error Handling System

The error handling system provides comprehensive error management with detailed error information for developers.

### Features

- **Custom Error Classes** - Predefined error types with appropriate status codes
- **Detailed Error Information** - File and line numbers for debugging
- **Global Error Handlers** - Catch unhandled rejections and exceptions
- **Async Error Wrapper** - Automatic error catching for async route handlers
- **Environment-aware** - Different error details in development vs production

### Error Classes

#### `AppError`

Base error class for all application errors.

```javascript
const { AppError } = require("./errorHandler");

throw new AppError("Custom error message", 400, "CUSTOM_ERROR_CODE");
```

#### `ValidationError`

For input validation errors.

```javascript
const { ValidationError } = require("./errorHandler");

throw new ValidationError("Validation failed", [
  { field: "email", message: "Email is required" },
  { field: "password", message: "Password must be at least 6 characters" },
]);
```

#### `AuthenticationError`

For authentication failures.

```javascript
const { AuthenticationError } = require("./errorHandler");

throw new AuthenticationError("Invalid credentials");
```

#### `AuthorizationError`

For authorization/permission failures.

```javascript
const { AuthorizationError } = require("./errorHandler");

throw new AuthorizationError("Insufficient permissions");
```

#### `NotFoundError`

For resource not found errors.

```javascript
const { NotFoundError } = require("./errorHandler");

throw new NotFoundError("User"); // "User not found"
```

#### `ConflictError`

For resource conflicts (e.g., duplicate entries).

```javascript
const { ConflictError } = require("./errorHandler");

throw new ConflictError("User with this email already exists");
```

#### `RateLimitError`

For rate limiting violations.

```javascript
const { RateLimitError } = require("./errorHandler");

throw new RateLimitError("Too many requests");
```

### Error Handler Functions

#### `errorHandler`

Main error handling middleware for Express.

```javascript
const { errorHandler } = require("./errorHandler");

// Add to your Express app (must be last)
app.use(errorHandler);
```

#### `asyncHandler`

Wrapper for async route handlers to automatically catch errors.

```javascript
const { asyncHandler } = require("./errorHandler");

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await getUsers();
    return successResponse(res, users);
  })
);
```

#### `notFoundHandler`

404 handler for unmatched routes.

```javascript
const { notFoundHandler } = require("./errorHandler");

app.use("*", notFoundHandler);
```

### Error Response Format

In development mode, error responses include detailed information:

```json
{
  "success": false,
  "message": "User not found",
  "statusCode": 404,
  "details": {
    "name": "NotFoundError",
    "message": "User not found",
    "code": "NOT_FOUND_ERROR",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "location": {
      "function": "getUser",
      "file": "/app/routes/users.js",
      "line": 25,
      "column": 15
    },
    "stack": "NotFoundError: User not found\n    at getUser (/app/routes/users.js:25:15)\n    ..."
  }
}
```

In production mode, only essential information is included:

```json
{
  "success": false,
  "message": "User not found",
  "statusCode": 404
}
```

### Error Logging

The system automatically logs errors with detailed information:

```
[ERROR] NotFoundError: User not found
Code: NOT_FOUND_ERROR
Timestamp: 2024-01-15T10:30:00.000Z
Location: getUser at /app/routes/users.js:25:15
Request: GET /api/users/999 (IP: 192.168.1.1, User: anonymous)
Stack Trace:
NotFoundError: User not found
    at getUser (/app/routes/users.js:25:15)
    at asyncHandler (/app/utils/errorHandler.js:280:12)
    ...
```

### Global Error Handlers

The system automatically sets up handlers for:

- **Unhandled Rejections** - Catches unhandled Promise rejections
- **Uncaught Exceptions** - Catches uncaught exceptions

These handlers log the error and optionally exit the process in production.

### Usage Examples

#### Basic Route with Error Handling

```javascript
const express = require("express");
const { asyncHandler, NotFoundError } = require("../utils/errorHandler");
const { successResponse } = require("../utils/response");

const router = express.Router();

router.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const user = await getUserById(req.params.id);

    if (!user) {
      throw new NotFoundError("User");
    }

    return successResponse(res, user, "User retrieved successfully");
  })
);
```

#### Validation with Custom Errors

```javascript
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
      throw new ValidationError("Missing required fields", [
        { field: "name", message: "Name is required" },
        { field: "email", message: "Email is required" },
      ]);
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const newUser = await createUser({ name, email });
    return successResponse(res, newUser, "User created successfully", 201);
  })
);
```

#### Authentication Error

```javascript
const { requireAuth } = require("../middleware/auth");

router.get(
  "/profile",
  requireAuth,
  asyncHandler(async (req, res) => {
    // If authentication fails, requireAuth will throw AuthenticationError
    return successResponse(res, req.user, "Profile retrieved");
  })
);
```

### Testing Error Handling

Use the test endpoint to see different error types:

```bash
# Generic error
GET /api/protected/test-error

# Validation error
GET /api/protected/test-error?type=validation

# Not found error
GET /api/protected/test-error?type=notfound

# Async error
GET /api/protected/test-error?type=async

# Syntax error
GET /api/protected/test-error?type=syntax
```

### Best Practices

1. **Use Custom Error Classes** - Use appropriate error classes for different scenarios
2. **Wrap Async Handlers** - Always use `asyncHandler` for async route handlers
3. **Throw, Don't Return** - Throw errors instead of returning error responses
4. **Provide Context** - Include relevant information in error messages
5. **Log Appropriately** - Let the error handler log errors, don't log in route handlers
6. **Environment Awareness** - Don't expose sensitive information in production

### Configuration

The error handling system respects the `NODE_ENV` environment variable:

- **Development** (`NODE_ENV=development`): Full error details including stack traces
- **Production** (`NODE_ENV=production`): Minimal error details for security

### Integration with Middleware

The error handling system integrates seamlessly with the authentication middleware:

```javascript
const { requireAuth, requireRoles } = require("../middleware/auth");
const { asyncHandler } = require("../utils/errorHandler");

router.get(
  "/admin",
  requireAuth,
  requireRoles(["admin"]),
  asyncHandler(async (req, res) => {
    // If any middleware throws an error, it will be caught and handled
    return successResponse(res, adminData);
  })
);
```

## Response Utilities

Standardized API response functions for consistent formatting.

### `successResponse(res, data, message, statusCode)`

Creates a standardized success response.

```javascript
const { successResponse } = require("./response");

return successResponse(res, userData, "User retrieved successfully");
```

### `errorResponse(res, message, statusCode, error)`

Creates a standardized error response.

```javascript
const { errorResponse } = require("./response");

return errorResponse(res, "Something went wrong", 500);
```

## JWT Utilities

Authentication and authorization utilities.

### `generateAccessToken(payload)`

Generates a JWT access token.

```javascript
const { generateAccessToken } = require("./jwt");

const token = generateAccessToken({ userId: 1, email: "user@example.com" });
```

### `verifyToken(token, secret)`

Verifies and decodes a JWT token.

```javascript
const { verifyToken } = require("./jwt");

const decoded = verifyToken(token);
```

### `extractTokenFromHeader(authHeader)`

Extracts token from Authorization header.

```javascript
const { extractTokenFromHeader } = require("./jwt");

const token = extractTokenFromHeader(req.headers.authorization);
```
