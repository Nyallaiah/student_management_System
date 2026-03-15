import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminLayout.css";

function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    // Redirect to login
    navigate("/login");
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">🎓 SRMS</h2>

        <ul className="sidebar-nav">
          <li>
            <Link to="/admin-dashboard">📊 Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/add-student">➕ Add Student</Link>
          </li>
          <li>
            <Link to="/admin/view-students">👥 View Students</Link>
          </li>
          <li>
            <Link to="/admin/manage-profiles">👤 Manage Profiles</Link>
          </li>
          <li>
            <Link to="/admin/manage-marks">📝 Manage Marks</Link>
          </li>
          <li>
            <Link to="/admin/reports">📄 Reports</Link>
          </li>
        </ul>
      </div>

      {/* Main Section */}
      <div className="main-content">
        {/* Top Navbar */}
        <div className="topbar">
          <h3>Admin Panel</h3>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>

        {/* Footer */}
        <footer className="admin-footer">
          <div className="admin-footer-copyright">
            © {new Date().getFullYear()} SRMS. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AdminLayout;

