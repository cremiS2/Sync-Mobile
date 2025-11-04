import api from './api';
import { API_ENDPOINTS, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from '@/config/api';

/**
 * Get all sectors with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.pageNumber - Page number (default 0)
 * @param {number} params.pageSize - Page size (default 10)
 * @param {string} params.departmentName - Filter by department name
 * @param {string} params.sectorName - Filter by sector name
 * @returns {Promise<Array>}
 */
export const getSectors = async (params = {}) => {
  try {
    const queryParams = {
      'page-number': params.pageNumber ?? DEFAULT_PAGE_NUMBER,
      'page-size': params.pageSize ?? DEFAULT_PAGE_SIZE,
    };
    
    if (params.departmentName) queryParams['department-name'] = params.departmentName;
    if (params.sectorName) queryParams['sector-name'] = params.sectorName;
    
    const response = await api.get(API_ENDPOINTS.SECTORS, { params: queryParams });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Get sector by ID
 * @param {number} id - Sector ID
 * @returns {Promise<Object>}
 */
export const getSectorById = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.SECTOR_BY_ID(id));
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Create new sector
 * @param {Object} sectorData - Sector data
 * @param {string} sectorData.name - Sector name
 * @param {number} sectorData.efficiency - Efficiency (0-1)
 * @param {number} sectorData.department - Department ID
 * @param {number} sectorData.maximumQuantEmployee - Maximum quantity of employees
 * @returns {Promise<Object>}
 */
export const createSector = async (sectorData) => {
  try {
    const response = await api.post(API_ENDPOINTS.SECTORS, sectorData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Update sector
 * @param {number} id - Sector ID
 * @param {Object} sectorData - Sector data to update
 * @returns {Promise<Object>}
 */
export const updateSector = async (id, sectorData) => {
  try {
    const response = await api.put(API_ENDPOINTS.SECTOR_BY_ID(id), sectorData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Delete sector
 * @param {number} id - Sector ID
 * @returns {Promise<void>}
 */
export const deleteSector = async (id) => {
  try {
    await api.delete(API_ENDPOINTS.SECTOR_BY_ID(id));
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
