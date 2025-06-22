const express = require("express");
const { successResponse } = require("../utils/response");
const { asyncHandler } = require("../utils/errorHandler");
const { healthCheck, getPrisma } = require("../utils/prisma");

const router = express.Router();

/**
 * Health check endpoint
 * GET /api/health
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const dbHealth = await healthCheck();

    const healthData = {
      status: dbHealth.status === "healthy" ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
      database: {
        status: dbHealth.status,
        message: dbHealth.message,
        ...(dbHealth.error && { error: dbHealth.error }),
      },
      services: {
        database: dbHealth.status,
        cache: "connected", // In real app, check Redis/cache connection
      },
    };

    const statusCode = healthData.status === "healthy" ? 200 : 503;
    return successResponse(
      res,
      healthData,
      "Service health check completed",
      statusCode
    );
  })
);

/**
 * Detailed health check
 * GET /api/health/detailed
 */
router.get(
  "/detailed",
  asyncHandler(async (req, res) => {
    const dbHealth = await healthCheck();
    const prisma = getPrisma();

    // Get database statistics
    let dbStats = {};
    if (dbHealth.status === "healthy") {
      try {
        const [userCount, postCount, tagCount] = await Promise.all([
          prisma.user.count(),
          prisma.post.count(),
          prisma.tag.count(),
        ]);

        dbStats = {
          users: userCount,
          posts: postCount,
          tags: tagCount,
        };
      } catch (error) {
        dbStats = { error: "Failed to get database statistics" };
      }
    }

    const detailedHealth = {
      status: dbHealth.status === "healthy" ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
      process: {
        pid: process.pid,
        platform: process.platform,
        nodeVersion: process.version,
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
      },
      system: {
        loadAverage: require("os").loadavg(),
        totalMemory: require("os").totalmem(),
        freeMemory: require("os").freemem(),
        uptime: require("os").uptime(),
      },
      database: {
        status: dbHealth.status,
        message: dbHealth.message,
        stats: dbStats,
        ...(dbHealth.error && { error: dbHealth.error }),
      },
      services: {
        database: {
          status: dbHealth.status,
          responseTime: "2ms", // In real app, measure actual response time
        },
        cache: {
          status: "connected",
          responseTime: "1ms", // In real app, measure actual response time
        },
        external: {
          status: "connected",
          responseTime: "50ms", // In real app, measure actual response time
        },
      },
    };

    const statusCode = detailedHealth.status === "healthy" ? 200 : 503;
    return successResponse(
      res,
      detailedHealth,
      "Detailed health check completed",
      statusCode
    );
  })
);

/**
 * Readiness check for load balancers
 * GET /api/health/ready
 */
router.get(
  "/ready",
  asyncHandler(async (req, res) => {
    const dbHealth = await healthCheck();

    // In real app, check if the application is ready to receive traffic
    // This might include checking database connections, cache connections, etc.
    const isReady = dbHealth.status === "healthy";

    const readinessCheck = {
      status: isReady ? "ready" : "not_ready",
      timestamp: new Date().toISOString(),
      checks: {
        database: dbHealth.status,
        cache: "ready",
        fileSystem: "ready",
        externalServices: "ready",
      },
      ...(dbHealth.error && { databaseError: dbHealth.error }),
    };

    const statusCode = isReady ? 200 : 503;
    return successResponse(
      res,
      readinessCheck,
      "Service readiness check completed",
      statusCode
    );
  })
);

/**
 * Liveness check for Kubernetes
 * GET /api/health/live
 */
router.get(
  "/live",
  asyncHandler(async (req, res) => {
    // Simple check to see if the process is alive
    const livenessCheck = {
      status: "alive",
      timestamp: new Date().toISOString(),
      pid: process.pid,
      uptime: process.uptime(),
    };

    return successResponse(res, livenessCheck, "Service is alive");
  })
);

/**
 * Database specific health check
 * GET /api/health/database
 */
router.get(
  "/database",
  asyncHandler(async (req, res) => {
    const dbHealth = await healthCheck();
    const prisma = getPrisma();

    let dbInfo = {};
    if (dbHealth.status === "healthy") {
      try {
        // Get database connection info
        const result =
          await prisma.$queryRaw`SELECT version() as version, current_database() as database, current_user as user`;
        dbInfo = result[0];
      } catch (error) {
        dbInfo = { error: "Failed to get database info" };
      }
    }

    const databaseHealth = {
      status: dbHealth.status,
      timestamp: new Date().toISOString(),
      connection: {
        status: dbHealth.status,
        message: dbHealth.message,
        ...(dbHealth.error && { error: dbHealth.error }),
      },
      info: dbInfo,
    };

    const statusCode = dbHealth.status === "healthy" ? 200 : 503;
    return successResponse(
      res,
      databaseHealth,
      "Database health check completed",
      statusCode
    );
  })
);

module.exports = router;
