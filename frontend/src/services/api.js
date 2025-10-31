import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased to better accommodate analytics computations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

export const energyAPI = {
  // Get all energy data
  getAllEnergy: () => api.get('/api/v1/energy'),
  
  // Get energy by installation
  getEnergyByInstallation: (installationId) => 
    api.get(`/api/v1/energy/installation/${installationId}`),
  
  // Get all installations with pagination
  getInstallations: (params) => api.get('/api/v1/energy/installations', { params }),
  
  // Get energy summary
  getEnergySummary: () => api.get('/api/v1/energy/stats/summary'),
  
  // Aggregate energy data
  aggregateEnergy: (params) => api.get('/api/v1/energy/aggregate', { params }),
  
  // Get today's energy data
  getTodayEnergy: () => api.get('/api/v1/energy/today'),
  
  // Get leaderboard
  getLeaderboard: (params) => api.get('/api/v1/energy/leaderboard', { params }),
  
  // Get performance metrics
  getPerformanceMetrics: (params) => 
    api.get('/api/v1/performance/metrics', { params }),
  
  // Get map installations
  getMapInstallations: () => api.get('/api/v1/map/installations'),
  
  // Get map installations (lightweight)
  getMapInstallationsMini: () => api.get('/api/v1/map/installations_mini'),
  
  // Health check
  healthCheck: () => api.get('/health'),
  
  // Generate solar data
  generateData: (data) => api.post('/api/v1/generate-data', data),
  
  // Generate installations
  generateInstallations: (data) => api.post('/api/v1/generate-installations', data),
};

export default api;

