# Fullstack Boilerplate

A modern, production-ready full-stack application boilerplate built with Express.js backend and React frontend using Vite.

## 🚀 Features

- **Backend**: Express.js with security middleware, rate limiting, and CORS
- **Frontend**: React 18 with Vite for fast development
- **Modern UI**: Clean, responsive design with smooth animations
- **API Integration**: Ready-to-use REST API endpoints
- **Development**: Hot reload, proxy configuration, and concurrent development
- **Production Ready**: Optimized builds and deployment configuration

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

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

4. **Start development servers**
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

### Frontend

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000

## 📁 Project Structure

```
fullstack-boilerplate/
├── backend/                 # Express.js server
│   ├── routes/             # API routes
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

## 🔧 API Endpoints

### Health Check

- `GET /api/health` - Check API status

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🎨 Frontend Pages

- **Home** (`/`) - Welcome page with API status
- **Users** (`/users`) - User management with CRUD operations
- **About** (`/about`) - Project information and documentation

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection against abuse
- **Input Validation** - Request validation
- **Error Handling** - Proper error responses

## 🚀 Deployment

### Backend Deployment

1. Set environment variables for production
2. Run `npm start` to start the production server
3. Use a process manager like PM2 for production

### Frontend Deployment

1. Run `npm run build` to create optimized build
2. Deploy the `dist` folder to your hosting service
3. Configure your hosting service to serve the React app

## 🛠️ Customization

### Adding New API Routes

1. Create a new route file in `backend/routes/`
2. Import and use the route in `backend/server.js`

### Adding New Frontend Pages

1. Create a new page component in `frontend/src/pages/`
2. Add the route in `frontend/src/App.jsx`

### Environment Variables

- Copy `backend/env.example` to `backend/.env`
- Add your configuration variables

## 📚 Technologies Used

### Backend

- **Express.js** - Web framework
- **Node.js** - JavaScript runtime
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Express Rate Limit** - Rate limiting

### Frontend

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Development

- **Nodemon** - Auto-restart server
- **Concurrently** - Run multiple commands
- **ESLint** - Code linting

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
