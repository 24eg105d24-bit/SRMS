import api from './api';

export const studentService = {
  // Fetch all students (with optional rollNumber search filter)
  getAll: async (rollNumber = '') => {
    const params = rollNumber ? { rollNumber: rollNumber.trim() } : {};
    const response = await api.get('/students', { params });
    return response.data;
  },

  // Get student by ID
  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  // Search specifically by roll number
  searchByRollNumber: async (rollNumber) => {
    const response = await api.get('/students/search', {
      params: { rollNumber: rollNumber.trim() },
    });
    return response.data;
  },

  // Create new student
  create: async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },

  // Update existing student
  update: async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },

  // Delete student
  delete: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  // Get total student count
  getCount: async () => {
    const response = await api.get('/students/count');
    return response.data.totalStudents;
  },

  // Get comprehensive dashboard statistics
  getStats: async () => {
    const response = await api.get('/students/stats');
    return response.data;
  },
};
