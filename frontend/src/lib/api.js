export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Set token in localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Get user info from localStorage
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Set user info in localStorage
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove user info from localStorage
export const removeUser = () => {
  localStorage.removeItem('user');
};

// API request helper with authentication
export const apiRequest = async (url, options = {}) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${url}`, config);
  
  if (response.status === 401) {
    // Token expired or invalid, redirect to login
    removeToken();
    removeUser();
    window.location.href = '/';
    return;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Auth API calls
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/profile');
  },
};

// Data API calls
export const dataAPI = {
  // Users (Students, Faculty, Admins)
  getUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/users${queryString ? '?' + queryString : ''}`);
  },
  getUser: (id) => apiRequest(`/users/${id}`),
  createUser: (user) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(user),
  }),
  updateUser: (id, user) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  }),
  deleteUser: (id) => apiRequest(`/users/${id}`, { method: 'DELETE' }),
  getDashboardStats: () => apiRequest('/users/stats/dashboard'),

  // Departments
  getDepartments: () => apiRequest('/departments'),
  getDepartment: (id) => apiRequest(`/departments/${id}`),
  createDepartment: (department) => apiRequest('/departments', {
    method: 'POST',
    body: JSON.stringify(department),
  }),
  updateDepartment: (id, department) => apiRequest(`/departments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(department),
  }),
  deleteDepartment: (id) => apiRequest(`/departments/${id}`, { method: 'DELETE' }),
  getDepartmentSubjects: (id) => apiRequest(`/departments/${id}/subjects`),

  // Subjects
  getSubjects: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/subjects${queryString ? '?' + queryString : ''}`);
  },
  getSubject: (id) => apiRequest(`/subjects/${id}`),
  createSubject: (subject) => apiRequest('/subjects', {
    method: 'POST',
    body: JSON.stringify(subject),
  }),
  updateSubject: (id, subject) => apiRequest(`/subjects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(subject),
  }),
  deleteSubject: (id) => apiRequest(`/subjects/${id}`, { method: 'DELETE' }),
  getFacultySubjects: (facultyId) => apiRequest(`/subjects/faculty/${facultyId}`),

  // Attendance
  getAttendance: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/attendance${queryString ? '?' + queryString : ''}`);
  },
  getAttendanceRecord: (id) => apiRequest(`/attendance/${id}`),
  createAttendance: (attendance) => apiRequest('/attendance', {
    method: 'POST',
    body: JSON.stringify(attendance),
  }),
  markAttendance: (attendance) => apiRequest('/attendance', {
    method: 'POST',
    body: JSON.stringify(attendance),
  }),
  updateAttendance: (id, attendance) => apiRequest(`/attendance/${id}`, {
    method: 'PUT',
    body: JSON.stringify(attendance),
  }),
  deleteAttendance: (id) => apiRequest(`/attendance/${id}`, { method: 'DELETE' }),
  getAttendanceStats: (params = '') => apiRequest(`/attendance/stats/summary${params ? '?' + params : ''}`),

  // Scores
  getScores: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/scores${queryString ? '?' + queryString : ''}`);
  },
  getScore: (id) => apiRequest(`/scores/${id}`),
  createScore: (score) => apiRequest('/scores', {
    method: 'POST',
    body: JSON.stringify(score),
  }),
  addScore: (score) => apiRequest('/scores', {
    method: 'POST',
    body: JSON.stringify(score),
  }),
  updateScore: (id, score) => apiRequest(`/scores/${id}`, {
    method: 'PUT',
    body: JSON.stringify(score),
  }),
  deleteScore: (id) => apiRequest(`/scores/${id}`, { method: 'DELETE' }),
  getScoreStats: (params = '') => apiRequest(`/scores/stats/summary${params ? '?' + params : ''}`),
  getStudentPerformance: (studentId, params = '') => apiRequest(`/scores/student/${studentId}/performance${params ? '?' + params : ''}`),
};
