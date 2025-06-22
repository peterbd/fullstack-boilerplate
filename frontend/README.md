# Frontend - Fullstack Boilerplate

A modern React frontend built with Vite, featuring authentication, protected routes, and a beautiful UI that integrates seamlessly with the Express.js backend.

## 🚀 Features

- **React 18** with modern hooks and functional components
- **Vite** for lightning-fast development and building
- **React Router** for client-side routing
- **Authentication System** with JWT tokens and refresh tokens
- **Protected Routes** with automatic redirects
- **Form Handling** with React Hook Form and validation
- **Toast Notifications** with React Hot Toast
- **Responsive Design** that works on all devices
- **Modern UI** with smooth animations and gradients
- **API Integration** with Axios and interceptors
- **Error Handling** with comprehensive error states
- **Loading States** with spinners and skeleton screens

## 📦 Dependencies

### Core

- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server

### Authentication & Forms

- **React Hook Form** - Form handling and validation
- **JS Cookie** - Cookie management for tokens
- **React Hot Toast** - Toast notifications

### HTTP Client

- **Axios** - HTTP client with interceptors

## 🛠️ Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp env.example .env
   ```

3. **Configure the API URL:**

   ```bash
   # In .env file
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── AuthForms.css    # Authentication form styles
│   │   ├── LoginForm.jsx    # Login form component
│   │   ├── RegisterForm.jsx # Registration form component
│   │   ├── Navbar.css       # Navigation styles
│   │   ├── Navbar.jsx       # Navigation component
│   │   └── ProtectedRoute.jsx # Route protection component
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx  # Authentication context
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Home page
│   │   ├── Home.css         # Home page styles
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Registration page
│   │   ├── Dashboard.jsx    # Dashboard page
│   │   ├── Dashboard.css    # Dashboard styles
│   │   ├── Users.jsx        # Users management page
│   │   ├── Users.css        # Users page styles
│   │   ├── About.jsx        # About page
│   │   └── About.css        # About page styles
│   ├── utils/               # Utility functions
│   │   └── api.js           # API configuration and helpers
│   ├── App.jsx              # Main app component
│   ├── App.css              # App styles
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
├── env.example              # Environment variables example
├── package.json             # Dependencies and scripts
└── vite.config.js           # Vite configuration
```

## 🔐 Authentication System

### Features

- **JWT Token Management** with automatic refresh
- **Protected Routes** that redirect unauthenticated users
- **Persistent Login** using cookies
- **Role-based Access Control** (RBAC)
- **Automatic Token Refresh** on 401 errors
- **Secure Logout** with token invalidation

### Usage

#### Authentication Context

```jsx
import { useAuth } from "../contexts/AuthContext";

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  // Check if user is logged in
  if (isAuthenticated) {
    console.log("User:", user.name);
  }
};
```

#### Protected Routes

```jsx
import ProtectedRoute from '../components/ProtectedRoute';

// Require authentication
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Redirect if already authenticated
<ProtectedRoute requireAuth={false}>
  <Login />
</ProtectedRoute>
```

## 🌐 API Integration

### API Service

The frontend uses a centralized API service with automatic token management:

```jsx
import { apiService, apiCall } from "../utils/api";

// Make API calls
const result = await apiCall(apiService.users.getAll);
if (result.success) {
  console.log(result.data);
}
```

### Available Endpoints

- **Authentication**: `apiService.auth.*`
- **Users**: `apiService.users.*`
- **Health**: `apiService.health.*`
- **Protected**: `apiService.protected.*`

### Error Handling

- Automatic token refresh on 401 errors
- Toast notifications for errors
- Consistent error response format
- Network error handling

## 🎨 UI Components

### Authentication Forms

- **LoginForm**: Email/password login with validation
- **RegisterForm**: User registration with password confirmation
- **Modern Design**: Gradient backgrounds and smooth animations

### Navigation

- **Responsive Navbar**: Adapts to screen size
- **User Menu**: Shows user info and logout button
- **Dynamic Links**: Changes based on authentication status

### Dashboard

- **User Profile Card**: Shows user information and roles
- **System Health**: Real-time API and database status
- **Protected Content**: Demonstrates authenticated endpoints
- **Quick Actions**: Common user actions

### Users Management

- **Data Table**: Sortable and searchable user list
- **Statistics Cards**: User counts and metrics
- **Action Buttons**: Edit and delete user functionality
- **Responsive Design**: Works on mobile devices

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# From root directory
npm run dev:frontend # Start frontend only
npm run build        # Build frontend
```

## 🔧 Configuration

### Environment Variables

```bash
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Fullstack Boilerplate
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=true
```

### Vite Configuration

- **Hot Module Replacement** for fast development
- **ESBuild** for fast builds
- **CSS Modules** support
- **Environment Variables** with VITE\_ prefix

## 🎯 Routes

### Public Routes

- `/` - Home page with features and system status
- `/about` - About page with project information
- `/login` - Login form (redirects if authenticated)
- `/register` - Registration form (redirects if authenticated)

### Protected Routes

- `/dashboard` - User dashboard with profile and system info
- `/users` - User management interface

## 🔒 Security Features

### Token Management

- **Access Tokens**: Short-lived (1 day) stored in cookies
- **Refresh Tokens**: Long-lived (7 days) for automatic renewal
- **Automatic Refresh**: Handles token expiration seamlessly
- **Secure Storage**: Uses httpOnly cookies (configured on backend)

### Route Protection

- **Authentication Guards**: Prevents access to protected routes
- **Automatic Redirects**: Sends unauthenticated users to login
- **Return URLs**: Remembers where user was trying to go

### Form Security

- **Input Validation**: Client-side validation with React Hook Form
- **Password Requirements**: Enforces strong password policies
- **CSRF Protection**: Handled by backend middleware

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Features

- **Mobile-first** design approach
- **Flexible grids** that adapt to screen size
- **Touch-friendly** buttons and interactions
- **Optimized typography** for all devices

## 🎨 Styling

### Design System

- **Color Palette**: Purple gradient theme (#667eea to #764ba2)
- **Typography**: Clean, modern fonts with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Shadows**: Subtle shadows for depth and elevation

### CSS Features

- **CSS Grid** and **Flexbox** for layouts
- **CSS Custom Properties** for theming
- **Smooth Transitions** and animations
- **Mobile-first** responsive design

## 🧪 Development

### Code Quality

- **ESLint** configuration for code consistency
- **React Hooks** rules enforcement
- **Import/Export** validation
- **Unused variable** detection

### Best Practices

- **Functional Components** with hooks
- **Custom Hooks** for reusable logic
- **Context API** for state management
- **Error Boundaries** for error handling

## 🚀 Deployment

### Build Process

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Deployment Options

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: CloudFlare, AWS CloudFront
- **Server**: Nginx, Apache

### Environment Setup

1. Set `VITE_API_URL` to your production API URL
2. Configure CORS on your backend
3. Set up proper SSL certificates
4. Configure your hosting provider

## 🤝 Contributing

1. Follow the existing code style
2. Use functional components and hooks
3. Add proper error handling
4. Test on multiple devices
5. Update documentation as needed

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Axios Documentation](https://axios-http.com/)

## 🐛 Troubleshooting

### Common Issues

#### API Connection Errors

- Check `VITE_API_URL` in `.env`
- Ensure backend server is running
- Verify CORS configuration

#### Authentication Issues

- Clear browser cookies
- Check token expiration
- Verify JWT secret configuration

#### Build Errors

- Clear `node_modules` and reinstall
- Check for syntax errors
- Verify all imports are correct

### Debug Mode

Set `VITE_ENABLE_DEBUG_MODE=true` in your `.env` file for additional logging.
