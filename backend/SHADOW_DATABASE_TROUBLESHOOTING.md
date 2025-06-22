# Shadow Database Troubleshooting Guide

## The Problem

You're encountering this error:

```
Error: P3014
Prisma Migrate could not create the shadow database. Please make sure the database user has permission to create databases.
```

This happens because Prisma uses a shadow database during migrations to validate schema changes, but your database user doesn't have permission to create databases.

## Solutions (in order of preference)

### 1. Grant Database Permissions (Recommended)

Connect to your PostgreSQL database as a superuser (like `postgres`) and grant the necessary permissions:

```sql
-- Grant CREATE permission on the database
GRANT CREATE ON DATABASE fullstack_boilerplate TO your_username;

-- Or grant all privileges (more permissive)
GRANT ALL PRIVILEGES ON DATABASE fullstack_boilerplate TO your_username;

-- If you want to grant permissions on all future databases too
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO your_username;
```

### 2. Use a Dedicated Shadow Database

1. Create a shadow database:

   ```sql
   CREATE DATABASE fullstack_boilerplate_shadow;
   ```

2. Add the shadow database URL to your `.env` file:

   ```bash
   SHADOW_DATABASE_URL="postgresql://username:password@localhost:5432/fullstack_boilerplate_shadow?schema=public"
   ```

3. Run migrations normally:
   ```bash
   npm run db:migrate
   ```

### 3. Skip Shadow Database Validation (Quick Fix)

Use the `--skip-shadow-database-url-validation` flag:

```bash
# Using npm script
npm run db:migrate-no-shadow

# Or directly
npx prisma migrate dev --skip-shadow-database-url-validation
```

### 4. Use Database Push (Development Only)

For development, you can use `db push` instead of migrations:

```bash
# Using npm script
npm run db:push

# Or directly
npx prisma db push
```

⚠️ **Warning**: This will overwrite your database schema and is not suitable for production.

### 5. Switch to SQLite (Quick Development)

For quick development, switch to SQLite which doesn't have shadow database issues:

1. Update your `.env` file:

   ```bash
   DATABASE_URL="file:./dev.db"
   ```

2. Run setup:
   ```bash
   npm run db:setup
   ```

### 6. Use Production Migration Mode

For production deployments, use `migrate deploy`:

```bash
# Using npm script
npm run db:migrate-deploy

# Or directly
npx prisma migrate deploy
```

## Quick Setup Commands

### For Development (with shadow database issues):

```bash
# Option 1: Skip shadow validation
npm run db:setup-no-shadow

# Option 2: Use db push
npm run db:setup-push

# Option 3: Switch to SQLite
# Edit .env to use: DATABASE_URL="file:./dev.db"
npm run db:setup
```

### For Production:

```bash
# Deploy existing migrations
npm run db:migrate-deploy

# Generate client
npm run db:generate

# Seed if needed
npm run db:seed
```

## Database-Specific Solutions

### PostgreSQL

1. **Grant permissions as superuser:**

   ```bash
   sudo -u postgres psql
   ```

   ```sql
   GRANT CREATE ON DATABASE fullstack_boilerplate TO your_username;
   ```

2. **Create shadow database:**
   ```sql
   CREATE DATABASE fullstack_boilerplate_shadow;
   GRANT ALL PRIVILEGES ON DATABASE fullstack_boilerplate_shadow TO your_username;
   ```

### MySQL

1. **Grant permissions:**

   ```sql
   GRANT CREATE ON *.* TO 'your_username'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **Create shadow database:**
   ```sql
   CREATE DATABASE fullstack_boilerplate_shadow;
   GRANT ALL PRIVILEGES ON fullstack_boilerplate_shadow.* TO 'your_username'@'localhost';
   ```

### SQLite

SQLite doesn't have shadow database issues, so switching to SQLite is often the quickest solution for development:

```bash
# In your .env file
DATABASE_URL="file:./dev.db"
```

## Environment Configuration

### Complete `.env` Example

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API Key
API_KEY=your-api-key-here

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/fullstack_boilerplate?schema=public"

# Shadow Database URL (optional)
SHADOW_DATABASE_URL="postgresql://username:password@localhost:5432/fullstack_boilerplate_shadow?schema=public"

# For SQLite development
# DATABASE_URL="file:./dev.db"

# Database Pool Configuration
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Prisma Configuration
PRISMA_LOG_LEVEL=info
PRISMA_CLIENT_ENGINE_TYPE=binary
```

## Troubleshooting Commands

```bash
# Check database health
npm run db:health

# Validate schema
npm run db:validate

# Format schema
npm run db:format

# Check migration status
npm run db:status

# Show troubleshooting guide
npm run db:troubleshoot
```

## Common Issues and Solutions

### Issue: "Database does not exist"

**Solution:**

```sql
CREATE DATABASE fullstack_boilerplate;
```

### Issue: "Permission denied"

**Solution:**

```sql
GRANT ALL PRIVILEGES ON DATABASE fullstack_boilerplate TO your_username;
```

### Issue: "Connection refused"

**Solution:**

- Check if PostgreSQL is running: `sudo systemctl status postgresql`
- Start PostgreSQL: `sudo systemctl start postgresql`
- Check connection settings in `.env`

### Issue: "Schema does not exist"

**Solution:**

```sql
CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL ON SCHEMA public TO your_username;
```

## Production Considerations

1. **Never use `db push` in production**
2. **Always use `migrate deploy` for production**
3. **Set up proper database permissions**
4. **Use connection pooling for better performance**
5. **Backup your database before migrations**

## Additional Resources

- [Prisma Shadow Database Documentation](https://pris.ly/d/migrate-shadow)
- [Prisma Migration Guide](https://pris.ly/d/migrate)
- [PostgreSQL Permissions](https://www.postgresql.org/docs/current/sql-grant.html)
- [MySQL Permissions](https://dev.mysql.com/doc/refman/8.0/en/grant.html)

## Getting Help

If you're still having issues:

1. Run the troubleshooting command: `npm run db:troubleshoot`
2. Check the Prisma documentation
3. Verify your database connection
4. Ensure your database user has the necessary permissions
5. Consider switching to SQLite for development
