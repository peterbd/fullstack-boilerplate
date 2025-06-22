# Prisma Database Integration

This directory contains the Prisma schema and database configuration for the fullstack boilerplate.

## Overview

Prisma is a modern database toolkit for Node.js and TypeScript. It consists of:

- **Prisma Client**: Auto-generated and type-safe query builder
- **Prisma Migrate**: Database migration tool
- **Prisma Studio**: GUI to view and edit data

## Database Schema

### Models

#### User

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  roles     Role[]   @default([USER])
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  posts     Post[]
  comments  Comment[]
  sessions  Session[]
  profile   Profile?
}
```

#### Profile

```prisma
model Profile {
  id          Int      @id @default(autoincrement())
  userId      Int      @unique
  bio         String?
  avatar      String?
  website     String?
  location    String?
  birthDate   DateTime?
  phone       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### Post

```prisma
model Post {
  id           Int       @id @default(autoincrement())
  title        String
  content      String
  slug         String    @unique
  isPublic     Boolean   @default(false)
  isPublished  Boolean   @default(false)
  publishedAt  DateTime?
  authorId     Int
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  // Relations
  author       User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments     Comment[]
  tags         Tag[]
  likes        Like[]
}
```

#### Comment

```prisma
model Comment {
  id          Int       @id @default(autoincrement())
  content     String
  authorId    Int
  postId      Int
  parentId    Int?
  isApproved  Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  author      User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  post        Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  parent      Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies     Comment[] @relation("CommentReplies")
}
```

#### Tag

```prisma
model Tag {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  slug      String   @unique
  color     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  posts     Post[]
}
```

#### Like

```prisma
model Like {
  id        Int      @id @default(autoincrement())
  userId    Int
  postId    Int
  createdAt DateTime @default(now())

  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([userId, postId])
}
```

#### Session

```prisma
model Session {
  id           Int      @id @default(autoincrement())
  userId       Int
  refreshToken String   @unique
  expiresAt    DateTime
  userAgent    String?
  ipAddress    String?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### ApiKey

```prisma
model ApiKey {
  id          Int       @id @default(autoincrement())
  name        String
  key         String    @unique
  permissions String[]  // JSON array of permissions
  isActive    Boolean   @default(true)
  expiresAt   DateTime?
  lastUsedAt  DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

#### AuditLog

```prisma
model AuditLog {
  id        Int      @id @default(autoincrement())
  action    String   // CREATE, UPDATE, DELETE, LOGIN, etc.
  entity    String   // User, Post, etc.
  entityId  Int?
  userId    Int?
  details   Json?    // Additional details about the action
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
}
```

### Enums

```prisma
enum Role {
  USER
  ADMIN
  MODERATOR
  EDITOR
}
```

## Database Setup

### 1. Environment Configuration

Copy the environment file and configure your database:

```bash
cp env.example .env
```

Update the `DATABASE_URL` in your `.env` file:

```bash
# PostgreSQL (recommended)
DATABASE_URL="postgresql://username:password@localhost:5432/fullstack_boilerplate?schema=public"

# SQLite (for development)
DATABASE_URL="file:./dev.db"

# MySQL
DATABASE_URL="mysql://username:password@localhost:3306/fullstack_boilerplate"
```

### 2. Database Setup Commands

#### Quick Setup

```bash
npm run db:setup
```

This command will:

- Generate Prisma client
- Run migrations
- Seed the database

#### Individual Commands

**Generate Prisma Client:**

```bash
npm run db:generate
# or
npx prisma generate
```

**Run Migrations:**

```bash
npm run db:migrate
# or
npx prisma migrate dev
```

**Seed Database:**

```bash
npm run db:seed
# or
npx prisma db seed
```

**Reset Database:**

```bash
npm run db:reset
# or
npx prisma migrate reset --force
```

**Check Database Health:**

```bash
npm run db:health
```

**Open Prisma Studio:**

```bash
npm run db:studio
# or
npx prisma studio
```

### 3. Database Management Script

Use the custom database management script for advanced operations:

```bash
# Show all available commands
node scripts/db.js help

# Full setup (generate, migrate, seed)
node scripts/db.js fullSetup

# Reset and seed
node scripts/db.js resetAndSeed

# Check health
node scripts/db.js health
```

## Prisma Utilities

The `utils/prisma.js` file provides comprehensive database utilities:

### Core Functions

```javascript
const {
  getPrisma,
  initializePrisma,
  disconnectPrisma,
  healthCheck,
  transaction,
} = require("./utils/prisma");

// Get Prisma client instance
const prisma = getPrisma();

// Health check
const health = await healthCheck();

// Database transaction
const result = await transaction(async (tx) => {
  // Your transaction code here
});
```

### Query Helpers

```javascript
const {
  createPagination,
  createSearchConditions,
  createOrderBy,
  createFilters,
  createInclude,
  createSelect,
} = require("./utils/prisma");

// Pagination
const pagination = createPagination(1, 10);

// Search
const search = createSearchConditions("john", ["name", "email"]);

// Order by
const orderBy = createOrderBy("createdAt", "desc");

// Filters
const filters = createFilters({ isActive: true, role: "USER" });

// Include relations
const include = createInclude(["profile", "posts"]);

// Select fields
const select = createSelect(["id", "name", "email"]);
```

### Data Helpers

```javascript
const {
  excludePassword,
  excludePasswords,
  softDelete,
} = require("./utils/prisma");

// Remove password from user object
const userWithoutPassword = excludePassword(user);

// Remove passwords from array
const usersWithoutPasswords = excludePasswords(users);

// Soft delete
await softDelete("user", userId, currentUserId);
```

### Audit Logging

```javascript
const { createAuditLog, dbQuery } = require("./utils/prisma");

// Create audit log
await createAuditLog("CREATE", "User", userId, currentUserId, details, req);

// Database query with audit
const result = await dbQuery(() => prisma.user.create({ data: userData }), {
  audit: true,
  action: "CREATE",
  entity: "User",
  userId: currentUserId,
  req,
});
```

## Usage Examples

### Basic CRUD Operations

```javascript
const { getPrisma, excludePassword } = require("./utils/prisma");

const prisma = getPrisma();

// Create user
const user = await prisma.user.create({
  data: {
    email: "user@example.com",
    password: "hashedPassword",
    name: "John Doe",
    roles: ["USER"],
  },
});

// Find user with profile
const userWithProfile = await prisma.user.findUnique({
  where: { id: userId },
  include: { profile: true },
});

// Update user
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: { name: "Jane Doe" },
});

// Delete user
await prisma.user.delete({
  where: { id: userId },
});
```

### Advanced Queries

```javascript
// Paginated search with filters
const users = await prisma.user.findMany({
  where: {
    AND: [
      createSearchConditions(searchTerm, ["name", "email"]),
      createFilters({ isActive: true, roles: { has: "USER" } }),
    ],
  },
  include: createInclude(["profile"]),
  orderBy: createOrderBy("createdAt", "desc"),
  ...createPagination(page, limit),
});

// Complex relations
const posts = await prisma.post.findMany({
  where: { isPublished: true },
  include: {
    author: {
      select: { id: true, name: true, email: true },
    },
    tags: true,
    comments: {
      where: { isApproved: true },
      include: { author: { select: { name: true } } },
    },
    _count: {
      select: { likes: true, comments: true },
    },
  },
});
```

### Transactions

```javascript
const { transaction } = require("./utils/prisma");

const result = await transaction(async (tx) => {
  // Create user
  const user = await tx.user.create({
    data: userData,
  });

  // Create profile
  const profile = await tx.profile.create({
    data: {
      userId: user.id,
      bio: "New user",
    },
  });

  // Create audit log
  await tx.auditLog.create({
    data: {
      action: "CREATE",
      entity: "User",
      entityId: user.id,
      userId: user.id,
    },
  });

  return { user, profile };
});
```

## Database Migrations

### Creating Migrations

```bash
# Create a new migration
npx prisma migrate dev --name add_user_profile

# Apply migrations to production
npx prisma migrate deploy
```

### Migration Files

Migrations are stored in `prisma/migrations/` and contain SQL files that modify the database schema.

### Seeding

The database is seeded with sample data using the `scripts/db.js` script:

- Admin user: `admin@example.com` / `admin123`
- Regular user: `user@example.com` / `user123`
- Sample posts and tags

## Best Practices

### 1. Connection Management

- Use the singleton pattern for Prisma client
- Always disconnect on application shutdown
- Use connection pooling in production

### 2. Error Handling

- Use the `handleDatabaseError` utility
- Wrap database operations in try-catch blocks
- Use transactions for related operations

### 3. Performance

- Use `select` to limit returned fields
- Use `include` sparingly to avoid N+1 queries
- Implement proper indexing in the schema

### 4. Security

- Never expose database credentials
- Use environment variables for configuration
- Implement proper input validation

### 5. Development

- Use Prisma Studio for data exploration
- Keep migrations small and focused
- Test migrations before deploying

## Troubleshooting

### Common Issues

1. **Connection Failed**

   - Check `DATABASE_URL` in `.env`
   - Verify database server is running
   - Check network connectivity

2. **Migration Errors**

   - Reset database: `npm run db:reset`
   - Check migration files for conflicts
   - Verify schema syntax

3. **Client Generation Issues**
   - Run `npm run db:generate`
   - Check Prisma schema syntax
   - Clear node_modules and reinstall

### Debug Commands

```bash
# Check database health
npm run db:health

# Validate schema
npm run db:validate

# Format schema
npm run db:format

# Check migration status
npm run db:status
```

## Production Deployment

### 1. Environment Setup

```bash
# Set production environment
NODE_ENV=production

# Use production database URL
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"
```

### 2. Database Migration

```bash
# Deploy migrations
npm run db:deploy

# Generate client
npm run db:generate
```

### 3. Connection Pooling

For production, consider using connection pooling:

```bash
# Install connection pooling
npm install @prisma/pool
```

Update your Prisma client configuration for connection pooling.

## Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Database Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
