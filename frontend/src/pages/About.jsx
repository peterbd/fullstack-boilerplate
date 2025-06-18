import "./About.css";

function About() {
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>About This Project</h1>
        <p className="about-subtitle">
          A modern full-stack boilerplate built with best practices and
          production-ready features
        </p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h2>🚀 What is this?</h2>
          <p>
            This is a comprehensive full-stack boilerplate that provides a solid
            foundation for building modern web applications. It includes both
            backend and frontend with all the essential features you need to get
            started quickly.
          </p>
        </div>

        <div className="about-section">
          <h2>🛠️ Technology Stack</h2>
          <div className="tech-grid">
            <div className="tech-category">
              <h3>Backend</h3>
              <ul>
                <li>
                  <strong>Express.js</strong> - Fast, unopinionated web
                  framework
                </li>
                <li>
                  <strong>Node.js</strong> - JavaScript runtime
                </li>
                <li>
                  <strong>Helmet</strong> - Security middleware
                </li>
                <li>
                  <strong>CORS</strong> - Cross-origin resource sharing
                </li>
                <li>
                  <strong>Morgan</strong> - HTTP request logger
                </li>
                <li>
                  <strong>Rate Limiting</strong> - API protection
                </li>
              </ul>
            </div>

            <div className="tech-category">
              <h3>Frontend</h3>
              <ul>
                <li>
                  <strong>React 18</strong> - UI library
                </li>
                <li>
                  <strong>Vite</strong> - Build tool and dev server
                </li>
                <li>
                  <strong>React Router</strong> - Client-side routing
                </li>
                <li>
                  <strong>Axios</strong> - HTTP client
                </li>
                <li>
                  <strong>CSS3</strong> - Modern styling
                </li>
                <li>
                  <strong>Responsive Design</strong> - Mobile-first approach
                </li>
              </ul>
            </div>

            <div className="tech-category">
              <h3>Development</h3>
              <ul>
                <li>
                  <strong>ESLint</strong> - Code linting
                </li>
                <li>
                  <strong>Nodemon</strong> - Auto-restart server
                </li>
                <li>
                  <strong>Concurrently</strong> - Run multiple commands
                </li>
                <li>
                  <strong>Hot Reload</strong> - Fast development
                </li>
                <li>
                  <strong>Proxy</strong> - API forwarding
                </li>
                <li>
                  <strong>Source Maps</strong> - Debug support
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>✨ Features</h2>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <div>
                <h4>Security First</h4>
                <p>
                  Built-in security middleware, CORS protection, and rate
                  limiting
                </p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <div>
                <h4>Fast Development</h4>
                <p>
                  Vite provides instant hot module replacement and
                  lightning-fast builds
                </p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <div>
                <h4>Responsive Design</h4>
                <p>
                  Mobile-first approach with modern CSS and flexible layouts
                </p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🔄</span>
              <div>
                <h4>API Integration</h4>
                <p>Ready-to-use API endpoints with proper error handling</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🎨</span>
              <div>
                <h4>Modern UI</h4>
                <p>Clean, professional design with smooth animations</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">📦</span>
              <div>
                <h4>Production Ready</h4>
                <p>
                  Optimized builds, environment configuration, and deployment
                  ready
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>🚀 Getting Started</h2>
          <div className="getting-started-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div>
                <h4>Install Dependencies</h4>
                <p>
                  Run <code>npm run install:all</code> to install all
                  dependencies
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div>
                <h4>Start Development</h4>
                <p>
                  Run <code>npm run dev</code> to start both servers
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div>
                <h4>Build for Production</h4>
                <p>
                  Run <code>npm run build</code> to create optimized builds
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>📚 Next Steps</h2>
          <p>This boilerplate provides a solid foundation. Consider adding:</p>
          <ul className="next-steps-list">
            <li>Database integration (MongoDB, PostgreSQL, etc.)</li>
            <li>Authentication and authorization</li>
            <li>File upload functionality</li>
            <li>Testing setup (Jest, React Testing Library)</li>
            <li>State management (Redux, Zustand)</li>
            <li>TypeScript support</li>
            <li>Docker configuration</li>
            <li>CI/CD pipeline</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default About;
