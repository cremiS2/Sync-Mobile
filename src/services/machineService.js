import api from './api';
import { API_ENDPOINTS, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from '@/config/api';

/**
 * Get all machines with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.pageNumber - Page number (default 0)
 * @param {number} params.pageSize - Page size (default 10)
 * @param {string} params.machineName - Filter by machine name
 * @param {string} params.sectorName - Filter by sector name
 * @param {string} params.statusMachine - Filter by status
 * @returns {Promise<Array>}
 */
export const getMachines = async (params = {}) => {
  try {
    const queryParams = {
      'page-number': params.pageNumber ?? DEFAULT_PAGE_NUMBER,
      'page-size': params.pageSize ?? DEFAULT_PAGE_SIZE,
    };
    
    if (params.machineName) queryParams['machine-name'] = params.machineName;
    if (params.sectorName) queryParams['sector-name'] = params.sectorName;
    if (params.statusMachine) queryParams['status-machine'] = params.statusMachine;
    
    const response = await api.get(API_ENDPOINTS.MACHINES, { params: queryParams });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Get machine by ID
 * @param {number} id - Machine ID
 * @returns {Promise<Object>}
 */
export const getMachineById = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.MACHINE_BY_ID(id));
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Create new machine
 * @param {Object} machineData - Machine data
 * @param {string} machineData.name - Machine name
 * @param {number} machineData.sector - Sector ID
 * @param {string} machineData.status - Status (OPERANDO, MANUTENCAO, PARADA)
 * @param {number} machineData.oee - OEE percentage (0-1)
 * @param {number} machineData.throughput - Throughput
 * @param {string} machineData.lastMaintenance - Last maintenance date (YYYY-MM-DD)
 * @param {string} machineData.photo - Photo URL
 * @param {number} machineData.serieNumber - Serial number
 * @param {number} machineData.machineModel - Machine model ID
 * @returns {Promise<Object>}
 */
export const createMachine = async (machineData) => {
  try {
    const response = await api.post(API_ENDPOINTS.MACHINES, machineData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Update machine
 * @param {number} id - Machine ID
 * @param {Object} machineData - Machine data to update
 * @returns {Promise<Object>}
 */
export const updateMachine = async (id, machineData) => {
  try {
    const response = await api.put(API_ENDPOINTS.MACHINE_BY_ID(id), machineData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Delete machine
 * @param {number} id - Machine ID
 * @returns {Promise<void>}
 */
export const deleteMachine = async (id) => {
  try {
    await api.delete(API_ENDPOINTS.MACHINE_BY_ID(id));
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
