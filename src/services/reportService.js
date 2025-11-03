import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { Platform, Linking } from 'react-native';

/**
 * Download and share a PDF report
 * Para usar com expo-file-system e expo-sharing, instale:
 * npm install expo-file-system expo-sharing
 * 
 * @param {string} endpoint - API endpoint for the report
 * @param {string} filename - Filename for the downloaded PDF
 * @returns {Promise<void>}
 */
const downloadAndSharePDF = async (endpoint, filename) => {
  try {
    // Para React Native com Expo File System (instale as dependências primeiro)
    // const FileSystem = require('expo-file-system');
    // const Sharing = require('expo-sharing');
    
    // Para Web: abre em nova aba
    if (Platform.OS === 'web') {
      const token = await require('./api').getAuthToken();
      const url = `${require('../config/api').API_BASE_URL}${endpoint}`;
      
      // Abre em nova aba com token no header (pode não funcionar por CORS)
      window.open(url, '_blank');
      return;
    }
    
    // Para mobile sem expo-file-system: use linking para abrir no navegador
    const token = await require('./api').getAuthToken();
    const url = `${require('../config/api').API_BASE_URL}${endpoint}?token=${token}`;
    
    await Linking.openURL(url);
    
    // TODO: Implementar download nativo quando instalar expo-file-system
    console.warn('Para download nativo, instale: expo-file-system e expo-sharing');
    
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Generate and download general report (employees + machines)
 * @returns {Promise<void>}
 */
export const downloadGeneralReport = async () => {
  return downloadAndSharePDF(
    API_ENDPOINTS.REPORTS_GENERAL,
    'relatorio_geral.pdf'
  );
};

/**
 * Generate and download employees report
 * @returns {Promise<void>}
 */
export const downloadEmployeesReport = async () => {
  return downloadAndSharePDF(
    API_ENDPOINTS.REPORTS_EMPLOYEES,
    'relatorio_funcionarios.pdf'
  );
};

/**
 * Generate and download machines report
 * @returns {Promise<void>}
 */
export const downloadMachinesReport = async () => {
  return downloadAndSharePDF(
    API_ENDPOINTS.REPORTS_MACHINES,
    'relatorio_maquinas.pdf'
  );
};

/**
 * Generate and download employee report (alternative endpoint)
 * @returns {Promise<void>}
 */
export const downloadEmployeeReport = async () => {
  return downloadAndSharePDF(
    API_ENDPOINTS.EMPLOYEE_REPORT,
    'relatorio_funcionarios.pdf'
  );
};

/**
 * Generate and download machine report (alternative endpoint)
 * @returns {Promise<void>}
 */
export const downloadMachineReport = async () => {
  return downloadAndSharePDF(
    API_ENDPOINTS.MACHINE_REPORT,
    'relatorio_maquinas.pdf'
  );
};

/**
 * Get PDF report as blob (for web preview)
 * @param {string} endpoint - API endpoint for the report
 * @returns {Promise<Blob>}
 */
export const getReportBlob = async (endpoint) => {
  try {
    const response = await api.get(endpoint, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Open PDF report in browser (web only)
 * @param {string} endpoint - API endpoint for the report
 * @returns {Promise<void>}
 */
export const openReportInBrowser = async (endpoint) => {
  try {
    const blob = await getReportBlob(endpoint);
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
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
    
    switch (status) {
      case 401:
        return new Error('Não autorizado. Faça login novamente.');
      case 403:
        return new Error('Você não tem permissão para gerar relatórios');
      case 404:
        return new Error('Relatório não encontrado');
      case 500:
        return new Error('Erro ao gerar relatório. Tente novamente.');
      default:
        return new Error(data.message || `Erro ${status}`);
    }
  } else if (error.request) {
    return new Error('Não foi possível conectar ao servidor');
  } else {
    return new Error(error.message || 'Erro ao processar requisição');
  }
};
