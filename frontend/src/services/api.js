import axios from 'axios';

// When deploying, we will use an environment variable for the backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ai-investment-research-agent-94da.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout since AI analysis can take time
});

export const analyzeCompany = async (companyName) => {
  try {
    const response = await apiClient.post('/analyze', { company: companyName });
    return response.data;
  } catch (error) {
    // Standardize the error format for the frontend components
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else if (error.request) {
      throw new Error('Network error. Could not connect to the server.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
};

export const fetchHistory = async () => {
  try {
    const response = await apiClient.get('/history');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return [];
  }
};

export const deleteHistory = async (id) => {
  try {
    const response = await apiClient.delete(`/history/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete history:', error);
    throw error;
  }
};
