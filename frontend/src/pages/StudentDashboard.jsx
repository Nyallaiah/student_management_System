import DashboardLayout from "../layout/DashboardLayout";
import "../styles/StudentDashboard.css";
import { useState, useEffect } from "react";
import { studentAPI } from "../api/axios";

function StudentDashboard() {
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averagePercentage: 0,
    totalCredits: 0,
    subjects: 0,
    passStatus: "N/A"
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Fetch student profile
        const profileResponse = await studentAPI.getMe();
        if (profileResponse.data.success) {
          setStudentName(profileResponse.data.student.name || "Student");
        } else {
          setStudentName("Student");
        }

        // Fetch student marks
        const marksResponse = await studentAPI.getStudentMarks();
        if (marksResponse.data.success && marksResponse.data.marks) {
          const marks = marksResponse.data.marks;
          if (marks.length > 0) {
            const totalMarks = marks.reduce((sum, m) => sum + (parseInt(m.marks) || 0), 0);
            const avgPercentage = (totalMarks / marks.length).toFixed(2);
            const totalCredits = marks.reduce((sum, m) => sum + (parseInt(m.credits) || 0), 0);
            
            // Check pass status (all subjects must pass)
            const allPassed = marks.every(m => m.status === "Pass" || (parseInt(m.marks) || 0) >= 40);
            
            setStats({
              averagePercentage: avgPercentage,
              totalCredits: totalCredits,
              subjects: marks.length,
              passStatus: allPassed ? "Pass" : "Need Improvement"
            });
          }
        }
      } catch (error) {
        console.log("Could not fetch student data:", error);
        setStudentName("Student");
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, []);

  return (
    <DashboardLayout role="student">
      <div className="student-container">
        <div className="student-content">
          <h1>Welcome {loading ? "..." : studentName} 👋</h1>
          <p>View your academic information here.</p>

          <div className="student-stats-grid">
            <div className="stat-card">
              <h3>📊 Average Percentage</h3>
              <p className="stat-value">{stats.averagePercentage}%</p>
            </div>

            <div className="stat-card">
              <h3>📚 Total Credits</h3>
              <p className="stat-value">{stats.totalCredits}</p>
            </div>

            <div className="stat-card">
              <h3>📝 Subjects</h3>
              <p className="stat-value">{stats.subjects}</p>
            </div>

            <div className="stat-card">
              <h3>✅ Pass Status</h3>
              <p className="stat-value">{stats.passStatus}</p>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="student-footer">
          © {new Date().getFullYear()} Student Record Management System | All Rights Reserved
        </footer>
      </div>
    </DashboardLayout>
  );
}

export default StudentDashboard;

