// import DashboardLayout from "../../layout/DashboardLayout";
// import "../../styles/StudentDashboard.css";
// import { useState, useEffect } from "react";
// import { studentAPI } from "../../api/axios";

// function StudentReports() {
//   const [studentData, setStudentData] = useState(null);
//   const [marksData, setMarksData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchStudentData();
//   }, []);

//   const fetchStudentData = async () => {
//     try {
//       // Fetch student profile
//       const profileResponse = await studentAPI.getMe();
//       if (profileResponse.data.success) {
//         setStudentData(profileResponse.data.student);
//       }

//       // Fetch student marks
//       const marksResponse = await studentAPI.getStudentMarks();
//       if (marksResponse.data.success) {
//         setMarksData(marksResponse.data.marks || []);
//       }
//     } catch (error) {
//       console.error("Error fetching student data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate GPA/Grade Point
//   const calculateGPA = () => {
//     if (marksData.length === 0) return "N/A";
    
//     const gradePoints = {
//       "A+": 10, "A": 9, "B+": 8, "B": 7, "C": 6, "D": 5, "F": 0
//     };

//     let totalPoints = 0;
//     let totalCredits = 0;

//     marksData.forEach(mark => {
//       const credits = parseInt(mark.credits) || 3;
//       const grade = mark.grade || "F";
//       totalPoints += (gradePoints[grade] || 0) * credits;
//       totalCredits += credits;
//     });

//     return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "N/A";
//   };

//   // Calculate overall percentage
//   const calculatePercentage = () => {
//     if (marksData.length === 0) return 0;
    
//     const totalMarks = marksData.reduce((sum, m) => sum + (parseInt(m.marks) || 0), 0);
//     return (totalMarks / marksData.length).toFixed(2);
//   };

//   // Check pass status
//   const getPassStatus = () => {
//     if (marksData.length === 0) return "No Data";
//     const allPassed = marksData.every(m => m.status === "Pass" || (parseInt(m.marks) || 0) >= 40);
//     return allPassed ? "PASS" : "NEEDS IMPROVEMENT";
//   };

//   // Generate report card data
//   const getReportsList = () => {
//     const reports = [];

//     // Add marks report if available
//     if (marksData.length > 0) {
//       reports.push({
//         id: 1,
//         title: "Semester Marks Report",
//         type: "Grade Report",
//         date: new Date().toLocaleDateString(),
//         size: `${(marksData.length * 2).toFixed(0)} KB`,
//         available: true
//       });
//     }

//     // Add profile report
//     reports.push({
//       id: 2,
//       title: "Student Profile Report",
//       type: "Profile Report",
//       date: new Date().toLocaleDateString(),
//       size: "15 KB",
//       available: true
//     });

//     // Add certificates (placeholder)
//     reports.push({
//       id: 3,
//       title: "Course Completion Certificate",
//       type: "Certificate",
//       date: "N/A",
//       size: "N/A",
//       available: marksData.length > 0 && getPassStatus() === "PASS"
//     });

//     reports.push({
//       id: 4,
//       title: "Marks Transcript",
//       type: "Transcript",
//       date: new Date().toLocaleDateString(),
//       size: marksData.length > 0 ? `${(marksData.length * 3).toFixed(0)} KB` : "N/A",
//       available: marksData.length > 0
//     });

//     return reports;
//   };

//   const handleDownload = (reportTitle) => {
//     // In a real app, this would generate a PDF or trigger a download
//     alert(`Generating ${reportTitle}...\n\nThis feature would generate a downloadable PDF in a production environment.`);
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   if (loading) {
//     return (
//       <DashboardLayout role="student">
//         <div className="student-container">
//           <div className="student-content">
//             <p>Loading reports...</p>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   const reportsList = getReportsList();

//   return (
//     <DashboardLayout role="student">
//       <div className="student-container">
//         <div className="student-content">
//           <h1>Download Reports 📥</h1>
//           <p>Access and download your academic reports and certificates.</p>

//           {/* Student Summary Card */}
//           {studentData && (
//             <div className="student-summary-card">
//               <h3>📋 Student Summary</h3>
//               <div className="summary-details">
//                 <p><strong>Name:</strong> {studentData.name}</p>
//                 <p><strong>Roll Number:</strong> {studentData.rollNumber}</p>
//                 <p><strong>Department:</strong> {studentData.department}</p>
//                 <p><strong>Email:</strong> {studentData.email}</p>
//               </div>
//               <div className="summary-stats">
//                 <div className="summary-stat">
//                   <span className="stat-label">Overall %</span>
//                   <span className="stat-value">{calculatePercentage()}%</span>
//                 </div>
//                 <div className="summary-stat">
//                   <span className="stat-label">GPA</span>
//                   <span className="stat-value">{calculateGPA()}</span>
//                 </div>
//                 <div className="summary-stat">
//                   <span className="stat-label">Status</span>
//                   <span className={`stat-value ${getPassStatus() === 'PASS' ? 'pass' : 'fail'}`}>
//                     {getPassStatus()}
//                   </span>
//                 </div>
//                 <div className="summary-stat">
//                   <span className="stat-label">Subjects</span>
//                   <span className="stat-value">{marksData.length}</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Reports Grid */}
//           <div className="reports-grid">
//             {reportsList.map((report) => (
//               <div key={report.id} className="report-card">
//                 <div className="report-icon">
//                   {report.type === "Certificate" ? "🎓" : report.type === "Transcript" ? "📜" : "📄"}
//                 </div>
//                 <div className="report-info">
//                   <h3>{report.title}</h3>
//                   <p className="report-type">{report.type}</p>
//                   <p className="report-meta">
//                     <span>📅 {report.date}</span>
//                     {report.size !== "N/A" && <span>📁 {report.size}</span>}
//                   </p>
//                 </div>
//                 {report.available ? (
//                   <button 
//                     className="download-btn"
//                     onClick={() => handleDownload(report.title)}
//                   >
//                     ⬇ Download
//                   </button>
//                 ) : (
//                   <button className="download-btn disabled" disabled>
//                     🔒 Not Available
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Print Button */}
//           <div className="print-section">
//             <button className="action-btn" onClick={handlePrint}>
//               🖨️ Print Academic Record
//             </button>
//           </div>

//           {/* Quick Actions */}
//           <div className="quick-actions">
//             <h2>Quick Actions</h2>
//             <div className="actions-grid">
//               <button className="action-btn" onClick={() => handleDownload("Transcript Request")}>
//                 📜 Request Transcript
//               </button>
//               <button className="action-btn" onClick={() => alert("Your request has been submitted. Admin will review it shortly.")}>
//                 🎓 Request Certificate
//               </button>
//               <button className="action-btn" onClick={() => window.location.href = "/student/marks"}>
//                 📊 View Marks Details
//               </button>
//               <button className="action-btn" onClick={() => window.location.href = "/student/profile"}>
//                 👤 View Profile
//               </button>
//             </div>
//           </div>
//         </div>

//         <footer className="student-footer">
//           © {new Date().getFullYear()} Student Record Management System | All Rights Reserved
//         </footer>
//       </div>
//     </DashboardLayout>
//   );
// }

// export default StudentReports;


import DashboardLayout from "../../layout/DashboardLayout";
import "../../styles/StudentDashboard.css";
import { useState, useEffect } from "react";
import { studentAPI } from "../../api/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function StudentReports() {
  const [studentData, setStudentData] = useState(null);
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const profileResponse = await studentAPI.getMe();
      if (profileResponse.data.success) {
        setStudentData(profileResponse.data.student);
      }

      const marksResponse = await studentAPI.getStudentMarks();
      if (marksResponse.data.success) {
        setMarksData(marksResponse.data.marks || []);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  };

  // GPA
  const calculateGPA = () => {
    if (marksData.length === 0) return "N/A";

    const gradePoints = {
      "A+": 10, A: 9, "B+": 8, B: 7, C: 6, D: 5, F: 0
    };

    let totalPoints = 0;
    let totalCredits = 0;

    marksData.forEach(mark => {
      const credits = parseInt(mark.credits) || 3;
      const grade = mark.grade || "F";
      totalPoints += (gradePoints[grade] || 0) * credits;
      totalCredits += credits;
    });

    return totalCredits > 0
      ? (totalPoints / totalCredits).toFixed(2)
      : "N/A";
  };

  // Percentage
  const calculatePercentage = () => {
    if (marksData.length === 0) return 0;

    const totalMarks = marksData.reduce(
      (sum, m) => sum + (parseInt(m.marks) || 0),
      0
    );

    return (totalMarks / marksData.length).toFixed(2);
  };

  // Pass Status
  const getPassStatus = () => {
    if (marksData.length === 0) return "No Data";

    const allPassed = marksData.every(
      m => m.status === "Pass" || (parseInt(m.marks) || 0) >= 40
    );

    return allPassed ? "PASS" : "NEEDS IMPROVEMENT";
  };

  // ✅ DOWNLOAD FUNCTION (UPDATED)
  const handleDownload = (reportTitle) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(reportTitle, 14, 20);

    // Student Info
    if (studentData) {
      doc.setFontSize(12);
      doc.text(`Name: ${studentData.name}`, 14, 35);
      doc.text(`Roll No: ${studentData.rollNumber}`, 14, 42);
      doc.text(`Department: ${studentData.department}`, 14, 49);
      doc.text(`Email: ${studentData.email}`, 14, 56);
    }

    // Table Data
    if (marksData.length > 0) {
      const tableData = marksData.map((m, index) => [
        index + 1,
        m.subject || "Subject",
        m.marks,
        m.grade,
        m.credits || 3,
        m.status || "-"
      ]);

      autoTable(doc, {
        startY: 65,
        head: [["#", "Subject", "Marks", "Grade", "Credits", "Status"]],
        body: tableData,
      });
    }

    // Summary
    const finalY = doc.lastAutoTable?.finalY || 80;

    doc.text(`Percentage: ${calculatePercentage()}%`, 14, finalY + 10);
    doc.text(`GPA: ${calculateGPA()}`, 14, finalY + 18);
    doc.text(`Status: ${getPassStatus()}`, 14, finalY + 26);

    // Save PDF
    doc.save(`${reportTitle}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="student-container">
          <div className="student-content">
            <p>Loading reports...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const reportsList = [
    {
      id: 1,
      title: "Semester Marks Report",
      type: "Grade Report",
      available: marksData.length > 0
    },
    {
      id: 2,
      title: "Student Profile Report",
      type: "Profile Report",
      available: true
    },
    {
      id: 3,
      title: "Course Completion Certificate",
      type: "Certificate",
      available: marksData.length > 0 && getPassStatus() === "PASS"
    },
    {
      id: 4,
      title: "Marks Transcript",
      type: "Transcript",
      available: marksData.length > 0
    }
  ];

  return (
    <DashboardLayout role="student">
      <div className="student-container">
        <div className="student-content">
          <h1>Download Reports 📥</h1>

          {/* Summary */}
          {studentData && (
            <div className="student-summary-card">
              <h3>Student Summary</h3>
              <p>Name: {studentData.name}</p>
              <p>Roll: {studentData.rollNumber}</p>
              <p>Dept: {studentData.department}</p>

              <p>Percentage: {calculatePercentage()}%</p>
              <p>GPA: {calculateGPA()}</p>
              <p>Status: {getPassStatus()}</p>
            </div>
          )}

          {/* Reports */}
          <div className="reports-grid">
            {reportsList.map((report) => (
              <div key={report.id} className="report-card">
                <h3>{report.title}</h3>

                {report.available ? (
                  <button
                    className="download-btn"
                    onClick={() => handleDownload(report.title)}
                  >
                    ⬇ Download
                  </button>
                ) : (
                  <button disabled>Not Available</button>
                )}
              </div>
            ))}
          </div>

          <button onClick={handlePrint}>🖨 Print</button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudentReports;
