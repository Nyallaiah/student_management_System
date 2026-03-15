import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AddStudent from "./pages/admin/AddStudent";
import ViewStudents from "./pages/admin/ViewStudents";
import Reports from "./pages/admin/Reports";
import ManageProfiles from "./pages/admin/ManageProfiles";
import ManageMarks from "./pages/admin/ManageMarks";
import StudentProfile from "./pages/student/StudentProfile";
import StudentMarks from "./pages/student/StudentMarks";
import StudentReports from "./pages/student/StudentReports";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes with Navbar */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Home />
          </>
        }
      />

      <Route
        path="/login"
        element={
          <>
            <Navbar />
            <Login />
          </>
        }
      />

      {/* Signup Route - Public */}
      <Route
        path="/signup"
        element={
          <>
            <Navbar />
            <Signup />
          </>
        }
      />

      {/* Admin Dashboard - Protected */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Student Dashboard - Protected */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes - Protected */}
      <Route
        path="/admin/add-student"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AddStudent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/view-students"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ViewStudents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manage-profiles"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageProfiles />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manage-marks"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageMarks />
          </ProtectedRoute>
        }
      />

      {/* Student Routes - Protected */}
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/marks"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentMarks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/reports"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentReports />
          </ProtectedRoute>
        }
      />

      {/* 404 Not Found */}
      <Route
        path="*"
        element={
          <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/" style={{ color: "#4f46e5" }}>Go to Home</a>
          </div>
        }
      />
    </Routes>
  );
}

export default App;

