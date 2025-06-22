#!/usr/bin/env node

const {
  runMigrations,
  resetDatabase,
  seedDatabase,
  generateClient,
  healthCheck,
  getPrisma,
} = require("../utils/prisma");

const { execSync } = require("child_process");

/**
 * Database Management Script
 * Handles database operations like migrations, seeding, and reset
 */

const commands = {
  migrate: async () => {
    console.log("🔄 Running database migrations...");
    await runMigrations();
  },

  migrateNoShadow: () => {
    console.log("🔄 Running database migrations without shadow database...");
    console.log("⚠️  This skips shadow database validation");
    execSync("npx prisma migrate dev --skip-shadow-database-url-validation", {
      stdio: "inherit",
    });
  },

  migrateDeploy: () => {
    console.log("🚀 Deploying migrations (production mode)...");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
  },

  dbPush: () => {
    console.log("📤 Pushing schema to database (no migrations)...");
    console.log("⚠️  This will overwrite the database schema");
    execSync("npx prisma db push", { stdio: "inherit" });
  },

  reset: async () => {
    console.log("🔄 Resetting database...");
    await resetDatabase();
  },

  seed: async () => {
    console.log("🌱 Seeding database...");
    await seedDatabase();
  },

  generate: async () => {
    console.log("🔧 Generating Prisma client...");
    await generateClient();
  },

  health: async () => {
    console.log("🏥 Checking database health...");
    const health = await healthCheck();
    console.log(`Status: ${health.status}`);
    console.log(`Message: ${health.message}`);
    if (health.error) {
      console.log(`Error: ${health.error}`);
    }
  },

  studio: () => {
    console.log("🎨 Opening Prisma Studio...");
    execSync("npx prisma studio", { stdio: "inherit" });
  },

  format: () => {
    console.log("📝 Formatting Prisma schema...");
    execSync("npx prisma format", { stdio: "inherit" });
  },

  validate: () => {
    console.log("✅ Validating Prisma schema...");
    execSync("npx prisma validate", { stdio: "inherit" });
  },

  deploy: () => {
    console.log("🚀 Deploying database schema...");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
  },

  status: () => {
    console.log("📊 Checking migration status...");
    execSync("npx prisma migrate status", { stdio: "inherit" });
  },

  resetAndSeed: async () => {
    console.log("🔄 Resetting and seeding database...");
    await resetDatabase();
    await seedDatabase();
  },

  migrateAndSeed: async () => {
    console.log("🔄 Running migrations and seeding database...");
    await runMigrations();
    await seedDatabase();
  },

  fullSetup: async () => {
    console.log("🚀 Full database setup...");
    await generateClient();
    await runMigrations();
    await seedDatabase();
    console.log("✅ Database setup completed!");
  },

  setupNoShadow: async () => {
    console.log("🚀 Full database setup without shadow database...");
    await generateClient();
    commands.migrateNoShadow();
    await seedDatabase();
    console.log("✅ Database setup completed!");
  },

  setupPush: async () => {
    console.log("🚀 Full database setup using db push...");
    await generateClient();
    commands.dbPush();
    await generateClient();
    await seedDatabase();
    console.log("✅ Database setup completed!");
  },

  troubleshoot: () => {
    console.log(`
🔧 Shadow Database Troubleshooting Guide

The error you're seeing is related to Prisma's shadow database feature. Here are solutions:

1. GRANT PERMISSIONS (Recommended):
   Connect to your PostgreSQL database as a superuser and run:
   
   GRANT CREATE ON DATABASE fullstack_boilerplate TO your_username;
   
   Or grant all privileges:
   GRANT ALL PRIVILEGES ON DATABASE fullstack_boilerplate TO your_username;

2. USE SHADOW DATABASE URL:
   Add to your .env file:
   SHADOW_DATABASE_URL="postgresql://username:password@localhost:5432/fullstack_boilerplate_shadow?schema=public"
   
   Then create the shadow database:
   CREATE DATABASE fullstack_boilerplate_shadow;

3. SKIP SHADOW VALIDATION:
   Run: node scripts/db.js migrateNoShadow
   
4. USE DB PUSH (Development only):
   Run: node scripts/db.js dbPush
   
5. SWITCH TO SQLITE (Quick development):
   Change DATABASE_URL in .env to:
   DATABASE_URL="file:./dev.db"

6. USE PRODUCTION MODE:
   Run: node scripts/db.js migrateDeploy

For more help, see: https://pris.ly/d/migrate-shadow
    `);
  },
};

const help = () => {
  console.log(`
Database Management Script

Usage: node scripts/db.js <command>

Commands:
  migrate         Run database migrations
  migrateNoShadow Run migrations without shadow database validation
  migrateDeploy   Deploy migrations (production mode)
  dbPush          Push schema to database (no migrations)
  reset           Reset database (WARNING: This will delete all data)
  seed            Seed database with sample data
  generate        Generate Prisma client
  health          Check database health
  studio          Open Prisma Studio
  format          Format Prisma schema
  validate        Validate Prisma schema
  deploy          Deploy database schema to production
  status          Check migration status
  resetAndSeed    Reset database and seed with sample data
  migrateAndSeed  Run migrations and seed database
  fullSetup       Complete setup (generate, migrate, seed)
  setupNoShadow   Setup without shadow database validation
  setupPush       Setup using db push (no migrations)
  troubleshoot    Show shadow database troubleshooting guide
  help            Show this help message

Examples:
  node scripts/db.js migrate
  node scripts/db.js migrateNoShadow
  node scripts/db.js setupNoShadow
  node scripts/db.js troubleshoot
  `);
};

const main = async () => {
  const command = process.argv[2];

  if (!command || command === "help") {
    help();
    return;
  }

  if (!commands[command]) {
    console.error(`❌ Unknown command: ${command}`);
    console.log('Run "node scripts/db.js help" for available commands');
    process.exit(1);
  }

  try {
    await commands[command]();
  } catch (error) {
    console.error(`❌ Error executing command "${command}":`, error.message);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Operation cancelled by user");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Operation terminated");
  process.exit(0);
});

// Run the script
if (require.main === module) {
  main();
}
