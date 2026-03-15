import { useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axios from "../../api/axios";
import "../../styles/Students.css";

function ManageMarks() {
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAddingMarks, setIsAddingMarks] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const studentsData = response.data.students || [];
      setStudents(studentsData);
      
      // Fetch marks for each student
      const marksData = {};
      for (const student of studentsData) {
        try {
          const marksResponse = await axios.get(`/students/${student._id}/marks`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          marksData[student._id] = marksResponse.data.marks || [];
        } catch (error) {
          // If no marks found, initialize with empty array
          marksData[student._id] = [];
        }
      }
      setMarks(marksData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    }
  };

  const handleViewMarks = (student) => {
    setSelectedStudent({ ...student, studentMarks: marks[student._id] || [] });
    setIsAddingMarks(false);
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

  const calculateStatus = (marks, total = 100) => {
    const percentage = (parseInt(marks) / parseInt(total)) * 100;
    return percentage >= 40 ? "Pass" : "Fail";
  };

  const handleAddMarks = (student) => {
    // If no marks exist, initialize with default subjects
    const existingMarks = marks[student._id] || [
      { subject: "Data Structures", marks: 0, total: 100, credits: 4, grade: "F", status: "Fail" },
      { subject: "Database Management", marks: 0, total: 100, credits: 3, grade: "F", status: "Fail" },
      { subject: "Web Development", marks: 0, total: 100, credits: 3, grade: "F", status: "Fail" },
      { subject: "Computer Networks", marks: 0, total: 100, credits: 3, grade: "F", status: "Fail" },
      { subject: "Software Engineering", marks: 0, total: 100, credits: 4, grade: "F", status: "Fail" },
    ];
    setSelectedStudent({ ...student, studentMarks: existingMarks });
    setIsAddingMarks(true);
  };

  const handleMarksChange = (index, field, value) => {
    const updatedMarks = [...selectedStudent.studentMarks];
    updatedMarks[index] = { ...updatedMarks[index], [field]: value };
    
    // Auto-calculate grade and status when marks or total changes
    if (field === 'marks' || field === 'total') {
      const marks = field === 'marks' ? value : updatedMarks[index].marks;
      const total = field === 'total' ? value : updatedMarks[index].total;
      updatedMarks[index].grade = calculateGrade(marks, total);
      updatedMarks[index].status = calculateStatus(marks, total);
    }
    
    setSelectedStudent({ ...selectedStudent, studentMarks: updatedMarks });
  };

  const handleGradeChange = (index, value) => {
    const updatedMarks = [...selectedStudent.studentMarks];
    updatedMarks[index] = { ...updatedMarks[index], grade: value };
    setSelectedStudent({ ...selectedStudent, studentMarks: updatedMarks });
  };

  const handleStatusChange = (index, value) => {
    const updatedMarks = [...selectedStudent.studentMarks];
    updatedMarks[index] = { ...updatedMarks[index], status: value };
    setSelectedStudent({ ...selectedStudent, studentMarks: updatedMarks });
  };

  const handleAddSubject = () => {
    setSelectedStudent({
      ...selectedStudent,
      studentMarks: [
        ...selectedStudent.studentMarks,
        { subject: "", marks: 0, total: 100, credits: 3, grade: "F", status: "Fail" },
      ],
    });
  };

  const handleSaveMarks = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/students/${selectedStudent._id}/marks`,
        { marks: selectedStudent.studentMarks },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMarks({ ...marks, [selectedStudent._id]: selectedStudent.studentMarks });
      alert("Marks saved successfully!");
      setIsAddingMarks(false);
    } catch (error) {
      console.error("Error saving marks:", error);
      // For demo, just save locally if API fails
      setMarks({ ...marks, [selectedStudent._id]: selectedStudent.studentMarks });
      alert("Marks saved (local mode)!");
      setIsAddingMarks(false);
    }
  };

  const calculateAverage = (studentMarks) => {
    if (!studentMarks || studentMarks.length === 0) return 0;
    const total = studentMarks.reduce((sum, m) => sum + parseInt(m.marks || 0), 0);
    return studentMarks.length > 0 ? (total / studentMarks.length).toFixed(2) : 0;
  };

  return (
    <DashboardLayout role="admin">
      <div className="manage-marks-container">
        <h1>Manage Student Marks 📝</h1>
        <p>View and manage marks for all students.</p>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="students-table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Average</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.rollNumber}</td>
                    <td>{student.name}</td>
                    <td>{student.department}</td>
                    <td>{new Date().getFullYear()}</td>
                    <td>
                      <span className="average-badge">
                        {calculateAverage(marks[student._id])}%
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() => handleViewMarks(student)}
                      >
                        View
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => handleAddMarks(student)}
                      >
                        Add/Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Marks Modal */}
        {selectedStudent && (
          <div className="modal-overlay">
            <div className="modal-content marks-modal">
              <h2>
                {isAddingMarks ? "Add/Edit Marks" : "View Marks"} - {selectedStudent.name}
              </h2>
              <button
                className="close-modal"
                onClick={() => setSelectedStudent(null)}
              >
                ✕
              </button>

              <div className="marks-details">
                <p><strong>Roll No:</strong> {selectedStudent.rollNumber}</p>
                <p><strong>Course:</strong> {selectedStudent.department}</p>
                <p><strong>Average:</strong> {calculateAverage(selectedStudent.studentMarks)}%</p>
              </div>

              <table className="marks-edit-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Credits</th>
                    <th>Marks</th>
                    <th>Total</th>
                    <th>Grade</th>
                    <th>Status</th>
                    {isAddingMarks && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {selectedStudent.studentMarks.map((mark, index) => (
                    <tr key={index}>
                      <td>
                        {isAddingMarks ? (
                          <input
                            type="text"
                            value={mark.subject}
                            onChange={(e) =>
                              handleMarksChange(index, "subject", e.target.value)
                            }
                            className="marks-input"
                          />
                        ) : (
                          mark.subject
                        )}
                      </td>
                      <td>
                        {isAddingMarks ? (
                          <input
                            type="number"
                            value={mark.credits}
                            onChange={(e) =>
                              handleMarksChange(index, "credits", e.target.value)
                            }
                            className="marks-input"
                            min="1"
                            max="10"
                          />
                        ) : (
                          mark.credits || 3
                        )}
                      </td>
                      <td>
                        {isAddingMarks ? (
                          <input
                            type="number"
                            value={mark.marks}
                            onChange={(e) =>
                              handleMarksChange(index, "marks", e.target.value)
                            }
                            className="marks-input"
                            min="0"
                            max={mark.total}
                          />
                        ) : (
                          mark.marks
                        )}
                      </td>
                      <td>
                        {isAddingMarks ? (
                          <input
                            type="number"
                            value={mark.total}
                            onChange={(e) =>
                              handleMarksChange(index, "total", e.target.value)
                            }
                            className="marks-input"
                          />
                        ) : (
                          mark.total
                        )}
                      </td>
                      <td>
                        {isAddingMarks ? (
                          <select
                            value={mark.grade}
                            onChange={(e) =>
                              handleGradeChange(index, e.target.value)
                            }
                            className="marks-input"
                          >
                            <option value="A+">A+</option>
                            <option value="A">A</option>
                            <option value="B+">B+</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="F">F</option>
                          </select>
                        ) : (
                          mark.grade || "F"
                        )}
                      </td>
                      <td>
                        {isAddingMarks ? (
                          <select
                            value={mark.status}
                            onChange={(e) =>
                              handleStatusChange(index, e.target.value)
                            }
                            className="marks-input"
                          >
                            <option value="Pass">Pass</option>
                            <option value="Fail">Fail</option>
                          </select>
                        ) : (
                          mark.status || "Fail"
                        )}
                      </td>
                      {isAddingMarks && (
                        <td>
                          <button
                            className="btn-delete-small"
                            onClick={() => {
                              const updatedMarks = selectedStudent.studentMarks.filter(
                                (_, i) => i !== index
                              );
                              setSelectedStudent({
                                ...selectedStudent,
                                studentMarks: updatedMarks,
                              });
                            }}
                          >
                            ✕
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {isAddingMarks && (
                <div className="marks-actions">
                  <button className="btn-add-subject" onClick={handleAddSubject}>
                    + Add Subject
                  </button>
                  <button className="btn-save" onClick={handleSaveMarks}>
                    Save Marks
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ManageMarks;

