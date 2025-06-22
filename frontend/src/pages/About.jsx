const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          About Fullstack Boilerplate
        </h1>
        <p className="text-xl text-gray-600">
          A modern, production-ready full-stack application
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              What is this?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Fullstack Boilerplate is a comprehensive starter template for
              building modern web applications. It combines the power of
              Express.js backend with a React frontend, providing everything you
              need to get started quickly and scale efficiently.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Key Features
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                JWT-based authentication with refresh tokens
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Role-based access control (RBAC)
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Prisma ORM with multiple database support
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Comprehensive error handling and logging
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Security middleware (CORS, rate limiting, helmet)
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Modern React with hooks and context
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Responsive design with Tailwind CSS
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Production-ready deployment configuration
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Technology Stack
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Backend</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Express.js - Web framework</li>
                  <li>• Prisma - Database ORM</li>
                  <li>• JWT - Authentication</li>
                  <li>• bcryptjs - Password hashing</li>
                  <li>• Helmet - Security headers</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Frontend</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• React 18 - UI library</li>
                  <li>• Vite - Build tool</li>
                  <li>• React Router - Navigation</li>
                  <li>• Tailwind CSS - Styling</li>
                  <li>• Axios - HTTP client</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Database</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• PostgreSQL (recommended)</li>
                  <li>• MySQL</li>
                  <li>• SQLite (development)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Getting Started
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                To get started with this boilerplate, follow these simple steps:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Clone the repository</li>
                <li>
                  Install dependencies with{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    npm run install:all
                  </code>
                </li>
                <li>Set up your environment variables</li>
                <li>Configure your database</li>
                <li>
                  Run{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    npm run db:setup
                  </code>
                </li>
                <li>
                  Start development with{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    npm run dev
                  </code>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready to build something amazing?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            This boilerplate provides a solid foundation for your next project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/your-username/fullstack-boilerplate"
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white text-blue-600 hover:bg-gray-100"
            >
              View on GitHub
            </a>
            <a
              href="/dashboard"
              className="btn bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              Try Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
