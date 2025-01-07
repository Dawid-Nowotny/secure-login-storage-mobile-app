import axios from 'axios';
import { getRefreshToken, setTokens, clearTokens } from './secureStorage';
import { refreshToken } from './api';

const axiosInstance = axios.create({
  baseURL: 'http://10.0.2.2:8000/api',
});

axiosInstance.interceptors.response.use(
    response => response, 
    async error => {
      const originalRequest = error.config;
  
      if (error.response?.status === 500 && !originalRequest._retry) {
        originalRequest._retry = true; 
        try {
          const refreshTokenValue = await getRefreshToken();
          if (!refreshTokenValue) {
            await clearTokens(); 
            return Promise.reject(new Error("No refresh token available"));
          }

          const newAccessToken = await refreshToken(refreshTokenValue); 
          await setTokens(newAccessToken, refreshTokenValue); 
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; 
          
          return axiosInstance(originalRequest); 
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          await clearTokens(); 
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
  
  

export default axiosInstance;