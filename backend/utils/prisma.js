const { PrismaClient } = require("../generated/prisma/client");
const { formatErrorLog } = require("./errorHandler");

/**
 * Prisma Client Instance
 * Global instance to be used throughout the application
 */
let prisma = null;

/**
 * Initialize Prisma Client
 * Creates a new Prisma client instance with proper error handling
 */
const initializePrisma = () => {
  if (!prisma) {
    prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
      errorFormat: "pretty",
    });

    // Handle connection events
    prisma.$on("query", (e) => {
      if (process.env.NODE_ENV === "development") {
        console.log(`[PRISMA QUERY] ${e.query}`);
        console.log(`[PRISMA PARAMS] ${e.params}`);
        console.log(`[PRISMA DURATION] ${e.duration}ms`);
      }
    });

    prisma.$on("error", (e) => {
      console.error("[PRISMA ERROR]", e);
    });

    prisma.$on("warn", (e) => {
      console.warn("[PRISMA WARN]", e);
    });
  }

  return prisma;
};

/**
 * Get Prisma Client Instance
 * Returns the singleton Prisma client instance
 */
const getPrisma = () => {
  if (!prisma) {
    return initializePrisma();
  }
  return prisma;
};

/**
 * Disconnect Prisma Client
 * Properly closes the database connection
 */
const disconnectPrisma = async () => {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
};

/**
 * Health Check Database Connection
 * Verifies that the database connection is working
 */
const healthCheck = async () => {
  try {
    const client = getPrisma();
    await client.$queryRaw`SELECT 1`;
    return { status: "healthy", message: "Database connection successful" };
  } catch (error) {
    console.error("[PRISMA HEALTH CHECK ERROR]", error);
    return {
      status: "unhealthy",
      message: "Database connection failed",
      error: error.message,
    };
  }
};

/**
 * Database Transaction Wrapper
 * Executes a function within a database transaction
 */
const transaction = async (fn) => {
  const client = getPrisma();
  return await client.$transaction(fn);
};

/**
 * Soft Delete Helper
 * Marks a record as deleted without actually removing it
 */
const softDelete = async (model, id, userId = null) => {
  const client = getPrisma();

  const updateData = {
    deletedAt: new Date(),
    ...(userId && { deletedBy: userId }),
  };

  return await client[model].update({
    where: { id },
    data: updateData,
  });
};

/**
 * Pagination Helper
 * Creates pagination parameters for Prisma queries
 */
const createPagination = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  return {
    skip,
    take,
    page: parseInt(page),
    limit: take,
  };
};

/**
 * Search Helper
 * Creates search conditions for Prisma queries
 */
const createSearchConditions = (searchTerm, searchFields) => {
  if (!searchTerm || !searchFields.length) {
    return {};
  }

  const conditions = searchFields.map((field) => ({
    [field]: {
      contains: searchTerm,
      mode: "insensitive",
    },
  }));

  return {
    OR: conditions,
  };
};

/**
 * Order By Helper
 * Creates order by conditions for Prisma queries
 */
const createOrderBy = (sortBy = "createdAt", sortOrder = "desc") => {
  const validSortOrders = ["asc", "desc"];
  const order = validSortOrders.includes(sortOrder.toLowerCase())
    ? sortOrder.toLowerCase()
    : "desc";

  return {
    [sortBy]: order,
  };
};

/**
 * Filter Helper
 * Creates filter conditions for Prisma queries
 */
const createFilters = (filters = {}) => {
  const conditions = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        conditions[key] = {
          in: value,
        };
      } else if (typeof value === "object" && value.operator) {
        conditions[key] = {
          [value.operator]: value.value,
        };
      } else {
        conditions[key] = value;
      }
    }
  });

  return conditions;
};

/**
 * Include Helper
 * Creates include conditions for Prisma queries
 */
const createInclude = (includes = []) => {
  const include = {};

  includes.forEach((includeItem) => {
    if (typeof includeItem === "string") {
      include[includeItem] = true;
    } else if (typeof includeItem === "object") {
      Object.assign(include, includeItem);
    }
  });

  return Object.keys(include).length > 0 ? include : undefined;
};

/**
 * Select Helper
 * Creates select conditions for Prisma queries
 */
const createSelect = (fields = []) => {
  const select = {};

  fields.forEach((field) => {
    select[field] = true;
  });

  return Object.keys(select).length > 0 ? select : undefined;
};

/**
 * Exclude Password Helper
 * Removes password field from user objects
 */
const excludePassword = (user) => {
  if (!user) return user;

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Exclude Passwords from Array
 * Removes password field from array of user objects
 */
const excludePasswords = (users) => {
  if (!Array.isArray(users)) return users;

  return users.map((user) => excludePassword(user));
};

/**
 * Audit Log Helper
 * Creates audit log entries for database operations
 */
const createAuditLog = async (
  action,
  entity,
  entityId = null,
  userId = null,
  details = null,
  req = null
) => {
  try {
    const client = getPrisma();

    await client.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        userId,
        details,
        ipAddress: req?.ip,
        userAgent: req?.get("User-Agent"),
      },
    });
  } catch (error) {
    console.error("[AUDIT LOG ERROR]", error);
    // Don't throw error for audit log failures
  }
};

/**
 * Database Error Handler
 * Handles common Prisma errors and provides meaningful messages
 */
const handleDatabaseError = (error) => {
  console.error("[DATABASE ERROR]", formatErrorLog(error));

  switch (error.code) {
    case "P2002":
      const field = error.meta?.target?.[0] || "field";
      throw new Error(`${field} already exists`);

    case "P2025":
      throw new Error("Record not found");

    case "P2003":
      throw new Error("Foreign key constraint failed");

    case "P2014":
      throw new Error(
        "The change you are trying to make would violate the required relation"
      );

    case "P2021":
      throw new Error("The table does not exist in the current database");

    case "P2022":
      throw new Error("The column does not exist in the current database");

    default:
      throw new Error("Database operation failed");
  }
};

/**
 * Database Query Wrapper
 * Wraps database operations with error handling and audit logging
 */
const dbQuery = async (operation, options = {}) => {
  const {
    audit = false,
    action = null,
    entity = null,
    entityId = null,
    userId = null,
    req = null,
  } = options;

  try {
    const result = await operation();

    // Create audit log if requested
    if (audit && action && entity) {
      await createAuditLog(action, entity, entityId, userId, null, req);
    }

    return result;
  } catch (error) {
    handleDatabaseError(error);
  }
};

/**
 * Seed Database Helper
 * Seeds the database with initial data
 */
const seedDatabase = async () => {
  const client = getPrisma();

  try {
    // Check if data already exists
    const userCount = await client.user.count();
    if (userCount > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Create admin user
    const adminUser = await client.user.create({
      data: {
        email: "admin@example.com",
        password: "admin123", // In real app, hash this password
        name: "Admin User",
        roles: ["ADMIN", "USER"],
        profile: {
          create: {
            bio: "System Administrator",
            location: "System",
          },
        },
      },
    });

    // Create regular user
    const regularUser = await client.user.create({
      data: {
        email: "user@example.com",
        password: "user123", // In real app, hash this password
        name: "Regular User",
        roles: ["USER"],
        profile: {
          create: {
            bio: "Regular user account",
            location: "Unknown",
          },
        },
      },
    });

    // Create sample tags
    const tags = await Promise.all([
      client.tag.create({
        data: { name: "Technology", slug: "technology", color: "#3B82F6" },
      }),
      client.tag.create({
        data: { name: "Programming", slug: "programming", color: "#10B981" },
      }),
      client.tag.create({
        data: {
          name: "Web Development",
          slug: "web-development",
          color: "#F59E0B",
        },
      }),
    ]);

    // Create sample posts
    const posts = await Promise.all([
      client.post.create({
        data: {
          title: "Welcome to Our Platform",
          content: "This is a sample post to get you started.",
          slug: "welcome-to-our-platform",
          isPublic: true,
          isPublished: true,
          publishedAt: new Date(),
          authorId: adminUser.id,
          tags: {
            connect: [{ id: tags[0].id }],
          },
        },
      }),
      client.post.create({
        data: {
          title: "Getting Started with Prisma",
          content:
            "Prisma is a modern database toolkit for Node.js and TypeScript.",
          slug: "getting-started-with-prisma",
          isPublic: true,
          isPublished: true,
          publishedAt: new Date(),
          authorId: regularUser.id,
          tags: {
            connect: [{ id: tags[1].id }, { id: tags[2].id }],
          },
        },
      }),
    ]);

    console.log("Database seeded successfully!");
    console.log(
      `Created ${userCount + 2} users, ${tags.length} tags, and ${
        posts.length
      } posts`
    );
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};

/**
 * Database Migration Helper
 * Runs database migrations
 */
const runMigrations = async () => {
  try {
    const { execSync } = require("child_process");
    execSync("npx prisma migrate dev", { stdio: "inherit" });
    console.log("Database migrations completed successfully");
  } catch (error) {
    console.error("Error running migrations:", error);
    throw error;
  }
};

/**
 * Database Reset Helper
 * Resets the database (use with caution!)
 */
const resetDatabase = async () => {
  try {
    const { execSync } = require("child_process");
    execSync("npx prisma migrate reset --force", { stdio: "inherit" });
    console.log("Database reset completed successfully");
  } catch (error) {
    console.error("Error resetting database:", error);
    throw error;
  }
};

/**
 * Generate Prisma Client
 * Generates the Prisma client
 */
const generateClient = async () => {
  try {
    const { execSync } = require("child_process");
    execSync("npx prisma generate", { stdio: "inherit" });
    console.log("Prisma client generated successfully");
  } catch (error) {
    console.error("Error generating Prisma client:", error);
    throw error;
  }
};

module.exports = {
  // Core functions
  initializePrisma,
  getPrisma,
  disconnectPrisma,
  healthCheck,
  transaction,

  // Query helpers
  createPagination,
  createSearchConditions,
  createOrderBy,
  createFilters,
  createInclude,
  createSelect,

  // Data helpers
  excludePassword,
  excludePasswords,
  softDelete,

  // Audit and logging
  createAuditLog,
  dbQuery,

  // Error handling
  handleDatabaseError,

  // Database management
  seedDatabase,
  runMigrations,
  resetDatabase,
  generateClient,
};
