import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  signup: (data) => api.post("/auth/signup", data),
};

// Student API calls
export const studentAPI = {
  getAll: () => api.get("/students"),
  getById: (id) => api.get(`/students/${id}`),
  getMe: () => api.get("/students/me"),
  create: (data) => api.post("/students", data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  getMarks: (studentId) => api.get(`/students/${studentId}/marks`),
  getStudentMarks: () => api.get("/students/me/marks"),
  saveMarks: (studentId, marks) => api.post(`/students/${studentId}/marks`, { marks }),
};

