import { useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { studentAPI } from "../../api/axios";
import "../../styles/Students.css";

function Reports() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("summary");
  const [departmentStats, setDepartmentStats] = useState({});
  const [overallStats, setOverallStats] = useState({
    totalStudents: 0,
    avgPercentage: 0,
    passRate: 0,
    topPerformers: []
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const response = await studentAPI.getAll();
      
      if (response.data.success) {
        const studentsData = response.data.students || [];
        setStudents(studentsData);

        // Calculate department-wise stats
        const deptStats = {};
        
        studentsData.forEach(student => {
          const dept = student.department || "Unknown";
          
          if (!deptStats[dept]) {
            deptStats[dept] = {
              total: 0,
              passCount: 0,
              totalMarks: 0,
              studentNames: []
            };
          }
          
          deptStats[dept].total++;
          deptStats[dept].studentNames.push(student.name);

          // Calculate marks if available
          if (student.marks && student.marks.length > 0) {
            const marks = student.marks.map(m => parseInt(m.marks) || 0);
            const avg = marks.reduce((a, b) => a + b, 0) / marks.length;
            deptStats[dept].totalMarks += avg;
            
            // Check if pass (40% threshold)
            const allPassed = marks.every(m => m >= 40);
            if (allPassed) deptStats[dept].passCount++;
          }
        });

        // Calculate final department stats
        Object.keys(deptStats).forEach(dept => {
          const data = deptStats[dept];
          data.avgPercentage = data.totalMarks > 0 
            ? (data.totalMarks / data.total).toFixed(2) 
            : 0;
          data.passRate = data.total > 0 
            ? ((data.passCount / data.total) * 100).toFixed(2) 
            : 0;
        });

        setDepartmentStats(deptStats);

        // Calculate overall stats
        let totalAvg = 0;
        let passCount = 0;
        let studentCount = 0;
        let allStudentsWithMarks = [];

        studentsData.forEach(student => {
          if (student.marks && student.marks.length > 0) {
            const marks = student.marks.map(m => parseInt(m.marks) || 0);
            const avg = marks.reduce((a, b) => a + b, 0) / marks.length;
            totalAvg += avg;
            studentCount++;
            
            const allPassed = marks.every(m => m >= 40);
            if (allPassed) passCount++;

            allStudentsWithMarks.push({
              name: student.name,
              rollNumber: student.rollNumber,
              average: avg
            });
          }
        });

        // Get top 5 performers
        const topPerformers = allStudentsWithMarks
          .sort((a, b) => b.average - a.average)
          .slice(0, 5);

        setOverallStats({
          totalStudents: studentsData.length,
          avgPercentage: studentCount > 0 ? (totalAvg / studentCount).toFixed(2) : 0,
          passRate: studentCount > 0 ? ((passCount / studentCount) * 100).toFixed(2) : 0,
          topPerformers: topPerformers
        });
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="reports-container">
          <h1>Reports 📊</h1>
          <p>Loading report data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="reports-container">
        <div className="reports-header">
          <h1>Reports & Analytics 📊</h1>
          <div className="report-actions">
            <select 
              value={reportType} 
              onChange={(e) => setReportType(e.target.value)}
              className="report-select"
            >
              <option value="summary">Summary Report</option>
              <option value="department">Department-wise Report</option>
              <option value="performance">Performance Report</option>
            </select>
            <button className="btn-print" onClick={handlePrintReport}>
              🖨️ Print Report
            </button>
          </div>
        </div>

        {/* Summary Report */}
        {reportType === "summary" && (
          <div className="report-section">
            <h2>Overall Summary</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>👨‍🎓 Total Students</h3>
                <p className="stat-value">{overallStats.totalStudents}</p>
              </div>
              <div className="stat-card">
                <h3>📊 Average Percentage</h3>
                <p className="stat-value">{overallStats.avgPercentage}%</p>
              </div>
              <div className="stat-card">
                <h3>✅ Pass Rate</h3>
                <p className="stat-value">{overallStats.passRate}%</p>
              </div>
              <div className="stat-card">
                <h3>📚 Departments</h3>
                <p className="stat-value">{Object.keys(departmentStats).length}</p>
              </div>
            </div>

            {/* Top Performers */}
            {overallStats.topPerformers.length > 0 && (
              <div className="top-performers">
                <h3>🏆 Top Performers</h3>
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Roll Number</th>
                      <th>Name</th>
                      <th>Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overallStats.topPerformers.map((student, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{student.rollNumber}</td>
                        <td>{student.name}</td>
                        <td>{student.average.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Department-wise Report */}
        {reportType === "department" && (
          <div className="report-section">
            <h2>Department-wise Performance</h2>
            <table className="students-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Total Students</th>
                  <th>Students with Marks</th>
                  <th>Average Percentage</th>
                  <th>Pass Rate</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(departmentStats).length > 0 ? (
                  Object.entries(departmentStats).map(([dept, data]) => (
                    <tr key={dept}>
                      <td><strong>{dept}</strong></td>
                      <td>{data.total}</td>
                      <td>{data.totalMarks > 0 ? data.total : 0}</td>
                      <td>{data.avgPercentage}%</td>
                      <td>{data.passRate}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{textAlign: "center"}}>
                      No department data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Performance Report */}
        {reportType === "performance" && (
          <div className="report-section">
            <h2>Student Performance Details</h2>
            <table className="students-table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Marks Entered</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.rollNumber}</td>
                    <td>{student.name}</td>
                    <td>{student.department}</td>
                    <td>{student.email}</td>
                    <td>
                      {student.marks && student.marks.length > 0 ? (
                        <span className="status-pass">✓ Yes ({student.marks.length} subjects)</span>
                      ) : (
                        <span className="status-fail">✗ No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="report-footer">
          <p>Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
          <p>Student Record Management System</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Reports;

