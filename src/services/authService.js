import api, { saveAuthToken, clearAuthToken } from './api';
import { API_ENDPOINTS } from '../config/api';

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{token: string, exp: number}>}
 */
export const login = async (email, password) => {
  try {
    const response = await api.post(API_ENDPOINTS.LOGIN, {
      email,
      password,
    });
    
    const { token, exp } = response.data;
    
    // exp vem em milissegundos (timestamp), calcular segundos até expiração
    const now = Date.now();
    const expiresInSeconds = Math.floor((exp - now) / 1000);
    
    // Save token to AsyncStorage
    await saveAuthToken(token, expiresInSeconds);
    
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Sign up new user
 * @param {Object} userData - User data
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {Array<string>} userData.roles - User roles (e.g., ["ADMIN", "GERENTE"])
 * @returns {Promise<void>}
 */
export const signUp = async (userData) => {
  try {
    const response = await api.post(API_ENDPOINTS.SIGN_IN, userData);
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  await clearAuthToken();
};

/**
 * Handle authentication errors
 * @param {Error} error - Error object
 * @returns {Error}
 */
const handleAuthError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return new Error(data.menssagem || 'Dados inválidos');
      case 401:
        return new Error('Email ou senha incorretos');
      case 403:
        return new Error('Acesso negado');
      case 404:
        return new Error('Usuário não encontrado');
      case 409:
        return new Error('Usuário já existe');
      default:
        return new Error(data.menssagem || 'Erro ao autenticar');
    }
  } else if (error.request) {
    return new Error('Não foi possível conectar ao servidor');
  } else {
    return new Error('Erro ao processar requisição');
  }
};
