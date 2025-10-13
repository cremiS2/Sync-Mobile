import api from './api';
import { API_ENDPOINTS, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from '../config/api';

/**
 * Get all machine models with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.numeroPagina - Page number (default 0)
 * @param {number} params.tamanhoPagina - Page size (default 10)
 * @returns {Promise<Array>}
 */
export const getMachineModels = async (params = {}) => {
  try {
    const queryParams = {
      'numero-pagina': params.numeroPagina ?? DEFAULT_PAGE_NUMBER,
      'tamanho-pagina': params.tamanhoPagina ?? DEFAULT_PAGE_SIZE,
    };

    const response = await api.get(API_ENDPOINTS.MACHINE_MODELS, { params: queryParams });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Get machine model by ID
 * @param {number} id - Machine model ID
 * @returns {Promise<Object>}
 */
export const getMachineModelById = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.MACHINE_MODEL_BY_ID(id));
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Create new machine model
 * @param {Object} machineModelData - Machine model data
 * @param {string} machineModelData.modelName - Model name
 * @param {string} machineModelData.modelDescription - Model description
 * @returns {Promise<Object>}
 */
export const createMachineModel = async (machineModelData) => {
  try {
    const response = await api.post(API_ENDPOINTS.MACHINE_MODELS, machineModelData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Update machine model
 * @param {number} id - Machine model ID
 * @param {Object} machineModelData - Machine model data to update
 * @returns {Promise<Object>}
 */
export const updateMachineModel = async (id, machineModelData) => {
  try {
    const response = await api.put(API_ENDPOINTS.MACHINE_MODEL_BY_ID(id), machineModelData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Delete machine model
 * @param {number} id - Machine model ID
 * @returns {Promise<void>}
 */
export const deleteMachineModel = async (id) => {
  try {
    await api.delete(API_ENDPOINTS.MACHINE_MODEL_BY_ID(id));
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