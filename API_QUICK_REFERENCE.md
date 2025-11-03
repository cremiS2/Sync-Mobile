# 🚀 Referência Rápida - API Sync Mobile

Guia rápido para integração com a API backend.

---

## 📍 Configuração

```javascript
// src/config/api.js
export const API_BASE_URL = 'http://localhost:8080';
```

---

## 🔐 Autenticação

```javascript
import { login, signUp, logout } from './services/authService';

// Login
await login('email@exemplo.com', 'senha123');

// Registro
await signUp({ email: 'novo@exemplo.com', password: 'senha', roles: ['GERENTE'] });

// Logout
await logout();
```

---

## 👷 Funcionários

```javascript
import { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee } from './services/employeeService';

// Listar
const employees = await getEmployees({ pageNumber: 0, pageSize: 10 });

// Buscar por ID
const employee = await getEmployeeById(1);

// Criar
await createEmployee({
  name: 'João Silva',
  employeeID: 12345,
  sector: 1,
  shift: 'MANHA',
  status: 'ATIVO',
  photo: 'url',
  user: 1,
  availability: true
});

// Atualizar
await updateEmployee(1, { name: 'João Santos' });

// Deletar
await deleteEmployee(1);
```

**Turnos**: `MANHA`, `TARDE`, `NOITE`

---

## 🏭 Máquinas

```javascript
import { getMachines, getMachineById, createMachine, updateMachine, deleteMachine } from './services/machineService';

// Listar
const machines = await getMachines({ statusMachine: 'OPERANDO' });

// Criar
await createMachine({
  name: 'Torno CNC',
  sector: 1,
  status: 'OPERANDO',
  oee: 78.5,
  throughput: 150,
  lastMaintenance: '2024-01-15',
  photo: 'url',
  serieNumber: 54321,
  machineModel: 1
});
```

**Status**: `OPERANDO`, `PARADA`, `EM_MANUTENCAO`, `AVARIADA`

---

## 🏢 Departamentos

```javascript
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from './services/departmentService';

// Criar
await createDepartment({
  name: 'Produção',
  description: 'Departamento de produção',
  location: 'Prédio A',
  budget: 200000.00,
  status: 'ATIVO'
});
```

---

## 🏭 Setores

```javascript
import { getSectors, createSector, updateSector, deleteSector } from './services/sectorService';

// Criar
await createSector({
  name: 'Montagem',
  efficiency: 85.5,
  department: 1,
  maximumQuantEmployee: 50
});
```

---

## 📦 Estoque

```javascript
import { getStock, getStockById, createStock, updateStock, deleteStock } from './services/stockService';

// Listar (página começa em 1)
const stock = await getStock({ pageNumber: 1, pageSize: 10 });

// Criar
await createStock({
  codigo: 'EST01',
  nome: 'Parafuso M8',
  categoria: 'Fixação',
  quantidade: 1000,
  unidade: 'UN',
  precoUnitario: 0.50,
  fornecedor: 'Fornecedor ABC',
  dataEntrada: '2024-01-10',
  dataValidade: '2025-01-10',
  localizacao: 'Prateleira A3',
  status: 'DISPONIVEL',
  descricao: 'Parafuso de aço inox'
});
```

---

## 📊 Relatórios PDF

```javascript
import { 
  downloadGeneralReport, 
  downloadEmployeesReport, 
  downloadMachinesReport 
} from './services/reportService';

// Relatório Geral
await downloadGeneralReport();

// Relatório de Funcionários
await downloadEmployeesReport();

// Relatório de Máquinas
await downloadMachinesReport();
```

---

## 🔗 Alocações

```javascript
import { getAllocations, createAllocation } from './services/allocationService';

// Alocar funcionário em máquina
await createAllocation({
  employee: 1,
  machine: 1
});
```

---

## 📄 Paginação

```javascript
const response = await getEmployees({
  pageNumber: 0,  // Começa em 0 (exceto Stock = 1)
  pageSize: 10
});

// Estrutura da resposta:
{
  content: [...],
  pageable: { pageNumber: 0, pageSize: 10 },
  totalElements: 50,
  totalPages: 5
}
```

---

## ⚠️ Tratamento de Erros

```javascript
try {
  const data = await getEmployees();
} catch (error) {
  Alert.alert('Erro', error.message);
  // Mensagens amigáveis já tratadas
}
```

---

## 🔑 Códigos HTTP

| Código | Significado |
|--------|-------------|
| 200 | Sucesso (GET) |
| 201 | Criado (POST) |
| 204 | Sem conteúdo (PUT/DELETE) |
| 400 | Dados inválidos |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Não encontrado |
| 500 | Erro no servidor |

---

## 🎯 Roles (Permissões)

| Role | Permissões |
|------|------------|
| `ADMIN` | Acesso total |
| `GERENTE` | Leitura + algumas operações |
| `OPERADOR` | Acesso limitado |

---

## 📱 Exemplo Completo

```javascript
import React, { useState, useEffect } from 'react';
import { View, FlatList, Button, Alert } from 'react-native';
import { getEmployees, deleteEmployee } from '../services/employeeService';

const EmployeesScreen = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees({ pageSize: 20 });
      setEmployees(response.content);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      loadEmployees();
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View>
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Button title="Deletar" onPress={() => handleDelete(item.id)} />
          </View>
        )}
        refreshing={loading}
        onRefresh={loadEmployees}
      />
    </View>
  );
};
```

---

## 🔧 Troubleshooting

### Erro de conexão
```bash
npm run check-backend
```

### Emulador Android
```javascript
export const API_BASE_URL = 'http://10.0.2.2:8080';
```

### Token expirado
```javascript
await logout();
await login(email, password);
```

---

## 📚 Documentação Completa

- **Integração**: `API_INTEGRATION.md`
- **Exemplos**: `USAGE_EXAMPLES.md`
- **Backend**: `ReadMeBack.md`
- **Swagger**: `http://localhost:8080/swagger-ui/index.html`

---

**Última atualização**: Novembro 2024
