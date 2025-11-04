import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token storage keys
const TOKEN_KEY = '@syncmob_token';
const TOKEN_EXP_KEY = '@syncmob_token_exp';

// Request interceptor to add JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      await clearAuthToken();
    }
    return Promise.reject(error);
  }
);

// Token management functions
export const saveAuthToken = async (token, expiresIn) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    const expirationTime = Date.now() + expiresIn * 1000;
    await AsyncStorage.setItem(TOKEN_EXP_KEY, expirationTime.toString());
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const expiration = await AsyncStorage.getItem(TOKEN_EXP_KEY);
    
    if (token && expiration) {
      const now = Date.now();
      if (now < parseInt(expiration)) {
        return token;
      } else {
        // Token expired
        await clearAuthToken();
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const clearAuthToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(TOKEN_EXP_KEY);
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};

export const isAuthenticated = async () => {
  const token = await getAuthToken();
  return !!token;
};

export default api;
