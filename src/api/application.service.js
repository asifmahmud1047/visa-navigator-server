import { API_BASE_URL, getHeaders } from './api.config';

export const applicationService = {
  // Apply for visa
  applyForVisa: async (applicationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(applicationData)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to submit application:', error);
      throw error;
    }
  },

  // Get user's applications
  getUserApplications: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/my-applications`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      throw error;
    }
  },

  // Cancel application
  cancelApplication: async (applicationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/${applicationId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to cancel application:', error);
      throw error;
    }
  },

  // Search applications by country
  searchByCountry: async (country) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/search?country=${encodeURIComponent(country)}`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to search applications:', error);
      throw error;
    }
  }
}; 