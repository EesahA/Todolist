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
  },

  // Validate token
  validateToken: async () => {
    try {
      const response = await apiClient.get('/users/me');
      return { success: true, data: { user: response.data } };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  },

  // Update user
  updateUser: async (userData) => {
    try {
      const response = await apiClient.put('/users/me', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.post('/users/change-password', passwordData);
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
export const getAllTasks = (viewMode = 'team') => {
  return apiClient.get(`/tasks?viewMode=${viewMode}`);
};
export const getTaskById = (id) => apiClient.get(`/tasks/${id}`);
export const createTask = (taskData) => apiClient.post('/tasks', taskData);
export const updateTask = (id, taskData) => apiClient.put(`/tasks/${id}`, taskData);
export const deleteTask = async (id) => {
  try {
    console.log('Sending delete request for task:', id);
    const token = localStorage.getItem('token');
    console.log('Auth token present:', !!token);
    
    const response = await apiClient.delete(`/tasks/${id}`);
    console.log('Delete response:', response);
    
    if (response.status !== 200) {
      throw new Error(`Server returned status ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('Delete request failed:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
      details: error.toString()
    });
    
    // Throw a more informative error
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'Failed to delete task'
    );
  }
};
export const updateTaskStatus = (id, status) => apiClient.patch(`/tasks/${id}/status`, { status });
export const addCommentToTask = (id, content) => apiClient.post(`/tasks/${id}/comments`, { content });

export default apiClient; 