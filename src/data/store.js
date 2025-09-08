// In-memory demo store following the requested schema

let departments = [
  {
    id: 'dep-1',
    name: 'Produção',
    description: 'Responsável pela fabricação dos produtos.',
    location: 'Bloco A',
    status: 'active',
    employees: 25,
    budget: 120000,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 'dep-2',
    name: 'TI',
    description: 'Tecnologia da Informação',
    location: 'Bloco C',
    status: 'active',
    employees: 12,
    budget: 80000,
    createdAt: '2024-02-03T10:00:00Z',
  },
];

let sectors = [
  { id: 'sec-1', name: 'Montagem', employees: 10, efficiency: 92, production: 300, departmentId: 'dep-1' },
  { id: 'sec-2', name: 'Acabamento', employees: 8, efficiency: 88, production: 220, departmentId: 'dep-1' },
  { id: 'sec-3', name: 'Infraestrutura', employees: 5, efficiency: 95, production: 0, departmentId: 'dep-2' },
];

let employees = [
  { id: 'emp-1', name: 'Maria Oliveira', departmentId: 'dep-1', sectorId: 'sec-1', role: 'Operador', shift: 'Manhã', status: 'Active', photo: '' },
  { id: 'emp-2', name: 'João Silva', departmentId: 'dep-2', sectorId: 'sec-3', role: 'Analista', shift: 'Tarde', status: 'Active', photo: '' },
  { id: 'emp-3', name: 'Pedro Santos', departmentId: 'dep-1', sectorId: 'sec-2', role: 'Técnico', shift: 'Noite', status: 'On Leave', photo: '' },
];

let machines = [
  { id: 'mac-1', name: 'Prensa Hidráulica', departmentId: 'dep-1', sectorId: 'sec-1', status: 'Operando', oee: 85, throughput: 120, lastMaintenance: '2024-07-15T10:00:00Z', photo: '' },
  { id: 'mac-2', name: 'Servidor Dell R740', departmentId: 'dep-2', sectorId: 'sec-3', status: 'Operando', oee: 99, throughput: 0, lastMaintenance: '2024-08-02T12:00:00Z', photo: '' },
];

function generateId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

// Departments
export function listDepartments() { return [...departments]; }
export function createDepartment(payload) {
  const dept = { id: generateId('dep'), createdAt: new Date().toISOString(), ...payload };
  departments.push(dept);
  return dept;
}
export function updateDepartment(id, updates) {
  departments = departments.map(d => d.id === id ? { ...d, ...updates } : d);
}
export function deleteDepartment(id) {
  departments = departments.filter(d => d.id !== id);
  // Also detach related
  sectors = sectors.filter(s => s.departmentId !== id);
  employees = employees.filter(e => e.departmentId !== id);
  machines = machines.filter(m => m.departmentId !== id);
}

// Sectors
export function listSectors() { return [...sectors]; }
export function listSectorsByDepartment(departmentId) { return sectors.filter(s => s.departmentId === departmentId); }
export function createSector(payload) {
  const sec = { id: generateId('sec'), ...payload };
  sectors.push(sec);
  return sec;
}
export function updateSector(id, updates) {
  sectors = sectors.map(s => s.id === id ? { ...s, ...updates } : s);
}
export function deleteSector(id) {
  sectors = sectors.filter(s => s.id !== id);
  employees = employees.filter(e => e.sectorId !== id);
  machines = machines.filter(m => m.sectorId !== id);
}

// Employees
export function listEmployees() { return [...employees]; }
export function createEmployee(payload) {
  const emp = { id: generateId('emp'), ...payload };
  employees.push(emp);
  return emp;
}
export function updateEmployee(id, updates) {
  employees = employees.map(e => e.id === id ? { ...e, ...updates } : e);
}
export function deleteEmployee(id) {
  employees = employees.filter(e => e.id !== id);
}

// Machines
export function listMachines() { return [...machines]; }
export function createMachine(payload) {
  const mac = { id: generateId('mac'), ...payload };
  machines.push(mac);
  return mac;
}
export function updateMachine(id, updates) {
  machines = machines.map(m => m.id === id ? { ...m, ...updates } : m);
}
export function deleteMachine(id) {
  machines = machines.filter(m => m.id !== id);
}


