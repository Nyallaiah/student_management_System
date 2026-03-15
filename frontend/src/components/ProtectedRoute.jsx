import { Navigate, useLocation } from "react-router-dom";

// ProtectedRoute component to guard admin routes
function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  
  // Get user role from localStorage
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  // If not logged in, redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is restricted and user's role doesn't match
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/student-dashboard" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;

