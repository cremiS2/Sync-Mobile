import api, { getAuthToken } from './api';
import { API_ENDPOINTS, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from '@/config/api';

/**
 * Get all users with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.pageNumber - Page number (default 0)
 * @param {number} params.pageSize - Page size (default 10)
 * @param {string} params.email - Filter by email
 * @returns {Promise<Object>}
 */
export const getUsers = async (params = {}) => {
  try {
    const queryParams = {
      'page-number': params.pageNumber ?? DEFAULT_PAGE_NUMBER,
      'page-size': params.pageSize ?? DEFAULT_PAGE_SIZE,
    };
    
    if (params.email) queryParams['email'] = params.email;
    
    const response = await api.get(API_ENDPOINTS.USERS, {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>}
 */
export const getUserById = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.USER_BY_ID(id));
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Get current user (from token)
 * @returns {Promise<Object>}
 */
export const getCurrentUser = async () => {
  try {
    // Primeiro, buscar todos os usuários e encontrar o usuário atual pelo token
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Token não encontrado');
    }
    
    // Decodificar o token para pegar o email
    const payload = decodeJWT(token);
    if (!payload) {
      throw new Error('Token inválido');
    }
    
    const userEmail = payload.sub || payload.email;
    if (!userEmail) {
      throw new Error('Email não encontrado no token');
    }
    
    // Buscar usuários e encontrar o que corresponde ao email
    const usersResponse = await getUsers({ pageSize: 1000, pageNumber: 0 });
    const users = usersResponse.content || usersResponse || [];
    const currentUser = users.find(u => u.email === userEmail);
    
    if (!currentUser) {
      throw new Error('Usuário não encontrado');
    }
    
    return currentUser;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Update user
 * @param {number} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>}
 */
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(API_ENDPOINTS.USER_BY_ID(id), userData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Delete user
 * @param {number} id - User ID
 * @returns {Promise<void>}
 */
export const deleteUser = async (id) => {
  try {
    await api.delete(API_ENDPOINTS.USER_BY_ID(id));
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Decode JWT token
 * @param {string} token - JWT token
 * @returns {Object|null}
 */
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Usar Buffer se disponível (React Native com polyfill) ou atob (web)
    let decoded;
    if (typeof Buffer !== 'undefined') {
      decoded = Buffer.from(base64, 'base64').toString('utf-8');
    } else if (typeof atob !== 'undefined') {
      decoded = atob(base64);
    } else {
      // Fallback manual para React Native puro
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      let str = '';
      let i = 0;
      while (i < base64.length) {
        const enc1 = chars.indexOf(base64.charAt(i++));
        const enc2 = chars.indexOf(base64.charAt(i++));
        const enc3 = chars.indexOf(base64.charAt(i++));
        const enc4 = chars.indexOf(base64.charAt(i++));
        const chr1 = (enc1 << 2) | (enc2 >> 4);
        const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        const chr3 = ((enc3 & 3) << 6) | enc4;
        str += String.fromCharCode(chr1);
        if (enc3 !== 64) str += String.fromCharCode(chr2);
        if (enc4 !== 64) str += String.fromCharCode(chr3);
      }
      decoded = str;
    }
    
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
};


/**
 * Handle API errors
 * @param {Error} error - Error object
 * @returns {Error}
 */
const handleError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    console.error('API Error Response:', { status, data });
    
    // Handle specific error codes
    if (status === 500) {
      return new Error('Erro interno do servidor. Por favor, contate o administrador do sistema.');
    } else if (status === 404) {
      return new Error('Usuário não encontrado.');
    } else if (status === 401 || status === 403) {
      return new Error('Acesso não autorizado.');
    }
    
    return new Error(data.menssagem || data.message || `Erro ${status}`);
  } else if (error.request) {
    console.error('Network Error:', error.request);
    return new Error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
  } else {
    console.error('Request Error:', error.message);
    return new Error('Erro ao processar requisição: ' + error.message);
  }
};

