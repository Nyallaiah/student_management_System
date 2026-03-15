import { useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { studentAPI } from "../../api/axios";
import "../../styles/AddStudent.css";

function AddStudent() {
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    email: "",
    department: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [credentials, setCredentials] = useState(null);

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Student name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = "Roll number is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setCredentials(null);

    try {
      // Try API call first
      const response = await studentAPI.create(formData);
      
      if (response.data.success) {
        setMessage({ type: "success", text: "Student Added Successfully! ✅" });
        
        // Check if credentials are returned
        if (response.data.credentials) {
          setCredentials(response.data.credentials);
        }
        
        // Reset form
        setFormData({
          name: "",
          rollNumber: "",
          email: "",
          department: "",
          phone: "",
        });
      }
    } catch (error) {
      // Show actual error message
      console.error("Error adding student:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to add student";
      setMessage({ type: "error", text: `Error: ${errorMsg}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="add-student-container">
        <div className="add-student-card">
          <h2>Add New Student</h2>

          {/* Success/Error Message */}
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          {/* Credentials Display */}
          {credentials && (
            <div style={{ 
              marginBottom: "20px", 
              padding: "15px", 
              background: "#dcfce7", 
              borderRadius: "8px",
              border: "1px solid #86efac"
            }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#166534" }}>📋 Student Login Credentials</h4>
              <p style={{ margin: "5px 0", color: "#166534", fontSize: "14px" }}>
                <strong>Email:</strong> {credentials.email}
              </p>
              <p style={{ margin: "5px 0", color: "#166534", fontSize: "14px" }}>
                <strong>Temporary Password:</strong> {credentials.temp_password}
              </p>
              <p style={{ margin: "10px 0 0 0", color: "#166534", fontSize: "13px", fontStyle: "italic" }}>
                Share these credentials with the student. They can set their own password using the "Sign Up" link on the login page.
              </p>
            </div>
          )}

          <form className="add-student-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Student Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter student name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "error-input" : ""}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Roll Number *</label>
              <input
                type="text"
                name="rollNumber"
                placeholder="Enter roll number"
                value={formData.rollNumber}
                onChange={handleChange}
                className={errors.rollNumber ? "error-input" : ""}
              />
              {errors.rollNumber && <span className="error-text">{errors.rollNumber}</span>}
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error-input" : ""}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Department *</label>
              <input
                type="text"
                name="department"
                placeholder="Enter department"
                value={formData.department}
                onChange={handleChange}
                className={errors.department ? "error-input" : ""}
              />
              {errors.department && <span className="error-text">{errors.department}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? "error-input" : ""}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <button type="submit" className="add-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Student"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AddStudent;

