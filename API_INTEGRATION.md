# 🔗 Guia de Integração - Sync Mobile App com API Backend

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Configuração Inicial](#configuração-inicial)
- [Estrutura de Serviços](#estrutura-de-serviços)
- [Autenticação](#autenticação)
- [Endpoints Disponíveis](#endpoints-disponíveis)
- [Exemplos de Uso](#exemplos-de-uso)
- [Tratamento de Erros](#tratamento-de-erros)
- [Relatórios PDF](#relatórios-pdf)

---

## 🎯 Visão Geral

O aplicativo mobile Sync está totalmente integrado com a API REST desenvolvida em Spring Boot. A comunicação é feita através de requisições HTTP usando **Axios** com autenticação JWT.

**Base URL da API**: `http://localhost:8080` (desenvolvimento)

**Documentação Backend**: Consulte `ReadMeBack.md` para detalhes completos da API.

---

## ⚙️ Configuração Inicial

### 1. Configurar URL do Backend

Edite o arquivo `src/config/api.js`:

```javascript
// Opções disponíveis:
const BACKEND_OPTIONS = {
  LOCAL: 'http://localhost:8080',                    // Desenvolvimento local
  LOCAL_ANDROID_EMULATOR: 'http://10.0.2.2:8080',   // Emulador Android
  AZURE: 'https://sync-d8hac6hdg3czc4aa.brazilsouth-01.azurewebsites.net', // Produção
};

// Altere aqui qual backend usar:
export const API_BASE_URL = BACKEND_OPTIONS.LOCAL;
```

### 2. Instalar Dependências (se necessário)

```bash
npm install axios @react-native-async-storage/async-storage
```

### 3. Verificar Conexão com Backend

Execute o script de verificação:

```bash
npm run check-backend
```

---

## 🏗 Estrutura de Serviços

Todos os serviços estão localizados em `src/services/`:

```
src/services/
├── api.js                      # Configuração do Axios e interceptors
├── authService.js              # Autenticação (login, signup, logout)
├── employeeService.js          # Gerenciamento de funcionários
├── machineService.js           # Gerenciamento de máquinas
├── machineModelService.js      # Modelos de máquinas
├── departmentService.js        # Departamentos
├── sectorService.js            # Setores
├── stockService.js             # Estoque (NOVO)
├── reportService.js            # Relatórios PDF (NOVO)
└── allocationService.js        # Alocação funcionário-máquina
```

---

## 🔐 Autenticação

### Sistema de Autenticação

O app usa **JWT (JSON Web Tokens)** com chaves RSA para autenticação.

### Fluxo de Autenticação

1. **Login**: Usuário envia email e senha
2. **Token JWT**: API retorna token e timestamp de expiração
3. **Armazenamento**: Token é salvo no AsyncStorage
4. **Requisições**: Token é automaticamente incluído no header `Authorization`
5. **Renovação**: Token expira após o tempo definido pela API

### Exemplo de Login

```javascript
import { login } from './services/authService';

const handleLogin = async () => {
  try {
    const response = await login('usuario@exemplo.com', 'senha123');
    console.log('Login bem-sucedido:', response);
    // Token é automaticamente salvo
  } catch (error) {
    console.error('Erro no login:', error.message);
  }
};
```

### Roles (Perfis)

| Role | Descrição | Permissões |
|------|-----------|------------|
| `ADMIN` | Administrador | Acesso total (CRUD completo) |
| `GERENTE` | Gerente | Leitura e algumas operações específicas |
| `OPERADOR` | Operador | Acesso limitado |

---

## 📡 Endpoints Disponíveis

### 🔓 Autenticação (Públicos)

```javascript
import { login, signUp, logout } from './services/authService';

// Login
await login(email, password);

// Registro
await signUp({
  email: 'novo@exemplo.com',
  password: 'senha123',
  roles: ['GERENTE']
});

// Logout
await logout();
```

---

### 👷 Funcionários

```javascript
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from './services/employeeService';

// Listar funcionários com filtros
const employees = await getEmployees({
  pageNumber: 0,
  pageSize: 10,
  employeeName: 'João',
  shift: 'MANHA',
  sectorName: 'Montagem'
});

// Buscar por ID
const employee = await getEmployeeById(1);

// Criar funcionário
const newEmployee = await createEmployee({
  name: 'João Silva',
  employeeID: 12345,
  sector: 1,
  shift: 'MANHA',
  status: 'ATIVO',
  photo: 'base64_ou_url',
  user: 1,
  availability: true
});

// Atualizar
await updateEmployee(1, { name: 'João Silva Santos' });

// Deletar
await deleteEmployee(1);
```

**Turnos disponíveis**: `MANHA`, `TARDE`, `NOITE`

---

### 🏭 Máquinas

```javascript
import {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine
} from './services/machineService';

// Listar máquinas com filtros
const machines = await getMachines({
  pageNumber: 0,
  pageSize: 10,
  machineName: 'Torno',
  statusMachine: 'OPERANDO',
  sectorName: 'Produção'
});

// Criar máquina
const newMachine = await createMachine({
  name: 'Torno CNC 01',
  sector: 1,
  status: 'OPERANDO',
  oee: 78.5,
  throughput: 150,
  lastMaintenance: '2024-01-15',
  photo: 'base64_ou_url',
  serieNumber: 54321,
  machineModel: 1
});
```

**Status disponíveis**: `OPERANDO`, `PARADA`, `EM_MANUTENCAO`, `AVARIADA`

---

### 🏢 Departamentos

```javascript
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from './services/departmentService';

// Listar departamentos
const departments = await getDepartments({
  pageNumber: 0,
  pageSize: 10,
  departmentName: 'Produção'
});

// Criar departamento
const newDepartment = await createDepartment({
  name: 'Produção',
  description: 'Departamento de produção industrial',
  location: 'Prédio A - Andar 2',
  budget: 150000.00,
  status: 'ATIVO'
});
```

---

### 🏭 Setores

```javascript
import {
  getSectors,
  getSectorById,
  createSector,
  updateSector,
  deleteSector
} from './services/sectorService';

// Listar setores
const sectors = await getSectors({
  pageNumber: 0,
  pageSize: 10,
  departmentName: 'Produção',
  sectorName: 'Montagem'
});

// Criar setor
const newSector = await createSector({
  name: 'Montagem',
  efficiency: 85.5,
  department: 1,
  maximumQuantEmployee: 50
});
```

---

### 📦 Estoque (NOVO)

```javascript
import {
  getStock,
  getStockById,
  createStock,
  updateStock,
  deleteStock
} from './services/stockService';

// Listar estoque
const stockItems = await getStock({
  pageNumber: 1,  // API usa 1 como default
  pageSize: 10
});

// Criar item de estoque
const newItem = await createStock({
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
  descricao: 'Parafuso de aço inox M8'
});

// Atualizar item
await updateStock(1, { quantidade: 950 });

// Deletar item
await deleteStock(1);
```

**Validações importantes**:
- `codigo`: Máximo 5 caracteres
- `quantidade`: Mínimo 0
- `precoUnitario`: Mínimo 0
- `dataEntrada`: Não pode ser futuro
- `dataValidade`: Não pode ser passado

---

### 🔗 Alocação Funcionário-Máquina

```javascript
import {
  getAllocations,
  createAllocation
} from './services/allocationService';

// Listar alocações
const allocations = await getAllocations({
  pageNumber: 0,
  pageSize: 10,
  nameEmployee: 'João'
});

// Criar alocação
const newAllocation = await createAllocation({
  employee: 1,
  machine: 1
});
```

---

## 📊 Relatórios PDF (NOVO)

O app agora suporta geração e download de relatórios em PDF.

### Importar Serviço

```javascript
import {
  downloadGeneralReport,
  downloadEmployeesReport,
  downloadMachinesReport,
  downloadEmployeeReport,
  downloadMachineReport
} from './services/reportService';
```

### Gerar Relatórios

```javascript
// Relatório Geral (Funcionários + Máquinas)
const handleGeneralReport = async () => {
  try {
    await downloadGeneralReport();
    Alert.alert('Sucesso', 'Relatório gerado com sucesso!');
  } catch (error) {
    Alert.alert('Erro', error.message);
  }
};

// Relatório de Funcionários
await downloadEmployeesReport();

// Relatório de Máquinas
await downloadMachinesReport();
```

### Endpoints de Relatórios

| Endpoint | Descrição |
|----------|-----------|
| `/relatorios/geral` | Relatório completo (funcionários + máquinas) |
| `/relatorios/funcionarios` | Apenas funcionários |
| `/relatorios/maquinas` | Apenas máquinas |
| `/employee/relatorio` | Relatório de funcionários (alternativo) |
| `/machine/relatorio` | Relatório de máquinas (alternativo) |

### Características dos Relatórios

- ✅ Formato PDF
- ✅ Geração dinâmica com dados em tempo real
- ✅ Tabelas estilizadas com cabeçalhos azuis
- ✅ Linhas zebradas para melhor leitura
- ✅ Rodapé com data/hora e número de página
- ✅ Download e compartilhamento automático

---

## ⚠️ Tratamento de Erros

Todos os serviços possuem tratamento de erros padronizado:

```javascript
try {
  const data = await getEmployees();
  // Processar dados
} catch (error) {
  // error.message contém mensagem amigável
  console.error('Erro:', error.message);
  
  // Exemplos de mensagens:
  // - "Não foi possível conectar ao servidor"
  // - "Email ou senha incorretos"
  // - "Você não tem permissão para esta ação"
  // - "Item não encontrado"
}
```

### Códigos de Status HTTP

| Código | Significado | Quando Ocorre |
|--------|-------------|---------------|
| 200 | OK | Requisição bem-sucedida (GET) |
| 201 | Created | Recurso criado com sucesso (POST) |
| 204 | No Content | Atualização/deleção bem-sucedida (PUT/DELETE) |
| 400 | Bad Request | Dados de entrada inválidos |
| 401 | Unauthorized | Token ausente ou inválido |
| 403 | Forbidden | Usuário sem permissão |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro no servidor |

---

## 🔧 Interceptors do Axios

O arquivo `src/services/api.js` configura interceptors automáticos:

### Request Interceptor
- Adiciona automaticamente o token JWT no header `Authorization`
- Formato: `Bearer {token}`

### Response Interceptor
- Detecta token expirado (401)
- Limpa automaticamente o AsyncStorage
- Redireciona para tela de login (implementar no app)

---

## 📝 Paginação

Todos os endpoints de listagem suportam paginação:

```javascript
const params = {
  pageNumber: 0,  // Começa em 0 (exceto Stock que começa em 1)
  pageSize: 10    // Itens por página
};

const response = await getEmployees(params);

// Estrutura da resposta:
{
  content: [...],           // Array de itens
  pageable: {
    pageNumber: 0,
    pageSize: 10
  },
  totalElements: 50,        // Total de itens
  totalPages: 5             // Total de páginas
}
```

---

## 🚀 Próximos Passos

### Implementações Recomendadas

1. **Tela de Estoque**
   - Criar `EstoqueScreen.js` usando `stockService.js`
   - Adicionar formulários de criação/edição
   - Implementar filtros e busca

2. **Tela de Relatórios**
   - Criar `RelatoriosScreen.js`
   - Adicionar botões para cada tipo de relatório
   - Implementar loading durante geração

3. **Tratamento de Token Expirado**
   - Implementar redirecionamento automático para login
   - Adicionar refresh token (se API suportar)

4. **Offline Support**
   - Implementar cache local com AsyncStorage
   - Sincronizar quando conexão retornar

5. **Notificações**
   - Implementar notificações push
   - Alertas de máquinas em manutenção
   - Alertas de estoque baixo

---

## 🐛 Troubleshooting

### Erro: "Não foi possível conectar ao servidor"

**Solução**:
1. Verifique se o backend está rodando
2. Execute `npm run check-backend`
3. Verifique a URL em `src/config/api.js`
4. Se usar emulador Android, use `http://10.0.2.2:8080`

### Erro: "Token expirado"

**Solução**:
1. Faça logout e login novamente
2. Verifique se o cálculo de expiração está correto
3. Backend pode ter reiniciado (tokens invalidados)

### Erro: "CORS blocked"

**Solução**:
1. Backend já está configurado para aceitar requisições do localhost
2. Verifique se está usando HTTPS em produção

---

## 📚 Recursos Adicionais

- **Documentação Backend**: `ReadMeBack.md`
- **Swagger UI**: `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

---

## ✅ Checklist de Integração

- [x] Configurar URL do backend
- [x] Implementar autenticação JWT
- [x] Criar serviços para todos os endpoints
- [x] Adicionar interceptors do Axios
- [x] Implementar tratamento de erros
- [x] Adicionar suporte a paginação
- [x] Criar serviço de estoque
- [x] Criar serviço de relatórios PDF
- [ ] Implementar telas de UI
- [ ] Adicionar testes unitários
- [ ] Implementar cache offline
- [ ] Adicionar notificações push

---

**Última atualização**: Novembro 2024

**Desenvolvido para**: Sync Mobile - Sistema de Gerenciamento Industrial
