import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../api/axios";
import "../styles/Login.css";

const Signup = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate inputs
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.signup({ email, password });
      
      if (response.data.success) {
        setSuccess(response.data.message);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMsg);
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
          Complete your registration to access your student dashboard.
        </p>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="login-card">
          <h2>Student Sign Up</h2>
          <p style={{ marginBottom: "20px", color: "#666", fontSize: "14px" }}>
            Set your password to activate your student account
          </p>

          <form onSubmit={handleSignup}>
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
              <label>New Password</label>

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

            <div className="input-group-password">
              <label>Confirm Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            <button type="submit" className="login-btn-main" disabled={loading}>
              {loading ? "Setting up..." : "Sign Up"}
            </button>
          </form>

          <p className="back-home">
            <Link to="/login">← Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

