import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include authorization token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API service functions for models
export const modelService = {
  // Get all models
  getModels: async (filters = {}) => {
    try {
      const response = await api.get('/models', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single model by ID
  getModelById: async (id) => {
    try {
      const response = await api.get(`/models/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get similar models
  getSimilarModels: async (id) => {
    try {
      const response = await api.get(`/models/${id}/similar`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// API service functions for blogs
export const blogService = {
  // Get all blogs
  getBlogs: async () => {
    try {
      const response = await api.get('/blogs');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get blog by model ID
  getBlogByModelId: async (modelId) => {
    try {
      const response = await api.get(`/blogs/model/${modelId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Generate blog for a model
  generateBlog: async (modelId) => {
    try {
      const response = await api.post(`/blogs/generate/${modelId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Regenerate audio for a blog
  regenerateAudio: async (blogId) => {
    try {
      const response = await api.post(`/blogs/${blogId}/regenerate-audio`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// API service functions for user authentication
export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      
      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login a user
  login: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      
      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout the current user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get the current authenticated user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Update user preferences
  updatePreferences: async (userId, preferences) => {
    try {
      const response = await api.put('/users/preferences', { userId, preferences });
      
      // Update user in localStorage
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default {
  modelService,
  blogService,
  authService,
}; 