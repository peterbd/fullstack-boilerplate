# Fullstack Boilerplate

A modern, production-ready full-stack application boilerplate built with Express.js backend and React frontend using Vite.

## 🚀 Features

- **Backend**: Express.js with security middleware, rate limiting, and CORS
- **Frontend**: React 18 with Vite for fast development
- **Database**: Prisma ORM with PostgreSQL, MySQL, or SQLite support
- **Modern UI**: Clean, responsive design with smooth animations
- **API Integration**: Ready-to-use REST API endpoints
- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control and resource ownership
- **Standardized Responses**: Consistent API response format
- **Error Handling**: Comprehensive error handling with detailed debugging
- **Development**: Hot reload, proxy configuration, and concurrent development
- **Production Ready**: Optimized builds and deployment configuration

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Database (PostgreSQL, MySQL, or SQLite)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd fullstack-boilerplate
   ```

2. **Install all dependencies**

   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   ```bash
   # Copy the example environment file
   cp backend/env.example backend/.env
   ```

4. **Configure database**

   Edit `backend/.env` and set your `DATABASE_URL`:

   ```bash
   # PostgreSQL (recommended)
   DATABASE_URL="postgresql://username:password@localhost:5432/fullstack_boilerplate?schema=public"

   # SQLite (for development)
   DATABASE_URL="file:./dev.db"

   # MySQL
   DATABASE_URL="mysql://username:password@localhost:3306/fullstack_boilerplate"
   ```

5. **Set up database**

   ```bash
   # Quick setup (generate client, run migrations, seed data)
   npm run db:setup

   # Or run individual commands:
   npm run db:generate  # Generate Prisma client
   npm run db:migrate   # Run database migrations
   npm run db:seed      # Seed with sample data
   ```

6. **Start development servers**
   ```bash
   npm run dev
   ```

## 🎯 Available Scripts

### Root Level

- `npm run dev` - Start both backend and frontend in development mode
- `npm run dev:backend` - Start only the backend server
- `npm run dev:frontend` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm run install:all` - Install dependencies for all packages
- `npm start` - Start the production backend server

### Backend

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Database Management

- `npm run db:setup` - Complete database setup (generate, migrate, seed)
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database (WARNING: deletes all data)
- `npm run db:health` - Check database health
- `npm run db:studio` - Open Prisma Studio
- `npm run db:format` - Format Prisma schema
- `npm run db:validate` - Validate Prisma schema
- `npm run db:deploy` - Deploy migrations to production
- `npm run db:status` - Check migration status

### Frontend

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000
- **Prisma Studio**: http://localhost:5555 (when running `npm run db:studio`)

## 📁 Project Structure

```
fullstack-boilerplate/
├── backend/                 # Express.js server
│   ├── prisma/             # Database schema and migrations
│   │   ├── schema.prisma   # Prisma schema definition
│   │   ├── migrations/     # Database migration files
│   │   └── README.md       # Prisma documentation
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   │   ├── auth.js         # Auth middleware functions
│   │   └── README.md       # Middleware documentation
│   ├── utils/              # Utility functions
│   │   ├── response.js     # Standardized API responses
│   │   ├── jwt.js          # JWT authentication utilities
│   │   ├── prisma.js       # Prisma database utilities
│   │   ├── errorHandler.js # Error handling system
│   │   └── README.md       # Utilities documentation
│   ├── scripts/            # Database management scripts
│   │   └── db.js           # Database operations script
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── env.example         # Environment variables template
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── package.json            # Root package.json
└── README.md              # This file
```

## 🗄️ Database Schema

The application includes a comprehensive database schema with the following models:

- **User** - User accounts with roles and authentication
- **Profile** - Extended user profile information
- **Post** - Blog posts with publishing controls
- **Comment** - Nested comments on posts
- **Tag** - Categorization tags for posts
- **Like** - User likes on posts
- **Session** - User session management
- **ApiKey** - API key management
- **AuditLog** - Activity logging and audit trails

## 🔧 API Endpoints

### Health Check

- `GET /api/health` - Check API and database status
- `GET /api/health/detailed` - Detailed health information
- `GET /api/health/ready` - Readiness check for load balancers
- `GET /api/health/live` - Liveness check for Kubernetes
- `GET /api/health/database` - Database-specific health check

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout-all` - Logout all sessions

### Users

- `GET /api/users` - Get all users (with pagination and search)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats/overview` - Get user statistics

### Protected Routes (Examples)

- `GET /api/protected/public` - Public posts (no auth required)
- `GET /api/protected/optional` - Optional authentication
- `GET /api/protected/profile` - User profile (auth required)
- `GET /api/protected/admin` - Admin dashboard (admin role required)
- `GET /api/protected/posts/:id` - User's own posts or admin access
- `GET /api/protected/api-data` - API key protected
- `GET /api/protected/rate-limited` - Rate limited endpoint
- `GET /api/protected/test-error` - Error handling test endpoint

## 🎨 Frontend Pages

- **Home** (`/`) - Welcome page with API status
- **Users** (`/users`) - User management with CRUD operations
- **About** (`/about`) - Project information and documentation

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection against abuse
- **JWT Authentication** - Token-based authentication
- **Role-based Authorization** - Access control based on user roles
- **Resource Ownership** - Users can only access their own resources
- **API Key Authentication** - Alternative authentication method
- **Input Validation** - Request validation
- **Error Handling** - Proper error responses
- **Audit Logging** - Database activity tracking

## 🛠️ Backend Utilities

### Response Utilities

Standardized API response functions for consistent formatting:

```javascript
const { successResponse, errorResponse } = require("./utils/response");

// Success response
return successResponse(res, data, "Operation successful");

// Error response
return errorResponse(res, "Something went wrong", 500);
```

### JWT Utilities

Authentication and authorization utilities:

```javascript
const { generateAccessToken, verifyToken } = require("./utils/jwt");

// Generate token
const token = generateAccessToken({ userId: 1, email: "user@example.com" });

// Verify token
const decoded = verifyToken(token);
```

### Prisma Database Utilities

Comprehensive database utilities with Prisma:

```javascript
const {
  getPrisma,
  createPagination,
  createSearchConditions,
  excludePassword,
  transaction,
} = require("./utils/prisma");

// Get Prisma client
const prisma = getPrisma();

// Paginated search
const users = await prisma.user.findMany({
  where: createSearchConditions("john", ["name", "email"]),
  ...createPagination(1, 10),
});

// Database transaction
const result = await transaction(async (tx) => {
  // Your transaction code
});

// Remove password from user
const userWithoutPassword = excludePassword(user);
```

### Authentication Middleware

Comprehensive middleware for protecting routes:

```javascript
const {
  requireAuth,
  requireRoles,
  requireOwnerOrAdmin,
} = require("./middleware/auth");

// Basic authentication
router.get("/profile", requireAuth, (req, res) => {
  // req.user contains decoded token
});

// Role-based authorization
router.get("/admin", requireAuth, requireRoles(["admin"]), (req, res) => {
  // Admin only access
});

// Resource ownership
router.put(
  "/posts/:id",
  requireAuth,
  requireOwnerOrAdmin((req) => getPostOwner(req.params.id)),
  (req, res) => {
    // User can update their own posts, admin can update any
  }
);
```

### Error Handling System

Comprehensive error handling with detailed debugging:

```javascript
const {
  asyncHandler,
  NotFoundError,
  ValidationError,
} = require("./utils/errorHandler");

// Async route with automatic error handling
router.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const user = await getUserById(req.params.id);

    if (!user) {
      throw new NotFoundError("User");
    }

    return successResponse(res, user);
  })
);

// Validation with custom errors
if (!email || !password) {
  throw new ValidationError("Email and password are required");
}
```

See `backend/middleware/README.md`, `backend/utils/README.md`, and `backend/prisma/README.md` for complete documentation.

## 🗄️ Database Management

### Quick Setup

```bash
# Complete database setup
npm run db:setup
```

### Individual Operations

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Check health
npm run db:health

# Open Prisma Studio
npm run db:studio
```

### Advanced Operations

```bash
# Use the database management script
node scripts/db.js help

# Reset and seed
node scripts/db.js resetAndSeed

# Full setup
node scripts/db.js fullSetup
```

## 🚀 Deployment

### Backend Deployment

1. Set environment variables for production
2. Run database migrations: `npm run db:deploy`
3. Generate Prisma client: `npm run db:generate`
4. Run `npm start` to start the production server
5. Use a process manager like PM2 for production

### Frontend Deployment

1. Run `npm run build` to create optimized build
2. Deploy the `dist` folder to your hosting service
3. Configure your hosting service to serve the React app

### Database Deployment

1. Set up production database (PostgreSQL recommended)
2. Configure `DATABASE_URL` in production environment
3. Run migrations: `npm run db:deploy`
4. Seed production data if needed: `npm run db:seed`

## 🛠️ Customization

### Adding New Database Models

1. Edit `backend/prisma/schema.prisma`
2. Create migration: `npm run db:migrate`
3. Update utilities as needed

### Adding New API Routes

1. Create a new route file in `backend/routes/`
2. Import and use the route in `backend/server.js`
3. Use response utilities for consistent formatting
4. Apply appropriate middleware for authentication/authorization

### Adding New Frontend Pages

1. Create a new page component in `frontend/src/pages/`
2. Add the route in `frontend/src/App.jsx`

### Environment Variables

- Copy `backend/env.example` to `backend/.env`
- Add your configuration variables
- Set a strong `JWT_SECRET` for production
- Configure `DATABASE_URL` for your database
- Configure `API_KEY` for API key authentication

## 📚 Technologies Used

### Backend

- **Express.js** - Web framework
- **Node.js** - JavaScript runtime
- **Prisma** - Database ORM and migration tool
- **PostgreSQL/MySQL/SQLite** - Database options
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Express Rate Limit** - Rate limiting
- **JSON Web Tokens** - Authentication

### Frontend

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Development

- **Nodemon** - Auto-restart server
- **Concurrently** - Run multiple commands
- **ESLint** - Code linting
- **Prisma Studio** - Database GUI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.
