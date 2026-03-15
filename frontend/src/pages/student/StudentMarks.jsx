import { useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axios from "../../api/axios";
import "../../styles/StudentDashboard.css";

function StudentMarks() {
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/students/me/marks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.success) {
        // If no marks exist, show message
        const marks = response.data.marks || [];
        if (marks.length === 0) {
          setMarksData([]);
          setError("No marks have been added by admin yet.");
        } else {
          // Use the exact data saved by admin - including credits, grade, status
          const formattedMarks = marks.map((mark) => ({
            subject: mark.subject || "",
            marks: parseInt(mark.marks) || 0,
            total: parseInt(mark.total) || 100,
            credits: parseInt(mark.credits) || 3, // Use saved credits or default to 3
            grade: mark.grade || calculateGrade(parseInt(mark.marks) || 0, parseInt(mark.total) || 100),
            status: mark.status || (parseInt(mark.marks) >= 40 ? "Pass" : "Fail")
          }));
          setMarksData(formattedMarks);
          setError(null);
        }
      } else {
        setError(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching marks:", error);
      setError("Could not load marks data. Please try again later.");
      setLoading(false);
    }
  };

  const calculateGrade = (marks, total = 100) => {
    const percentage = (parseInt(marks) / parseInt(total)) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  };

  const totalCredits = marksData.reduce((sum, item) => sum + item.credits, 0);
  const totalMarks = marksData.reduce((sum, item) => sum + item.marks, 0);
  const averagePercentage = marksData.length > 0 ? (totalMarks / marksData.length).toFixed(2) : 0;

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="student-container">
          <div className="student-content">
            <p>Loading marks...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="student-container">
        <div className="student-content">
          <h1>My Marks 📝</h1>
          <p>View your academic performance here.</p>

          {error && <div className="error-message">{error}</div>}

          {/* Summary Cards */}
          <div className="marks-summary">
            <div className="summary-card">
              <h3>Average Percentage</h3>
              <p className="summary-value">{averagePercentage}%</p>
            </div>
            <div className="summary-card">
              <h3>Total Credits</h3>
              <p className="summary-value">{totalCredits}</p>
            </div>
            <div className="summary-card">
              <h3>Subjects</h3>
              <p className="summary-value">{marksData.length}</p>
            </div>
          </div>

          {/* Marks Table */}
          <div className="marks-table-container">
            <table className="marks-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Credits</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {marksData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.subject}</td>
                    <td>{item.credits}</td>
                    <td>{item.marks}</td>
                    <td>
                      <span className={`grade-badge grade-${item.grade.charAt(0)}`}>
                        {item.grade}
                      </span>
                    </td>
                    <td>
                      {item.status === "Pass" ? (
                        <span className="status-pass">✓ {item.status}</span>
                      ) : (
                        <span className="status-fail">✗ {item.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="student-footer">
          © {new Date().getFullYear()} Student Record Management System | All Rights Reserved
        </footer>
      </div>
    </DashboardLayout>
  );
}

export default StudentMarks;

