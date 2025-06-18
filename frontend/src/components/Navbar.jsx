import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🚀</span>
          Fullstack Boilerplate
        </Link>

        <div className="navbar-menu">
          <Link
            to="/"
            className={`navbar-link ${isActive("/") ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/users"
            className={`navbar-link ${isActive("/users") ? "active" : ""}`}
          >
            Users
          </Link>
          <Link
            to="/about"
            className={`navbar-link ${isActive("/about") ? "active" : ""}`}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
