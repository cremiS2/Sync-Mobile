import api from './api';
import { API_ENDPOINTS, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from '@/config/api';

/**
 * Get all departments with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.pageNumber - Page number (default 0)
 * @param {number} params.pageSize - Page size (default 10)
 * @param {string} params.departmentName - Filter by department name
 * @param {string} params.statusDepartment - Filter by status
 * @param {number} params.departmentBudget - Filter by budget
 * @returns {Promise<Array>}
 */
export const getDepartments = async (params = {}) => {
  try {
    const queryParams = {
      'page-number': params.pageNumber ?? DEFAULT_PAGE_NUMBER,
      'page-size': params.pageSize ?? DEFAULT_PAGE_SIZE,
    };
    
    if (params.departmentName) queryParams['department-name'] = params.departmentName;
    if (params.statusDepartment) queryParams['status-department'] = params.statusDepartment;
    if (params.departmentBudget) queryParams['department-budget'] = params.departmentBudget;
    
    const response = await api.get(API_ENDPOINTS.DEPARTMENTS, {
      params: queryParams,
      // Permitir que algumas telas (como Perfil) tratem 401 sem derrubar a sessão
      skipAuthLogout: true,
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Get department by ID
 * @param {number} id - Department ID
 * @returns {Promise<Object>}
 */
export const getDepartmentById = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.DEPARTMENT_BY_ID(id));
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Create new department
 * @param {Object} departmentData - Department data
 * @param {string} departmentData.name - Department name
 * @param {string} departmentData.description - Description
 * @param {string} departmentData.location - Location
 * @param {number} departmentData.budget - Budget
 * @param {string} departmentData.status - Status (ATIVO, INATIVO)
 * @returns {Promise<Object>}
 */
export const createDepartment = async (departmentData) => {
  try {
    const response = await api.post(API_ENDPOINTS.DEPARTMENTS, departmentData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Update department
 * @param {number} id - Department ID
 * @param {Object} departmentData - Department data to update
 * @returns {Promise<Object>}
 */
export const updateDepartment = async (id, departmentData) => {
  try {
    const response = await api.put(API_ENDPOINTS.DEPARTMENT_BY_ID(id), departmentData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Delete department
 * @param {number} id - Department ID
 * @returns {Promise<void>}
 */
export const deleteDepartment = async (id) => {
  try {
    await api.delete(API_ENDPOINTS.DEPARTMENT_BY_ID(id));
  } catch (error) {
    throw handleError(error);
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
      return new Error('Recurso não encontrado.');
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
