export const API_BASE_URL = 'https://visa-navigator-server-beta-dun.vercel.app';

export const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
}; 