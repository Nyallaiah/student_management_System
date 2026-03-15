import { useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { studentAPI } from "../../api/axios";
import "../../styles/Students.css";

function ManageProfiles() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentAPI.getAll();
      if (response.data.success) {
        setStudents(response.data.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter((student) =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setIsEditing(false);
  };

  const handleEditProfile = (student) => {
    setSelectedStudent({ ...student });
    setIsEditing(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.update(selectedStudent._id, selectedStudent);
      alert("Profile updated successfully!");
      fetchStudents();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update profile");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentAPI.delete(id);
        alert("Student deleted successfully!");
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <DashboardLayout role="admin">
      <div className="manage-profiles-container">
        <h1>Manage Student Profiles 👥</h1>
        <p>View and manage all student profiles.</p>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, email, or roll number..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="students-table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td>{student.rollNumber}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.department}</td>
                    <td>{student.phone}</td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() => handleViewProfile(student)}
                      >
                        View
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => handleEditProfile(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(student._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Profile Modal */}
        {selectedStudent && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{isEditing ? "Edit Profile" : "Student Profile"}</h2>
              <button
                className="close-modal"
                onClick={() => {
                  setSelectedStudent(null);
                  setIsEditing(false);
                }}
              >
                ✕
              </button>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="edit-form">
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={selectedStudent.name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={selectedStudent.email || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Roll Number:</label>
                    <input
                      type="text"
                      name="rollNumber"
                      value={selectedStudent.rollNumber || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Department:</label>
                    <input
                      type="text"
                      name="department"
                      value={selectedStudent.department || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone:</label>
                    <input
                      type="text"
                      name="phone"
                      value={selectedStudent.phone || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="submit" className="btn-save">
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="profile-view">
                  <div className="profile-field">
                    <label>Roll Number:</label>
                    <span>{selectedStudent.rollNumber}</span>
                  </div>
                  <div className="profile-field">
                    <label>Name:</label>
                    <span>{selectedStudent.name}</span>
                  </div>
                  <div className="profile-field">
                    <label>Email:</label>
                    <span>{selectedStudent.email}</span>
                  </div>
                  <div className="profile-field">
                    <label>Department:</label>
                    <span>{selectedStudent.department}</span>
                  </div>
                  <div className="profile-field">
                    <label>Phone:</label>
                    <span>{selectedStudent.phone || "N/A"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ManageProfiles;

