import { useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { studentAPI } from "../../api/axios";
import "../../styles/Students.css";

function ViewStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await studentAPI.getAll();
      if (response.data.success) {
        setStudents(response.data.students);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await studentAPI.delete(id);
      setStudents(students.filter((s) => s._id !== id));
      alert("Student deleted successfully!");
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete student. Please try again.");
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setEditForm({ ...student });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSave = async () => {
    try {
      await studentAPI.update(editingId, editForm);
      setStudents(students.map((s) => (s._id === editingId ? editForm : s)));
      setEditingId(null);
      alert("Student updated successfully!");
    } catch (err) {
      console.error("Error updating student:", err);
      alert("Failed to update student. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Filter students based on search
  const filteredStudents = students.filter((student) =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="view-students-container">
        <h2>View Students</h2>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, roll number, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading State */}
        {loading && <div className="loading">Loading students...</div>}

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Students Table */}
        {!loading && (
          <table className="students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>Email</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id}>
                    {editingId === student._id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            name="name"
                            value={editForm.name || ""}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="rollNumber"
                            value={editForm.rollNumber || ""}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            name="email"
                            value={editForm.email || ""}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="department"
                            value={editForm.department || ""}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="phone"
                            value={editForm.phone || ""}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td className="action-buttons">
                          <button className="save-btn" onClick={handleSave}>
                            Save
                          </button>
                          <button className="cancel-btn" onClick={handleCancel}>
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{student.name}</td>
                        <td>{student.rollNumber}</td>
                        <td>{student.email}</td>
                        <td>{student.department}</td>
                        <td>{student.phone}</td>
                        <td className="action-buttons">
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(student)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(student._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Total Count */}
        {!loading && students.length > 0 && (
          <div className="total-count">
            Total Students: {filteredStudents.length}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ViewStudents;

