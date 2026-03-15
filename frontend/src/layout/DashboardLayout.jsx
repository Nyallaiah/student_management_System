import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/DashboardLayout.css";
import { Link } from "react-router-dom";
import { studentAPI, authAPI } from "../api/axios";

function DashboardLayout({ role, children }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch student name if role is student
    if (role === "student") {
      const fetchStudentName = async () => {
        setLoading(true);
        try {
          const response = await studentAPI.getMe();
          if (response.data.success) {
            setUserName(response.data.student.name || "Student");
          } else {
            setUserName("Student");
          }
        } catch (error) {
          console.log("Could not fetch student data:", error);
          setUserName("Student");
        } finally {
          setLoading(false);
        }
      };
      fetchStudentName();
    }
  }, [role]);

  const handleLogout = async () => {
    try {
      // Try to call the logout API
      await authAPI.logout();
    } catch (error) {
      console.log("API logout not available, proceeding with local logout");
    } finally {
      // Always clear local storage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      navigate("/login");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-logo">🎓 SRMS</h2>

        {role === "admin" ? (
          <nav className="sidebar-nav">
            <Link to="/admin-dashboard" className="sidebar-link">📊 Dashboard</Link>
            <Link to="/admin/add-student" className="sidebar-link">➕ Add Student</Link>
            <Link to="/admin/view-students" className="sidebar-link">👥 View Students</Link>
            <Link to="/admin/manage-profiles" className="sidebar-link">👤 Manage Profiles</Link>
            <Link to="/admin/manage-marks" className="sidebar-link">📝 Manage Marks</Link>
            <Link to="/admin/reports" className="sidebar-link">📄 Reports</Link>
          </nav>
        ) : (
          <nav className="sidebar-nav">
            <Link to="/student-dashboard" className="sidebar-link">📊 Dashboard</Link>
            <Link to="/student/profile" className="sidebar-link">👤 My Profile</Link>
            <Link to="/student/marks" className="sidebar-link">📝 My Marks</Link>
            <Link to="/student/reports" className="sidebar-link">📄 Download Report</Link>
          </nav>
        )}
      </div>

      {/* Main Section */}
      <div className="main-content">
        <div className="topbar">
          <h3>{role === "admin" ? "Admin Panel" : "Student Panel"}</h3>
          <div className="topbar-right">
            <span className="user-info">
              Welcome, {loading ? "..." : (role === "admin" ? "Admin" : userName)}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="content-area">
          {children}
        </div>

        {/* Footer */}
        {/* <div className="dashboard-footer">
          <div className="dashboard-footer-content">
            <div className="dashboard-footer-info">
              <h4>🎓 Student Record Management System</h4>
              <p>Efficiently manage student data, marks, and reports</p>
            </div>
            <div className="dashboard-footer-links">
              <Link to="/">Home</Link>
              <Link to="/login">Login</Link>
              <a href="#">Help</a>
              <a href="#">Support</a>
            </div> */}
            <div className="dashboard-footer-copyright">
              © {new Date().getFullYear()} SRMS. All rights reserved.
            </div>
          {/* </div>
        </div> */}
      </div>
    </div>
  );
}

export default DashboardLayout;

