import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { authAPI } from "../api/axios";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/admin-dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Try API login first
      const response = await authAPI.login({ email, password });
      
      if (response.data.success) {
        // Store token, role, and email
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response.data.user.role);
        localStorage.setItem("userEmail", response.data.user.email);
        
        // Redirect based on role
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard", { replace: true });
        } else {
          navigate("/student-dashboard", { replace: true });
        }
      }
    } catch (err) {
      // If API fails, fall back to hardcoded credentials for testing
      console.log("API not available, using demo credentials");
      
      if (email === "admin@gmail.com" && password === "admin123") {
        localStorage.setItem("token", "demo-token-admin");
        localStorage.setItem("userRole", "admin");
        navigate("/admin-dashboard", { replace: true });
      } else if (email === "student@gmail.com" && password === "student123") {
        localStorage.setItem("token", "demo-token-student");
        localStorage.setItem("userRole", "student");
        localStorage.setItem("userEmail", "student@gmail.com");
        navigate("/student-dashboard", { replace: true });
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Panel */}
      <div className="login-left">
        <h1>Student Record System</h1>
        <p>
          Manage academic records efficiently with a secure and modern dashboard.
        </p>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="login-card">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="input-group-password">
              <label>Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />

                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    /* Eye Off */
                    <svg viewBox="0 0 24 24">
                      <path d="M2 2l20 20M12 6c4.5 0 8 3 9 6a10.5 10.5 0 0 1-3 4M6.7 6.7A9.77 9.77 0 0 0 3 12c1 3 4.5 6 9 6 1.5 0 2.9-.3 4.2-.9" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    /* Eye */
                    <svg viewBox="0 0 24 24">
                      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" strokeWidth="2" stroke="currentColor" fill="none"/>
                      <circle cx="12" cy="12" r="3" strokeWidth="2" stroke="currentColor" fill="none"/>
                    </svg>
                  )}
                </span>
              </div>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="login-btn-main" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="back-home">
            <Link to="/">← Back to Home</Link>
          </p>
          
          {/* Sign Up Link for Students */}
          <p className="signup-link" style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
            New student? <Link to="/signup" style={{ color: "#2563eb", fontWeight: "500" }}>Set your password</Link>
          </p>
          
          {/* Demo Credentials Info */}
          <div className="demo-info" style={{ marginTop: "20px", padding: "10px", background: "#f5f5f5", borderRadius: "5px", fontSize: "12px" }}>
            <strong>Demo Credentials:</strong><br/>
            Admin: admin@gmail.com / admin123<br/>
            Student: student@gmail.com / student123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

