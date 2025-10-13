import api from './api';
import { API_ENDPOINTS, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from '../config/api';

/**
 * Get all employees with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.pageNumber - Page number (default 0)
 * @param {number} params.pageSize - Page size (default 10)
 * @param {string} params.employeeName - Filter by employee name
 * @param {number} params.employeeId - Filter by employee ID
 * @param {string} params.shift - Filter by shift (MANHA, TARDE, NOITE)
 * @param {string} params.sectorName - Filter by sector name
 * @returns {Promise<Array>}
 */
export const getEmployees = async (params = {}) => {
  try {
    const queryParams = {
      'page-number': params.pageNumber ?? DEFAULT_PAGE_NUMBER,
      'page-size': params.pageSize ?? DEFAULT_PAGE_SIZE,
    };
    
    if (params.employeeName) queryParams['employee-name'] = params.employeeName;
    if (params.employeeId) queryParams['employee-id'] = params.employeeId;
    if (params.shift) queryParams['shift'] = params.shift;
    if (params.sectorName) queryParams['sector-name'] = params.sectorName;
    
    const response = await api.get(API_ENDPOINTS.EMPLOYEES, { params: queryParams });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Get employee by ID
 * @param {number} id - Employee ID
 * @returns {Promise<Object>}
 */
export const getEmployeeById = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.EMPLOYEE_BY_ID(id));
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Create new employee
 * @param {Object} employeeData - Employee data
 * @param {string} employeeData.name - Employee name
 * @param {number} employeeData.employeeID - Employee ID number
 * @param {number} employeeData.sector - Sector ID
 * @param {string} employeeData.shift - Shift (MANHA, TARDE, NOITE)
 * @param {string} employeeData.status - Status (ATIVO, INATIVO, FERIAS)
 * @param {string} employeeData.photo - Photo URL
 * @param {number} employeeData.user - User ID
 * @param {boolean} employeeData.availability - Availability
 * @returns {Promise<Object>}
 */
export const createEmployee = async (employeeData) => {
  try {
    const response = await api.post(API_ENDPOINTS.EMPLOYEES, employeeData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Update employee
 * @param {number} id - Employee ID
 * @param {Object} employeeData - Employee data to update
 * @returns {Promise<Object>}
 */
export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await api.put(API_ENDPOINTS.EMPLOYEE_BY_ID(id), employeeData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Delete employee
 * @param {number} id - Employee ID
 * @returns {Promise<void>}
 */
export const deleteEmployee = async (id) => {
  try {
    await api.delete(API_ENDPOINTS.EMPLOYEE_BY_ID(id));
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
