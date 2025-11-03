# Sync Backend - API de Gerenciamento Industrial

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Configuração e Instalação](#configuração-e-instalação)
- [Autenticação e Autorização](#autenticação-e-autorização)
- [Endpoints da API](#endpoints-da-api)
- [Relatórios em PDF](#relatórios-em-pdf)
- [Modelos de Dados](#modelos-de-dados)
- [Códigos de Status HTTP](#códigos-de-status-http)
- [Exemplos de Requisições](#exemplos-de-requisições)

---

## 🎯 Visão Geral

O **Sync Backend** é uma API REST desenvolvida em Spring Boot para gerenciamento de operações industriais. O sistema permite controlar departamentos, setores, máquinas, funcionários, estoque e alocações de funcionários em máquinas. Integrado com frontend hospedado no Vercel, oferece geração de relatórios em PDF e autenticação JWT.

**Base URL**: `http://localhost:8080` (desenvolvimento)

**Frontend**: `https://fronttcc-v6al.vercel.app` (produção)

**Documentação Swagger**: `http://localhost:8080/swagger-ui/index.html`

---

## 🛠 Tecnologias Utilizadas

### Core
- **Java 21**
- **Spring Boot 3.3.5**
- **Maven** (gerenciamento de dependências)

### Frameworks e Bibliotecas
- **Spring Data JPA** - Persistência de dados
- **Spring Security** - Segurança e autenticação
- **Spring OAuth2 Resource Server** - Autenticação JWT
- **Hibernate** - ORM
- **MySQL Connector** - Driver de banco de dados
- **Lombok** - Redução de boilerplate
- **MapStruct 1.6.0** - Mapeamento de DTOs
- **SpringDoc OpenAPI 2.6.0** - Documentação Swagger
- **Bean Validation** - Validação de dados
- **JasperReports 6.20.0** - Geração de relatórios (em desenvolvimento)
- **iText 2.1.7** - Geração de PDFs

### Banco de Dados
- **MySQL** (Aiven Cloud)
- **JPA/Hibernate** com DDL auto-update

---

## 🏗 Arquitetura

O projeto segue uma arquitetura em camadas:

```
src/main/java/com/projeto/tcc/
├── config/              # Configurações (Security, Swagger)
├── controller/          # Controladores REST
├── dto/                 # Data Transfer Objects
│   ├── entry/          # DTOs de entrada
│   ├── exit/           # DTOs de saída
│   └── exit/custom/    # DTOs customizados
├── entities/            # Entidades JPA
├── enums/              # Enumerações
├── exceptions/         # Tratamento de exceções
├── repository/         # Repositórios JPA
├── security/           # Configurações de segurança
└── service/            # Lógica de negócio

src/main/resources/
├── relatorios/         # Templates JasperReports (.jrxml)
├── chave_privada.key   # Chave privada RSA para JWT
├── chave_publica.pub   # Chave pública RSA para JWT
└── application.yml     # Configurações da aplicação
```

---

## ⚙️ Configuração e Instalação

### Pré-requisitos
- Java 21 ou superior
- Maven 3.6+
- MySQL 8.0+

### Variáveis de Ambiente

Configure as seguintes propriedades no `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://seu-host:porta/seu-banco
    username: seu-usuario
    password: sua-senha
    
jwt:
  private:
    key: "classpath:chave_privada.key"
  public:
    key: "classpath:chave_publica.pub"
```

### Chaves JWT

Você precisa gerar um par de chaves RSA e colocá-las em `src/main/resources/`:
- `chave_privada.key` - Chave privada RSA
- `chave_publica.pub` - Chave pública RSA

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd Sync-backend

# Compile o projeto
mvn clean install

# Execute a aplicação
mvn spring-boot:run
```

A aplicação estará disponível em `http://localhost:8080`

---

## 🔐 Autenticação e Autorização

### Sistema de Autenticação

O sistema utiliza **JWT (JSON Web Tokens)** com chaves RSA para autenticação.

### Roles (Perfis)

O sistema possui 3 níveis de acesso:

| Role | Descrição | Permissões |
|------|-----------|------------|
| `ADMIN` | Administrador | Acesso total (CRUD completo) |
| `GERENTE` | Gerente | Leitura e algumas operações específicas |
| `OPERADOR` | Operador | Acesso limitado (em desenvolvimento) |

### Fluxo de Autenticação

1. **Registro**: `POST /sign-in` - Criar novo usuário
2. **Login**: `POST /login` - Obter token JWT
3. **Requisições**: Incluir header `Authorization: Bearer {token}`

### Exemplo de Login

**Request:**
```http
POST /login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "exp": 1698765432000
}
```

---

## 📡 Endpoints da API

### 🔓 Endpoints Públicos (Sem Autenticação)

#### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/login` | Autenticar usuário |
| POST | `/sign-in` | Registrar novo usuário |

---

### 👤 Usuários (`/user`)

| Método | Endpoint | Permissões | Descrição |
|--------|----------|------------|-----------|
| GET | `/user` | ADMIN, GERENTE | Listar usuários (paginado) |
| GET | `/user/{id}` | ADMIN, GERENTE | Buscar usuário por ID |
| PUT | `/user/{id}` | ADMIN | Atualizar usuário |
| DELETE | `/user/{id}` | ADMIN | Deletar usuário |

**Query Parameters (GET /user):**
- `page-number` (default: 0) - Número da página
- `page-size` (default: 10) - Tamanho da página

---

### 🏢 Departamentos (`/department`)

| Método | Endpoint | Permissões | Descrição |
|--------|----------|------------|-----------|
| POST | `/department` | ADMIN | Criar departamento |
| GET | `/department` | ADMIN, GERENTE | Listar departamentos (paginado) |
| GET | `/department/{id}` | ADMIN, GERENTE | Buscar departamento por ID |
| PUT | `/department/{id}` | ADMIN | Atualizar departamento |
| DELETE | `/department/{id}` | ADMIN | Deletar departamento |

**Query Parameters (GET /department):**
- `department-name` - Filtrar por nome
- `status-department` - Filtrar por status
- `department-budget` - Filtrar por orçamento
- `page-number` (default: 0)
- `page-size` (default: 10)

---

### 🏭 Setores (`/sector`)

| Método | Endpoint | Permissões | Descrição |
|--------|----------|------------|-----------|
| POST | `/sector` | ADMIN | Criar setor |
| GET | `/sector` | ADMIN, GERENTE | Listar setores (paginado) |
| GET | `/sector/{id}` | ADMIN, GERENTE | Buscar setor por ID |
| PUT | `/sector/{id}` | ADMIN | Atualizar setor |
| DELETE | `/sector/{id}` | ADMIN | Deletar setor |

**Query Parameters (GET /sector):**
- `department-name` - Filtrar por nome do departamento
- `sector-name` - Filtrar por nome do setor
- `page-number` (default: 0)
- `page-size` (default: 10)

---

### 👷 Funcionários (`/employee`)

| Método | Endpoint | Permissões | Descrição |
|--------|----------|------------|-----------|
| POST | `/employee` | ADMIN | Criar funcionário |
| GET | `/employee` | ADMIN, GERENTE | Listar funcionários (paginado) |
| GET | `/employee/{id}` | ADMIN, GERENTE | Buscar funcionário por ID |
| PUT | `/employee/{id}` | ADMIN | Atualizar funcionário |
| DELETE | `/employee/{id}` | ADMIN | Deletar funcionário |
| GET | `/employee/relatorio` | ADMIN, GERENTE | Gerar relatório PDF de funcionários |

**Query Parameters (GET /employee):**
- `employee-name` - Filtrar por nome
- `employee-id` - Filtrar por ID do funcionário
- `shift` - Filtrar por turno
- `sector-name` - Filtrar por nome do setor
- `page-number` (default: 0)
- `page-size` (default: 10)

---

### 🏭 Máquinas (`/machine`)

| Método | Endpoint | Permissões | Descrição |
|--------|----------|------------|-----------|
| POST | `/machine` | ADMIN | Criar máquina |
| GET | `/machine` | ADMIN, GERENTE | Listar máquinas (paginado) |
| GET | `/machine/{id}` | ADMIN, GERENTE | Buscar máquina por ID |
| PUT | `/machine/{id}` | ADMIN | Atualizar máquina |
| DELETE | `/machine/{id}` | ADMIN | Deletar máquina |
| GET | `/machine/relatorio` | ADMIN, GERENTE | Gerar relatório PDF de máquinas |

**Query Parameters (GET /machine):**
- `machine-name` - Filtrar por nome
- `sector-name` - Filtrar por nome do setor
- `status-machine` - Filtrar por status
- `page-number` (default: 0)
- `page-size` (default: 10)

**Status de Máquina:**
- `OPERANDO` - Em operação
- `PARADA` - Parada
- `EM_MANUTENCAO` - Em manutenção
- `AVARIADA` - Avariada

---

### 🔧 Modelos de Máquina (`/machine-model`)

| Método | Endpoint | Permissões | Descrição |
|--------|----------|------------|-----------|
| POST | `/machine-model` | ADMIN | Criar modelo de máquina |
| GET | `/machine-model` | ADMIN, GERENTE | Listar modelos (paginado) |
| GET | `/machine-model/{id}` | ADMIN, GERENTE | Buscar modelo por ID |
| PUT | `/machine-model/{id}` | ADMIN | Atualizar modelo |
| DELETE | `/machine-model/{id}` | ADMIN | Deletar modelo |

**Query Parameters (GET /machine-model):**
- `numero-pagina` (default: 0)
- `tamanho-pagina` (default: 10)

---

### 📊 Relatórios (`/relatorios`)

| Método | Endpoint | Permissões | Descrição |
|--------|----------|------------|-----------|
| GET | `/relatorios/geral` | ADMIN, GERENTE | Gerar relatório completo (funcionários + máquinas) |
| GET | `/relatorios/funcionarios` | ADMIN, GERENTE | Gerar relatório de funcionários |
| GET | `/relatorios/maquinas` | ADMIN, GERENTE | Gerar relatório de máquinas |

**Características dos Relatórios:**
- Formato: PDF
- Geração dinâmica com JasperReports
- Tabelas com cabeçalhos estilizados (azul)
- Linhas zebradas para melhor leitura
- Rodapé com data/hora de geração e número de página
- Dados em tempo real do banco de dados

**Exemplo de Uso:**
```http
GET /relatorios/geral
Authorization: Bearer {seu-token}
```

**Response:**
- Content-Type: `application/pdf`
- Content-Disposition: `inline; filename="relatorio_geral.pdf"`
- Body: Arquivo PDF binário

**Implementação no Frontend:**
```javascript
// Exemplo React/Next.js
const downloadRelatorio = async (tipo) => {
  const response = await fetch(`http://localhost:8080/relatorios/${tipo}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `relatorio_${tipo}.pdf`;
  a.click();
};

// Uso:
downloadRelatorio('geral');      // Relatório completo
downloadRelatorio('funcionarios'); // Apenas funcionários
downloadRelatorio('maquinas');     // Apenas máquinas
```

---

### 📦 Estoque (`/stock`)

| Método | Endpoint | Permissões | Descrição |
|--------|----------|------------|-----------|
| POST | `/stock` | Todas | Criar item de estoque |
| GET | `/stock` | Todas | Listar estoque (paginado) |
| GET | `/stock/{id}` | Todas | Buscar item por ID |
| PUT | `/stock/{id}` | Todas | Atualizar item |
| DELETE | `/stock/{id}` | Todas | Deletar item |

**Query Parameters (GET /stock):**
- `page-number` (default: 1)
- `page-size` (default: 10)

---

### 🔗 Alocação Funcionário-Máquina (`/allocated-employee-machine`)

| Método | Endpoint | Permissões | Descrição |
|--------|----------|------------|-----------|
| POST | `/allocated-employee-machine` | ADMIN, GERENTE | Alocar funcionário em máquina |
| GET | `/allocated-employee-machine` | ADMIN, GERENTE | Listar alocações (paginado) |

**Query Parameters (GET):**
- `name-employee` - Filtrar por nome do funcionário
- `name-employee-changed` - Filtrar por nome do funcionário alterado
- `page-number` (default: 0)
- `page-size` (default: 10)

---

### � Relatórios em PDF

O sistema oferece geração de relatórios em PDF utilizando **JasperReports**.

#### Relatório de Funcionários

| Método | Endpoint | Permissões | Descrição |
|--------|----------|------------|-----------|
| GET | `/employee/relatorio` | ADMIN, GERENTE | Gera PDF com lista de todos os funcionários |

**Exemplo de Requisição:**
```http
GET /employee/relatorio
Authorization: Bearer {seu-token}
```

**Response:** `200 OK`
- Content-Type: `application/pdf`
- Content-Disposition: `inline; filename=relatorio_funcionarios.pdf`
- Body: Arquivo PDF binário

**Conteúdo do Relatório:**
- Nome do funcionário
- ID do funcionário
- Setor
- Turno
- Status
- Disponibilidade

---

#### Relatório de Máquinas

| Método | Endpoint | Permissões | Descrição |
|--------|----------|------------|-----------|
| GET | `/machine/relatorio` | ADMIN, GERENTE | Gera PDF com lista de todas as máquinas |

**Exemplo de Requisição:**
```http
GET /machine/relatorio
Authorization: Bearer {seu-token}
```

**Response:** `200 OK`
- Content-Type: `application/pdf`
- Content-Disposition: `inline; filename=relatorio_maquinas.pdf`
- Body: Arquivo PDF binário

**Conteúdo do Relatório:**
- Nome da máquina
- Número de série
- Setor
- Status
- OEE (Overall Equipment Effectiveness)
- Throughput
- Última manutenção
- Modelo da máquina

**Tecnologia:**
- **JasperReports 6.20.0** - Geração de relatórios
- **iText 2.1.7** - Renderização de PDF
- Templates JRXML localizados em `src/main/resources/relatorios/`

---

## �📊 Modelos de Dados

### UserDTO (Entrada)

```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "roles": ["ADMIN", "GERENTE"]
}
```

**Validações:**
- `email`: Obrigatório, formato de e-mail válido
- `password`: Obrigatório
- `roles`: Obrigatório, não vazio. Valores: `ADMIN`, `GERENTE`, `OPERADOR`

---

### DepartmentDTO (Entrada)

```json
{
  "name": "Produção",
  "description": "Departamento de produção industrial",
  "location": "Prédio A - Andar 2",
  "budget": 150000.00,
  "status": "ATIVO"
}
```

**Validações:**
- Todos os campos são obrigatórios
- `budget`: Valor decimal

---

### SectorDTO (Entrada)

```json
{
  "name": "Montagem",
  "efficiency": 85.5,
  "department": 1,
  "maximumQuantEmployee": 50
}
```

**Validações:**
- Todos os campos são obrigatórios
- `efficiency`: Float (porcentagem)
- `department`: ID do departamento
- `maximumQuantEmployee`: Número inteiro

---

### EmployeeDTO (Entrada)

```json
{
  "name": "João Silva",
  "employeeID": 12345,
  "sector": 1,
  "shift": "MANHA",
  "status": "ATIVO",
  "photo": "base64_ou_url_da_foto",
  "user": 1,
  "availability": true
}
```

**Validações:**
- `name`: Obrigatório, máximo 200 caracteres
- `employeeID`: Obrigatório, 5 dígitos (10000-99999)
- `sector`: ID do setor
- `shift`: Valores: `MANHA`, `TARDE`, `NOITE`
- `status`: Obrigatório
- `photo`: Obrigatório
- `user`: ID do usuário
- `availability`: Boolean

---

### MachineDTO (Entrada)

```json
{
  "name": "Torno CNC 01",
  "sector": 1,
  "status": "OPERANDO",
  "oee": 78.5,
  "throughput": 150,
  "lastMaintenance": "2024-01-15",
  "photo": "base64_ou_url_da_foto",
  "serieNumber": 54321,
  "machineModel": 1
}
```

**Validações:**
- `name`: Obrigatório, máximo 200 caracteres
- `sector`: ID do setor
- `status`: Obrigatório. Valores: `OPERANDO`, `PARADA`, `EM_MANUTENCAO`, `AVARIADA`
- `oee`: Float (Overall Equipment Effectiveness)
- `throughput`: Obrigatório, inteiro
- `lastMaintenance`: Data (formato: YYYY-MM-DD)
- `photo`: Obrigatório
- `serieNumber`: Obrigatório, 5 dígitos (10000-99999)
- `machineModel`: ID do modelo da máquina

---

### MachineModelDTO (Entrada)

```json
{
  "modelName": "Torno CNC Industrial XYZ-2000",
  "modelDescription": "Torno CNC de alta precisão para operações industriais"
}
```

**Validações:**
- `modelName`: Obrigatório, máximo 200 caracteres
- `modelDescription`: Obrigatório, máximo 300 caracteres

---

### StockDTO (Entrada)

```json
{
  "codigo": "EST01",
  "nome": "Parafuso M8",
  "categoria": "Fixação",
  "quantidade": 1000,
  "unidade": "UN",
  "precoUnitario": 0.50,
  "fornecedor": "Fornecedor ABC",
  "dataEntrada": "2024-01-10",
  "dataValidade": "2025-01-10",
  "localizacao": "Prateleira A3",
  "status": "DISPONIVEL",
  "descricao": "Parafuso de aço inox M8"
}
```

**Validações:**
- `codigo`: Obrigatório, máximo 5 caracteres
- `nome`: Obrigatório
- `categoria`: Obrigatório
- `quantidade`: Obrigatório, mínimo 0
- `unidade`: Obrigatório
- `precoUnitario`: Obrigatório, mínimo 0
- `fornecedor`: Obrigatório
- `dataEntrada`: Obrigatório, não pode ser futuro
- `dataValidade`: Obrigatório, não pode ser passado
- `localizacao`: Obrigatório
- `status`: Obrigatório
- `descricao`: Obrigatório

---

### AllocatedEmployeeMachineDTO (Entrada)

```json
{
  "employee": 1,
  "machine": 1
}
```

**Validações:**
- `employee`: ID do funcionário (obrigatório)
- `machine`: ID da máquina (obrigatório)

---

## 📄 Códigos de Status HTTP

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

## 🔍 Exemplos de Requisições

### 1. Registro de Usuário

```http
POST /sign-in
Content-Type: application/json

{
  "email": "admin@empresa.com",
  "password": "senha123",
  "roles": ["ADMIN"]
}
```

**Response:** `201 Created`
```
Location: http://localhost:8080/user/1
```

---

### 2. Login

```http
POST /login
Content-Type: application/json

{
  "email": "admin@empresa.com",
  "password": "senha123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBlbXByZXNhLmNvbSIsInNjb3BlIjoiQURNSU4iLCJpYXQiOjE2OTg3NjU0MzIsImV4cCI6MTY5ODc2OTAzMn0...",
  "exp": 1698769032000
}
```

---

### 3. Criar Departamento

```http
POST /department
Authorization: Bearer {seu-token}
Content-Type: application/json

{
  "name": "Produção",
  "description": "Departamento responsável pela produção",
  "location": "Prédio A",
  "budget": 200000.00,
  "status": "ATIVO"
}
```

**Response:** `201 Created`
```
Location: http://localhost:8080/department/1
```

---

### 4. Listar Máquinas com Filtros

```http
GET /machine?machine-name=Torno&status-machine=OPERANDO&page-number=0&page-size=10
Authorization: Bearer {seu-token}
```

**Response:** `200 OK`
```json
{
  "content": [
    {
      "id": 1,
      "name": "Torno CNC 01",
      "sector": {
        "id": 1,
        "name": "Montagem"
      },
      "status": "OPERANDO",
      "oee": 78.5,
      "throughput": 150,
      "lastMaintenance": "2024-01-15",
      "photo": "url_da_foto",
      "serieNumber": 54321,
      "machineModel": {
        "id": 1,
        "modelName": "Torno CNC Industrial"
      }
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10
  },
  "totalElements": 1,
  "totalPages": 1
}
```

---

### 5. Atualizar Funcionário

```http
PUT /employee/1
Authorization: Bearer {seu-token}
Content-Type: application/json

{
  "name": "João Silva Santos",
  "employeeID": 12345,
  "sector": 1,
  "shift": "TARDE",
  "status": "ATIVO",
  "photo": "nova_foto_base64",
  "user": 1,
  "availability": true
}
```

**Response:** `204 No Content`

---

### 6. Alocar Funcionário em Máquina

```http
POST /allocated-employee-machine
Authorization: Bearer {seu-token}
Content-Type: application/json

{
  "employee": 1,
  "machine": 1
}
```

**Response:** `201 Created`
```
Location: http://localhost:8080/allocated-employee-machine/1
```

---

### 7. Buscar Estoque Paginado

```http
GET /stock?page-number=0&page-size=20
Authorization: Bearer {seu-token}
```

**Response:** `200 OK`
```json
{
  "content": [
    {
      "codigo": "EST01",
      "nome": "Parafuso M8",
      "categoria": "Fixação",
      "quantidade": 1000,
      "unidade": "UN",
      "precoUnitario": 0.50,
      "fornecedor": "Fornecedor ABC",
      "dataEntrada": "2024-01-10",
      "dataValidade": "2025-01-10",
      "localizacao": "Prateleira A3",
      "status": "DISPONIVEL",
      "descricao": "Parafuso de aço inox M8"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalElements": 1,
  "totalPages": 1
}
```

---

### 8. Deletar Setor

```http
DELETE /sector/1
Authorization: Bearer {seu-token}
```

**Response:** `204 No Content`

---

### 9. Gerar Relatório de Máquinas em PDF

```http
GET /machine/relatorio
Authorization: Bearer {seu-token}
```

**Response:** `200 OK`
- Retorna um arquivo PDF com todas as máquinas cadastradas
- Content-Type: `application/pdf`
- O arquivo é exibido inline no navegador

---

### 10. Gerar Relatório de Funcionários em PDF

```http
GET /employee/relatorio
Authorization: Bearer {seu-token}
```

**Response:** `200 OK`
- Retorna um arquivo PDF com todos os funcionários cadastrados
- Content-Type: `application/pdf`
- O arquivo é exibido inline no navegador

---

## 🔒 Segurança

### CORS

O backend está configurado para aceitar requisições de:
- `http://localhost:*`
- `http://127.0.0.1:*`
- `http://[::1]` (IPv6 localhost)
- `https://fronttcc-v6al.vercel.app` (Frontend em produção)

### Proteção CSRF

CSRF está desabilitado pois a API utiliza JWT (stateless).

### Sessões

A API é **stateless** - não mantém sessões no servidor.

---

## 📝 Notas Importantes

### Paginação

Todos os endpoints de listagem suportam paginação:
- `page-number`: Número da página (começa em 0)
- `page-size`: Quantidade de itens por página

### Formato de Datas

- **Entrada**: `YYYY-MM-DD` (ISO 8601)
- **Saída**: `YYYY-MM-DD` (ISO 8601)

### Formato de Horas

- Formato: `HH:mm` (24 horas)

### IDs

Todos os IDs são do tipo `Long` (número inteiro).

### Validações

Todas as validações são feitas automaticamente pelo Bean Validation. Erros de validação retornam status `400 Bad Request` com detalhes dos campos inválidos.

---

## 🐛 Tratamento de Erros

### Formato de Resposta de Erro

```json
{
  "timestamp": "2024-01-20T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Por favor, informe o e-mail"
    },
    {
      "field": "password",
      "message": "Por favor, informe o password"
    }
  ],
  "path": "/sign-in"
}
```

---

## 🚀 Próximos Passos / Funcionalidades em Desenvolvimento

- [x] Geração de relatórios em PDF (JasperReports) - **✅ IMPLEMENTADO**
  - [x] Relatório Geral (Funcionários + Máquinas)
  - [x] Relatório de Funcionários
  - [x] Relatório de Máquinas
  - [x] Tabelas estilizadas com cabeçalhos azuis
  - [x] Linhas zebradas para melhor leitura
  - [x] Rodapé com data/hora e paginação
- [ ] Histórico de alterações de estado de máquinas
- [ ] Endpoints para operadores
- [ ] Métricas e dashboards
- [ ] Notificações
- [ ] Relatórios adicionais (Departamentos, Setores, Estoque)

---

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- **Swagger UI**: `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

---

## 📄 Licença

Este projeto é um TCC (Trabalho de Conclusão de Curso).

---

**Última atualização**: Novembro 2025
