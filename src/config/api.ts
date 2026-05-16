// src/config/api.ts
export const API_URL = import.meta.env.VITE_API_URL || 'https://opentech-business.onrender.com';

console.log("🌐 API_URL configurée:", API_URL);

export default API_URL;