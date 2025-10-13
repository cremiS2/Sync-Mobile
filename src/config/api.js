// API Configuration
// Change this to your backend URL

// Opções de backend
const BACKEND_OPTIONS = {
  LOCAL: 'http://localhost:8080',
  LOCAL_ANDROID_EMULATOR: 'http://10.0.2.2:8080',
  AZURE: 'https://sync-d8hac6hdg3czc4aa.brazilsouth-01.azurewebsites.net',
};

// ALTERE AQUI: Escolha qual backend usar
// Use 'LOCAL' para desenvolvimento local
// Use 'LOCAL_ANDROID_EMULATOR' para emulador Android
// Use 'AZURE' para produção (quando o site estiver ativo)
export const API_BASE_URL = BACKEND_OPTIONS.LOCAL;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/login',
  SIGN_IN: '/sign-in',
  
  // Users
  USERS: '/user',
  USER_BY_ID: (id) => `/user/${id}`,
  
  // Employees
  EMPLOYEES: '/employee',
  EMPLOYEE_BY_ID: (id) => `/employee/${id}`,
  
  // Machines
  MACHINES: '/machine',
  MACHINE_BY_ID: (id) => `/machine/${id}`,
  
  // Machine Models
  MACHINE_MODELS: '/machine-model',
  MACHINE_MODEL_BY_ID: (id) => `/machine-model/${id}`,
  
  // Departments
  DEPARTMENTS: '/department',
  DEPARTMENT_BY_ID: (id) => `/department/${id}`,
  
  // Sectors
  SECTORS: '/sector',
  SECTOR_BY_ID: (id) => `/sector/${id}`,
  
  // Allocations
  ALLOCATIONS: '/allocated-employee-machine',
};

// Default pagination
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_NUMBER = 0;
