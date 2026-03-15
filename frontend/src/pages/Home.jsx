import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home">
      {/* Navbar */}
      {/* <nav className="navbar">
        <div className="logo">🎓 Student Records</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/login" className="login-btn">Login</Link>
        </div>
      </nav> */}

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1>Student Record Management System</h1>
          <p>
            A smart and efficient way to manage student records,
            academic details, and administrative operations.
          </p>

          <Link to="/login">
            <button className="get-started-btn">Get Started</button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <section className="features">
        <h2>Key Features</h2>

        <div className="feature-cards">
          <div className="feature-card">
            <h3>📊 Admin Dashboard</h3>
            <p>Manage students, track records, and control system access.</p>
          </div>

          <div className="feature-card">
            <h3>👨‍🎓 Student Dashboard</h3>
            <p>View academic records, performance metrics, and profile data.</p>
          </div>

          <div className="feature-card">
            <h3>🔒 Secure Login</h3>
            <p>Role-based authentication for Admin and Students.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Student Record Management System | Developed by Yallaiah</p>
      </footer>
    </div>
  );
};

export default Home;