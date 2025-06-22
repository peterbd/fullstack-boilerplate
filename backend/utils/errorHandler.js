const { errorResponse } = require("./response");

/**
 * Custom Error Classes
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = null, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400, "VALIDATION_ERROR", errors);
    this.errors = errors;
  }
}

class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

class AuthorizationError extends AppError {
  constructor(message = "Insufficient permissions") {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND_ERROR");
  }
}

class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(message, 409, "CONFLICT_ERROR");
  }
}

class RateLimitError extends AppError {
  constructor(message = "Rate limit exceeded") {
    super(message, 429, "RATE_LIMIT_ERROR");
  }
}

/**
 * Get detailed error information including file and line
 * @param {Error} error - The error object
 * @returns {Object} Detailed error information
 */
const getErrorDetails = (error) => {
  const stack = error.stack || "";
  const stackLines = stack.split("\n");

  // Find the first line that contains our application code
  let errorLocation = null;
  for (let i = 1; i < stackLines.length; i++) {
    const line = stackLines[i].trim();

    // Skip node_modules and internal Node.js files
    if (
      line.includes("node_modules") ||
      line.includes("internal/") ||
      line.includes("(node:") ||
      line.includes("at process.") ||
      line.includes("at Function.")
    ) {
      continue;
    }

    // Look for our application files
    if (
      line.includes("at ") &&
      (line.includes(".js") || line.includes(".jsx"))
    ) {
      const match = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
      if (match) {
        errorLocation = {
          function: match[1],
          file: match[2],
          line: parseInt(match[3]),
          column: parseInt(match[4]),
        };
        break;
      }
    }
  }

  return {
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    location: errorLocation,
    timestamp: new Date().toISOString(),
    code: error.code || "UNKNOWN_ERROR",
  };
};

/**
 * Format error for logging
 * @param {Error} error - The error object
 * @param {Object} req - Express request object
 * @returns {string} Formatted error log
 */
const formatErrorLog = (error, req = null) => {
  const details = getErrorDetails(error);
  const reqInfo = req
    ? {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        userId: req.user ? req.user.id : "anonymous",
      }
    : null;

  let log = `[ERROR] ${details.name}: ${details.message}\n`;
  log += `Code: ${details.code}\n`;
  log += `Timestamp: ${details.timestamp}\n`;

  if (details.location) {
    log += `Location: ${details.location.function} at ${details.location.file}:${details.location.line}:${details.location.column}\n`;
  }

  if (reqInfo) {
    log += `Request: ${reqInfo.method} ${reqInfo.url} (IP: ${reqInfo.ip}, User: ${reqInfo.userId})\n`;
  }

  if (process.env.NODE_ENV === "development" && details.stack) {
    log += `Stack Trace:\n${details.stack}\n`;
  }

  return log;
};

/**
 * Handle operational errors (known errors)
 * @param {AppError} error - The operational error
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const handleOperationalError = (error, req, res, next) => {
  const details = getErrorDetails(error);

  // Log the error
  console.error(formatErrorLog(error, req));

  // Send error response
  return errorResponse(
    res,
    error.message,
    error.statusCode,
    process.env.NODE_ENV === "development" ? details : null
  );
};

/**
 * Handle programming errors (unknown errors)
 * @param {Error} error - The programming error
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const handleProgrammingError = (error, req, res, next) => {
  const details = getErrorDetails(error);

  // Log the error with full details
  console.error(formatErrorLog(error, req));

  // Send generic error response
  return errorResponse(
    res,
    "Internal server error",
    500,
    process.env.NODE_ENV === "development" ? details : null
  );
};

/**
 * Handle JWT errors specifically
 * @param {Error} error - The JWT error
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const handleJWTError = (error, req, res, next) => {
  const details = getErrorDetails(error);

  console.error(formatErrorLog(error, req));

  let message = "Token error";
  let statusCode = 401;

  if (error.name === "JsonWebTokenError") {
    message = "Invalid token";
  } else if (error.name === "TokenExpiredError") {
    message = "Token expired";
  } else if (error.name === "NotBeforeError") {
    message = "Token not active";
  }

  return errorResponse(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === "development" ? details : null
  );
};

/**
 * Handle validation errors
 * @param {Error} error - The validation error
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const handleValidationError = (error, req, res, next) => {
  const details = getErrorDetails(error);

  console.error(formatErrorLog(error, req));

  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors:
      error.errors ||
      Object.values(error.errors || {}).map((e) => ({
        field: e.path || "unknown",
        message: e.message,
      })),
    timestamp: new Date().toISOString(),
    statusCode: 400,
    ...(process.env.NODE_ENV === "development" && { details }),
  });
};

/**
 * Handle MongoDB/Mongoose errors
 * @param {Error} error - The database error
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const handleDatabaseError = (error, req, res, next) => {
  const details = getErrorDetails(error);

  console.error(formatErrorLog(error, req));

  let message = "Database error";
  let statusCode = 500;

  if (error.code === 11000) {
    // Duplicate key error
    const field = Object.keys(error.keyValue)[0];
    message = `${field} already exists`;
    statusCode = 409;
  } else if (error.name === "CastError") {
    // Invalid ID format
    message = "Invalid ID format";
    statusCode = 400;
  } else if (error.name === "ValidationError") {
    return handleValidationError(error, req, res, next);
  }

  return errorResponse(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === "development" ? details : null
  );
};

/**
 * Main error handler middleware
 * @param {Error} error - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (error, req, res, next) => {
  // Handle JWT errors
  if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError" ||
    error.name === "NotBeforeError"
  ) {
    return handleJWTError(error, req, res, next);
  }

  // Handle validation errors
  if (error.name === "ValidationError") {
    return handleValidationError(error, req, res, next);
  }

  // Handle database errors
  if (
    error.name === "MongoError" ||
    error.name === "CastError" ||
    error.name === "ValidationError"
  ) {
    return handleDatabaseError(error, req, res, next);
  }

  // Handle operational errors (our custom errors)
  if (error.isOperational) {
    return handleOperationalError(error, req, res, next);
  }

  // Handle programming errors (unknown errors)
  return handleProgrammingError(error, req, res, next);
};

/**
 * Async error wrapper for route handlers
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped function that catches async errors
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 handler for unmatched routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl}`);
  next(error);
};

/**
 * Global unhandled rejection handler
 */
const handleUnhandledRejection = (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);

  const details = getErrorDetails(reason);
  console.error(formatErrorLog(reason));

  // In production, you might want to exit the process
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
};

/**
 * Global uncaught exception handler
 */
const handleUncaughtException = (error) => {
  console.error("Uncaught Exception:", error);

  const details = getErrorDetails(error);
  console.error(formatErrorLog(error));

  // In production, you might want to exit the process
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
};

// Set up global error handlers
process.on("unhandledRejection", handleUnhandledRejection);
process.on("uncaughtException", handleUncaughtException);

module.exports = {
  // Error classes
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,

  // Error handling functions
  errorHandler,
  asyncHandler,
  notFoundHandler,
  getErrorDetails,
  formatErrorLog,

  // Global handlers
  handleUnhandledRejection,
  handleUncaughtException,
};
