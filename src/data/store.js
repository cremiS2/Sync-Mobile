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


// Inventory (Estoque)
let inventory = [
  {
    id: 'inv-1',
    name: 'Parafuso M6x20',
    sku: 'PAR-M6-20',
    quantity: 1500,
    minStock: 500,
    unit: 'un',
    location: 'Almox A1',
    category: 'Fixadores',
    reserved: 120,
    unitPrice: 0.12,
    updatedAt: '2024-08-20T10:00:00Z',
  },
  {
    id: 'inv-2',
    name: 'Chapa Aço 2mm',
    sku: 'CHA-ACO-2',
    quantity: 75,
    minStock: 100,
    unit: 'pz',
    location: 'Almox B3',
    category: 'Matéria-prima',
    reserved: 10,
    unitPrice: 45.5,
    updatedAt: '2024-09-05T15:30:00Z',
  },
];

export function getInventoryStatus(item) {
  const quantity = Number(item?.quantity || 0);
  const minStock = Number(item?.minStock || 0);
  if (quantity <= 0) return 'Sem estoque';
  if (quantity <= Math.max(1, minStock * 0.5)) return 'Crítico';
  if (quantity <= minStock) return 'Atenção';
  return 'OK';
}

export function listInventory() {
  return inventory.map(i => ({ ...i, status: getInventoryStatus(i) }));
}
export function createInventoryItem(payload) {
  const item = { id: generateId('inv'), updatedAt: new Date().toISOString(), ...payload };
  inventory.push(item);
  return item;
}
export function updateInventoryItem(id, updates) {
  inventory = inventory.map(i => i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i);
}
export function deleteInventoryItem(id) {
  inventory = inventory.filter(i => i.id !== id);
}

export function computeInventoryStats() {
  let totalItems = inventory.length;
  let totalReserved = 0;
  let totalAvailable = 0;
  let totalLow = 0;
  let totalOut = 0;
  let totalValue = 0;

  for (const i of inventory) {
    const reserved = Number(i.reserved || 0);
    const qty = Number(i.quantity || 0);
    const min = Number(i.minStock || 0);
    const price = Number(i.unitPrice || 0);
    const available = Math.max(qty - reserved, 0);
    totalReserved += reserved;
    totalAvailable += available;
    if (qty <= 0) totalOut += 1; else if (qty <= Math.max(1, min * 0.5)) totalLow += 1; else if (qty <= min) totalLow += 1;
    totalValue += available * price;
  }

  return {
    totalItems,
    totalReserved,
    totalAvailable,
    totalLow,
    totalOut,
    totalValue,
  };
}

