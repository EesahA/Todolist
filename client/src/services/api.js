import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5003/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  // Register user
  register: async (userData) => {
    try {
      console.log('Sending registration request to:', '/api/users/register');
      console.log('User data:', userData);
      const response = await apiClient.post('/users/register', userData);
      console.log('Registration response:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/users/login', credentials);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }
};

// Tasks API
export const getAllTasks = () => apiClient.get('/tasks');
export const getTaskById = (id) => apiClient.get(`/tasks/${id}`);
export const createTask = (taskData) => apiClient.post('/tasks', taskData);
export const updateTask = (id, taskData) => apiClient.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => apiClient.delete(`/tasks/${id}`);
export const updateTaskStatus = (id, status) => apiClient.patch(`/tasks/${id}/status`, { status });
export const addCommentToTask = (id, content) => apiClient.post(`/tasks/${id}/comments`, { content });

export default apiClient; 