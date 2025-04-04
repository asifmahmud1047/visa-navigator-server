import { API_BASE_URL, getHeaders } from './api.config';

export const visaService = {
  // Get all visas
  getAllVisas: async (limit = 6) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/visas?limit=${limit}`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch visas:', error);
      throw error;
    }
  },

  // Get single visa
  getVisaById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/visas/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch visa:', error);
      throw error;
    }
  },

  // Get user's visas
  getUserVisas: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/visas/user/visas`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user visas:', error);
      throw error;
    }
  }
}; 