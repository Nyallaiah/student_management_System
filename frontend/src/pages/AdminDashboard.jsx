import DashboardLayout from "../layout/DashboardLayout";
import "../styles/AdminDashboard.css";
import { useState, useEffect } from "react";
import { studentAPI } from "../api/axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    examsConducted: 0,
    reportsGenerated: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all students
      const studentsResponse = await studentAPI.getAll();
      
      if (studentsResponse.data.success) {
        const students = studentsResponse.data.students || [];
        
        // Calculate stats from actual data
        let totalMarks = 0;
        let studentsWithMarks = 0;
        
        students.forEach(student => {
          if (student.marks && student.marks.length > 0) {
            studentsWithMarks++;
            student.marks.forEach(mark => {
              totalMarks += parseInt(mark.marks) || 0;
            });
          }
        });

        // Get unique departments (courses)
        const departments = [...new Set(students.map(s => s.department).filter(Boolean))];

        setStats({
          totalStudents: students.length,
          activeCourses: departments.length || 8,
          examsConducted: studentsWithMarks > 0 ? departments.length * 2 : 0,
          reportsGenerated: studentsWithMarks
        });

        // Create recent activity based on actual data
        const activities = [];
        
        if (students.length > 0) {
          activities.push(`✅ Total ${students.length} students registered in system`);
        }
        
        if (departments.length > 0) {
          activities.push(`📚 ${departments.length} active departments/courses`);
        }
        
        if (studentsWithMarks > 0) {
          activities.push(`📝 Marks added for ${studentsWithMarks} students`);
        }
        
        if (activities.length === 0) {
          activities.push("📋 System initialized - Add students to get started");
        }

        setRecentActivity(activities);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set default values if API fails
      setStats({
        totalStudents: 0,
        activeCourses: 0,
        examsConducted: 0,
        reportsGenerated: 0
      });
      setRecentActivity([
        "⚠️ Could not load data - Please ensure backend is running"
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="admin-dashboard">

        <h1 className="dashboard-title">Welcome Admin 👋</h1>
        <p className="dashboard-subtitle">
          Manage students, courses and reports efficiently.
        </p>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>👨‍🎓 Total Students</h3>
            <p>{loading ? "..." : stats.totalStudents}</p>
          </div>

          <div className="stat-card">
            <h3>📚 Active Courses</h3>
            <p>{loading ? "..." : stats.activeCourses}</p>
          </div>

          <div className="stat-card">
            <h3>📝 Exams Conducted</h3>
            <p>{loading ? "..." : stats.examsConducted}</p>
          </div>

          <div className="stat-card">
            <h3>📊 Reports Generated</h3>
            <p>{loading ? "..." : stats.reportsGenerated}</p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="recent-activity">
          <h2>Recent Activities</h2>
          <ul>
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))
            ) : (
              <>
                <li>✅ Student Ravi added successfully</li>
                <li>📊 Semester 4 results updated</li>
                <li>📝 New course "Data Science" created</li>
                <li>📥 Monthly report downloaded</li>
              </>
            )}
          </ul>
        </div>

        {/* Footer Section */}
        <footer className="admin-footer">
          © {new Date().getFullYear()} Student Record Management System | All Rights Reserved
        </footer>

      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;

