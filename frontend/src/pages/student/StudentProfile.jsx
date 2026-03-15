import DashboardLayout from "../../layout/DashboardLayout";
import "../../styles/StudentDashboard.css";
import { useState, useEffect } from "react";
import { studentAPI } from "../../api/axios";

function StudentProfile() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await studentAPI.getMe();
        if (response.data.success) {
          setStudentData(response.data.student);
        } else {
          setError("Failed to load profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Could not load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="student-container">
          <div className="student-content">
            <h1>My Profile 👤</h1>
            <p>Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="student">
        <div className="student-container">
          <div className="student-content">
            <h1>My Profile 👤</h1>
            <p style={{ color: "red" }}>{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Fallback data if certain fields are missing
  const displayData = {
    name: studentData?.name || "N/A",
    email: studentData?.email || "N/A",
    rollNumber: studentData?.rollNumber || "N/A",
    department: studentData?.department || "N/A",
    phone: studentData?.phone || "N/A"
  };

  return (
    <DashboardLayout role="student">
      <div className="student-container">
        <div className="student-content">
          <h1>My Profile 👤</h1>
          <p>View your personal information here.</p>

          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {displayData.name.charAt(0)}
              </div>
              <div className="profile-name">
                <h2>{displayData.name}</h2>
                <p>{displayData.rollNumber}</p>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{displayData.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{displayData.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Department:</span>
                <span className="detail-value">{displayData.department}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Roll Number:</span>
                <span className="detail-value">{displayData.rollNumber}</span>
              </div>
            </div>
          </div>
        </div>

        <footer className="student-footer">
          © {new Date().getFullYear()} Student Record Management System | All Rights Reserved
        </footer>
      </div>
    </DashboardLayout>
  );
}

export default StudentProfile;

