import api from './api';
import { API_ENDPOINTS, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from '@/config/api';

/**
 * Get all stock items with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.pageNumber - Page number (default 0)
 * @param {number} params.pageSize - Page size (default 10)
 * @returns {Promise<Object>} Paginated stock items
 */
export const getStock = async (params = {}) => {
  try {
    const queryParams = {
      'page-number': params.pageNumber ?? DEFAULT_PAGE_NUMBER,
      'page-size': params.pageSize ?? DEFAULT_PAGE_SIZE,
    };
    
    const response = await api.get(API_ENDPOINTS.STOCK, { params: queryParams });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Get stock item by ID
 * @param {number} id - Stock item ID
 * @returns {Promise<Object>} Stock item details
 */
export const getStockById = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.STOCK_BY_ID(id));
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Create new stock item
 * @param {Object} stockData - Stock item data
 * @param {string} stockData.codigo - Item code (max 5 chars)
 * @param {string} stockData.nome - Item name
 * @param {string} stockData.categoria - Category
 * @param {number} stockData.quantidade - Quantity (min 0)
 * @param {string} stockData.unidade - Unit of measurement
 * @param {number} stockData.precoUnitario - Unit price (min 0)
 * @param {string} stockData.fornecedor - Supplier
 * @param {string} stockData.dataEntrada - Entry date (YYYY-MM-DD, cannot be future)
 * @param {string} stockData.dataValidade - Expiration date (YYYY-MM-DD, cannot be past)
 * @param {string} stockData.localizacao - Location
 * @param {string} stockData.status - Status (DISPONIVEL, INDISPONIVEL, etc.)
 * @param {string} stockData.descricao - Description
 * @returns {Promise<Object>} Created stock item
 */
export const createStock = async (stockData) => {
  try {
    const response = await api.post(API_ENDPOINTS.STOCK, stockData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Update stock item
 * @param {number} id - Stock item ID
 * @param {Object} stockData - Stock item data to update
 * @returns {Promise<Object>} Updated stock item
 */
export const updateStock = async (id, stockData) => {
  try {
    const response = await api.put(API_ENDPOINTS.STOCK_BY_ID(id), stockData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Delete stock item
 * @param {number} id - Stock item ID
 * @returns {Promise<void>}
 */
export const deleteStock = async (id) => {
  try {
    await api.delete(API_ENDPOINTS.STOCK_BY_ID(id));
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
    
    // Tratamento específico de erros de estoque
    switch (status) {
      case 400:
        return new Error(data.message || 'Dados inválidos. Verifique os campos obrigatórios.');
      case 404:
        return new Error('Item de estoque não encontrado');
      case 409:
        return new Error('Código de item já existe');
      default:
        return new Error(data.message || `Erro ${status}`);
    }
  } else if (error.request) {
    return new Error('Não foi possível conectar ao servidor');
  } else {
    return new Error('Erro ao processar requisição');
  }
};
