import api from './api';
import { API_ENDPOINTS, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from '../config/api';

/**
 * Get all allocations with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.pageSize - Page size (default 10)
 * @param {number} params.pageNumber - Page number (default 0)
 * @param {string} params.nameEmployee - Filter by employee name
 * @param {string} params.nameEmployeeChanged - Filter by changed employee name
 * @returns {Promise<Array>}
 */
export const getAllocations = async (params = {}) => {
  try {
    const queryParams = {
      'page-size': params.pageSize ?? DEFAULT_PAGE_SIZE,
      'page-number': params.pageNumber ?? DEFAULT_PAGE_NUMBER,
    };

    if (params.nameEmployee) queryParams['name-employee'] = params.nameEmployee;
    if (params.nameEmployeeChanged) queryParams['name-employee-changed'] = params.nameEmployeeChanged;

    const response = await api.get(API_ENDPOINTS.ALLOCATIONS, { params: queryParams });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Create new allocation
 * @param {Object} allocationData - Allocation data
 * @param {number} allocationData.employee - Employee ID
 * @param {number} allocationData.machine - Machine ID
 * @returns {Promise<Object>}
 */
export const createAllocation = async (allocationData) => {
  try {
    const response = await api.post(API_ENDPOINTS.ALLOCATIONS, allocationData);
    return response.data;
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
    return new Error(data.menssagem || `Erro ${status}`);
  } else if (error.request) {
    return new Error('Não foi possível conectar ao servidor');
  } else {
    return new Error('Erro ao processar requisição');
  }
};