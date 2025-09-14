import axios from "axios"

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"
// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("pmis-auth-token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("pmis-auth-token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// API Services
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  refreshToken: () => api.post("/auth/refresh"),
}

export const candidatesAPI = {
  getProfile: () => api.get("/candidates/profile"),
  updateProfile: (data) => api.put("/candidates/profile", data),
  uploadResume: (formData) =>
    api.post("/candidates/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getApplications: () => api.get("/candidates/applications"),
  applyToInternship: (internshipId, data) => api.post(`/candidates/apply/${internshipId}`, data),
}

export const internshipsAPI = {
  getAll: (params) => api.get("/internships", { params }),
  getById: (id) => api.get(`/internships/${id}`),
  search: (query) => api.get("/internships/search", { params: query }),
  getCategories: () => api.get("/internships/categories"),
}

export const recommendationsAPI = {
  getRecommendations: (candidateId) => api.get(`/recommendations/${candidateId}`),
  getBatchRecommendations: (candidateIds) => api.post("/recommendations/batch", { candidateIds }),
  getAnalytics: () => api.get("/recommendations/analytics"),
}

export const applicationsAPI = {
  getAll: (params) => api.get("/applications", { params }),
  getById: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, status, feedback) => api.put(`/applications/${id}/status`, { status, feedback }),
  bulkUpdate: (updates) => api.put("/applications/bulk-update", { updates }),
}

export const notificationsAPI = {
  getAll: () => api.get("/notifications"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  getPreferences: () => api.get("/notifications/preferences"),
  updatePreferences: (preferences) => api.put("/notifications/preferences", preferences),
}

export const mlAPI = {
  trainModel: (modelType) => api.post(`/ml/train/${modelType}`),
  getModelStatus: () => api.get("/ml/status"),
  getPredictions: (data) => api.post("/ml/predict", data),
  getModelMetrics: () => api.get("/ml/metrics"),
}

export default api
