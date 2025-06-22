const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { errorResponse, notFoundResponse } = require("./utils/response");
const { errorHandler, notFoundHandler } = require("./utils/errorHandler");
const {
  initializePrisma,
  disconnectPrisma,
  healthCheck,
} = require("./utils/prisma");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Prisma
initializePrisma();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        process.env.FRONTEND_URL || "http://localhost:5173",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://localhost:3001",
      ];

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging middleware
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/health", require("./routes/health"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/protected", require("./routes/protected"));

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Express.js API",
    version: "1.0.0",
    database: "Prisma ORM",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      users: "/api/users",
      protected: "/api/protected",
    },
  });
});

// 404 handler - must be before error handler
app.use("*", notFoundHandler);

// Global error handling middleware - must be last
app.use(errorHandler);

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Received SIGINT. Performing graceful shutdown...");
  await disconnectPrisma();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Received SIGTERM. Performing graceful shutdown...");
  await disconnectPrisma();
  process.exit(0);
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`
  );
  console.log(`🔗 API URL: http://localhost:${PORT}`);

  // Check database connection
  try {
    const dbHealth = await healthCheck();
    if (dbHealth.status === "healthy") {
      console.log(`✅ Database: ${dbHealth.message}`);
    } else {
      console.log(`❌ Database: ${dbHealth.message}`);
    }
  } catch (error) {
    console.log(`❌ Database: Connection failed - ${error.message}`);
  }
});
