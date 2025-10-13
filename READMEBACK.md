# Sync-backend (Spring Boot 3)

API REST para gestão de departamentos, setores, funcionários, máquinas, modelos e alocações. Protegida via JWT e documentada com Swagger.

## Requisitos
- Java 21
- Maven 3.9+
- PostgreSQL (ou MySQL, ajustando o datasource)

## Stack
- Spring Boot 3.3 (Web, Security Resource Server, Data JPA, Validation)
- PostgreSQL/MySQL, MapStruct, Lombok
- springdoc-openapi (Swagger UI)

## Configuração
Ajuste `src/main/resources/application.yml`:

```yaml
spring:
  application:
    name: tcc
  datasource:
    url: jdbc:postgresql://localhost:12345/tccdb
    username: postgres
    password: postgres
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: update
    properties:
      hibernate.format_sql: true
  jackson:
    time-format: HH:mm
    serialization:
      write-dates-as-timestamps: false
jwt:
  private:
    key: "classpath:chave_privada.key"
  public:
    key: "classpath:chave_publica.pub"
```

- Gere um par RSA; salve a privada em `src/main/resources/chave_privada.key` e a pública em `src/main/resources/chave_publica.pub`.
- Ajuste o `datasource` conforme seu ambiente.

## Como rodar
- `./mvnw spring-boot:run` ou execute `com.projeto.tcc.TccApplication`
- Porta: 8080
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Autenticação (JWT)
Endpoints públicos:
- POST `/login` — autentica e retorna token
- POST `/sign-in` — cria usuário

Login request:
```json
{ "email": "user@empresa.com", "password": "sua_senha" }
```
Resposta:
```json
{ "token": "<jwt>", "exp": 300 }
```
Use:
```
Authorization: Bearer <jwt>
```

Escopos exigidos: `SCOPE_ADMIN`, `SCOPE_GERENTE` (conforme endpoint).

## Paginação e filtros
- `page-number` (default 0), `page-size` (default 10), além de filtros específicos por recurso.

## Endpoints

### Público
- POST `/login` — 200 OK: `LoginDTO { token, exp }`
- POST `/sign-in` — 201 Created (Location)

### Usuários (`/user`)
- GET `/user` — SCOPE_ADMIN, SCOPE_GERENTE — `page-number`, `page-size`
- GET `/user/{id}` — SCOPE_ADMIN, SCOPE_GERENTE
- PUT `/user/{id}` — SCOPE_ADMIN — body `UserDTO`
- DELETE `/user/{id}` — SCOPE_ADMIN

### Funcionários (`/employee`)
- POST `/employee` — SCOPE_ADMIN — body `EmployeeDTO`
- GET `/employee/{id}` — SCOPE_ADMIN, SCOPE_GERENTE
- PUT `/employee/{id}` — SCOPE_ADMIN — body `EmployeeDTO`
- DELETE `/employee/{id}` — SCOPE_ADMIN
- GET `/employee` — SCOPE_ADMIN, SCOPE_GERENTE — `employee-name`, `employee-id`, `shift`, `sector-name`, `page-number`, `page-size`

### Máquinas (`/machine`)
- POST `/machine` — SCOPE_ADMIN — body `MachineDTO`
- GET `/machine/{id}` — SCOPE_ADMIN, SCOPE_GERENTE
- PUT `/machine/{id}` — SCOPE_ADMIN — body `MachineDTO`
- DELETE `/machine/{id}` — SCOPE_ADMIN
- GET `/machine` — SCOPE_ADMIN, SCOPE_GERENTE — `machine-name`, `sector-name`, `status-machine`, `page-number`, `page-size`

### Modelos de Máquina (`/machine-model`)
- POST `/machine-model` — SCOPE_ADMIN — body `MachineModelDTO`
- GET `/machine-model/{id}` — SCOPE_ADMIN, SCOPE_GERENTE
- GET `/machine-model` — SCOPE_ADMIN, SCOPE_GERENTE — `numero-pagina`, `tamanho-pagina`
- PUT `/machine-model/{id}` — SCOPE_ADMIN — body `MachineModelDTO`
- DELETE `/machine-model/{id}` — SCOPE_ADMIN

### Departamentos (`/department`)
- POST `/department` — SCOPE_ADMIN — body `DepartmentDTO`
- GET `/department/{id}` — SCOPE_ADMIN, SCOPE_GERENTE
- PUT `/department/{id}` — SCOPE_ADMIN — body `DepartmentDTO`
- DELETE `/department/{id}` — SCOPE_ADMIN
- GET `/department` — SCOPE_ADMIN, SCOPE_GERENTE — `department-name`, `status-department`, `department-budget`, `page-size`, `page-number`

### Setores (`/sector`)
- POST `/sector` — SCOPE_ADMIN — body `SectorDTO`
- GET `/sector/{id}` — SCOPE_ADMIN, SCOPE_GERENTE
- PUT `/sector/{id}` — SCOPE_ADMIN — body `SectorDTO`
- DELETE `/sector/{id}` — SCOPE_ADMIN
- GET `/sector` — SCOPE_ADMIN, SCOPE_GERENTE — `department-name`, `sector-name`, `page-size` (default 0), `page-number` (default 10)

### Alocações (`/allocated-employee-machine`)
- POST `/allocated-employee-machine` — SCOPE_ADMIN, SCOPE_GERENTE — body `AllocatedEmployeeMachineDTO`
- GET `/allocated-employee-machine` — SCOPE_ADMIN, SCOPE_GERENTE — `page-size` (10), `page-number` (0), `name-employee`, `name-employee-changed`

## Erros de validação
Respostas incluem detalhes de campos (vide `ErrorField`, `ErrorResponse`).

## Build / Deploy
- `./mvnw -q -DskipTests package`
- Artefato: `target/tcc-0.0.1-SNAPSHOT.jar`
- Executar: `java -jar target/tcc-0.0.1-SNAPSHOT.jar`

## Observações para integração com Frontend/IA
- Obtenha JWT via `/login` e inclua em todas as chamadas protegidas.
- Use Swagger UI para schemas dos DTOs.
- Respeite os escopos exigidos por endpoint.

## Modelos de DTO (JSON)

Login (request `/login`):
```json
{
  "email": "user@empresa.com",
  "password": "sua_senha"
}
```

Login (response):
```json
{
  "token": "<jwt>",
  "exp": 300
}
```

UserDTO (sign-in e atualização de usuário):
```json
{
  "email": "admin@empresa.com",
  "password": "SenhaForte123!",
  "roles": ["ADMIN", "GERENTE"]
}
```

EmployeeDTO:
```json
{
  "name": "João Silva",
  "employeeID": 12345,
  "sector": 1,
  "shift": "MANHA",
  "status": "ATIVO",
  "photo": "https://exemplo.com/fotos/joao.jpg",
  "user": 10,
  "availability": true
}
```

MachineDTO:
```json
{
  "name": "Prensa 01",
  "sector": 1,
  "status": "OPERANDO",
  "oee": 0.92,
  "throughput": 120,
  "lastMaintenance": "2025-09-15",
  "photo": "https://exemplo.com/imagens/prensa01.jpg",
  "serieNumber": 12345,
  "machineModel": 2
}
```

MachineModelDTO:
```json
{
  "modelName": "Modelo X200",
  "modelDescription": "Modelo de alta performance"
}
```

DepartmentDTO:
```json
{
  "name": "Produção",
  "description": "Departamento de produção",
  "location": "Bloco A",
  "budget": 150000.00,
  "status": "ATIVO"
}
```

SectorDTO:
```json
{
  "name": "Usinagem",
  "efficiency": 0.85,
  "department": 1,
  "maximumQuantEmployee": 25
}
```

AllocatedEmployeeMachineDTO:
```json
{
  "employee": 5,
  "machine": 3
}
```

## Exemplos de DTOs de Resposta (JSON)

UserResultDTO:
```json
{
  "id": 1,
  "email": "admin@empresa.com",
  "username": "admin",
  "roles": [
    { "id": 1, "name": "ADMIN" }
  ],
  "employee": {
    "id": 10,
    "name": "João Silva",
    "photo": "https://exemplo.com/fotos/joao.jpg",
    "shift": "MANHA",
    "status": "ATIVO"
  }
}
```

EmployeeResultDTO:
```json
{
  "id": 10,
  "employeeID": 12345,
  "name": "João Silva",
  "photo": "https://exemplo.com/fotos/joao.jpg",
  "shift": "MANHA",
  "sector": {
    "id": 2,
    "name": "Usinagem",
    "efficiency": 0.85,
    "maximumQuantEmployee": 25
  },
  "status": "ATIVO",
  "availability": true,
  "user": {
    "id": 1,
    "email": "admin@empresa.com",
    "username": "admin",
    "roles": [ { "id": 1, "name": "ADMIN" } ]
  }
}
```

DepartmentResultDTO:
```json
{
  "id": 3,
  "name": "Produção",
  "description": "Departamento de produção",
  "location": "Bloco A",
  "budget": 150000.0,
  "status": "ATIVO",
  "sectors": [
    {
      "id": 2,
      "name": "Usinagem",
      "efficiency": "0.85",
      "department": {
        "id": 3,
        "name": "Produção",
        "description": "Departamento de produção",
        "location": "Bloco A",
        "budget": 150000.0,
        "status": "ATIVO"
      },
      "employees": [
        { "id": 10, "name": "João Silva", "photo": "https://exemplo.com/fotos/joao.jpg", "shift": "MANHA", "status": "ATIVO" }
      ],
      "machines": [
        { "id": 5, "name": "Prensa 01", "serieNumber": 12345, "modelMachine": { "modelName": "Modelo X200", "modelDescription": "Modelo de alta performance" }, "status": "OPERANDO", "oee": 0.92, "photo": "https://exemplo.com/imagens/prensa01.jpg", "throughput": 120, "lastMaintenance": "2025-09-15" }
      ],
      "maximumQuantEmployee": 25
    }
  ]
}
```

SectorResultDTO:
```json
{
  "id": 2,
  "name": "Usinagem",
  "efficiency": "0.85",
  "department": {
    "id": 3,
    "name": "Produção",
    "description": "Departamento de produção",
    "location": "Bloco A",
    "budget": 150000.0,
    "status": "ATIVO"
  },
  "employees": [
    { "id": 10, "name": "João Silva", "photo": "https://exemplo.com/fotos/joao.jpg", "shift": "MANHA", "status": "ATIVO" }
  ],
  "machines": [
    { "id": 5, "name": "Prensa 01", "serieNumber": 12345, "modelMachine": { "modelName": "Modelo X200", "modelDescription": "Modelo de alta performance" }, "status": "OPERANDO", "oee": 0.92, "photo": "https://exemplo.com/imagens/prensa01.jpg", "throughput": 120, "lastMaintenance": "2025-09-15" }
  ],
  "maximumQuantEmployee": 25
}
```

MachineResultDTO:
```json
{
  "id": 5,
  "name": "Prensa 01",
  "serieNumber": 12345,
  "modelMachine": { "modelName": "Modelo X200", "modelDescription": "Modelo de alta performance" },
  "status": "OPERANDO",
  "oee": 0.92,
  "photo": "https://exemplo.com/imagens/prensa01.jpg",
  "throughput": 120,
  "lastMaintence": "2025-09-15",
  "sector": { "id": 2, "name": "Usinagem", "efficiency": 0.85, "maximumQuantEmployee": 25 },
  "allocatedEmployeeMachine": [
    {
      "id": 100,
      "employee": { "id": 10, "name": "João Silva", "photo": "https://exemplo.com/fotos/joao.jpg", "shift": "MANHA", "status": "ATIVO" },
      "changedEmployee": { "id": 11, "name": "Maria Souza", "photo": "https://exemplo.com/fotos/maria.jpg", "shift": "TARDE", "status": "ATIVO" },
      "entryTime": "07:00:00",
      "departureTime": "15:00:00",
      "allocationDate": "2025-10-01",
      "machine": { "id": 5, "name": "Prensa 01", "serieNumber": 12345, "modelMachine": { "modelName": "Modelo X200", "modelDescription": "Modelo de alta performance" }, "status": "OPERANDO", "oee": 0.92, "photo": "https://exemplo.com/imagens/prensa01.jpg", "throughput": 120, "lastMaintenance": "2025-09-15" }
    }
  ]
}
```

MachineModelResultDTO:
```json
{
  "modelName": "Modelo X200",
  "modelDescription": "Modelo de alta performance",
  "machines": [
    { "id": 5, "name": "Prensa 01", "serieNumber": 12345, "modelMachine": { "modelName": "Modelo X200", "modelDescription": "Modelo de alta performance" }, "status": "OPERANDO", "oee": 0.92, "photo": "https://exemplo.com/imagens/prensa01.jpg", "throughput": 120, "lastMaintenance": "2025-09-15" }
  ]
}
```

AllocatedEmployeeMachineResultDTO:
```json
{
  "id": 100,
  "employee": { "id": 10, "name": "João Silva", "photo": "https://exemplo.com/fotos/joao.jpg", "shift": "MANHA", "status": "ATIVO" },
  "changedEmployee": { "id": 11, "name": "Maria Souza", "photo": "https://exemplo.com/fotos/maria.jpg", "shift": "TARDE", "status": "ATIVO" },
  "entryTime": "07:00:00",
  "departureTime": "15:00:00",
  "allocationDate": "2025-10-01",
  "machine": { "id": 5, "name": "Prensa 01", "serieNumber": 12345, "modelMachine": { "modelName": "Modelo X200", "modelDescription": "Modelo de alta performance" }, "status": "OPERANDO", "oee": 0.92, "photo": "https://exemplo.com/imagens/prensa01.jpg", "throughput": 120, "lastMaintenance": "2025-09-15" }
}
```

## Ambientes e Base URL
- Local: `http://localhost:8080`
- Produção/Homolog: defina e documente aqui (ex.: `https://api.seu-dominio.com`)

Sugestão de variáveis de ambiente no frontend:
- `VITE_API_URL` ou `NEXT_PUBLIC_API_URL`

## CORS e variáveis do Frontend
- Configure o frontend para ler `API_URL` e prefixar todas as chamadas.
- Caso necessário permitir origens específicas, configure CORS no backend (exemplo via `WebMvcConfigurer`).

Exemplo (referência) para habilitar CORS global no backend:
```java
// @Configuration
// public class CorsConfig implements WebMvcConfigurer {
//   @Override
//   public void addCorsMappings(CorsRegistry registry) {
//     registry.addMapping("/**")
//       .allowedOrigins("http://localhost:3000")
//       .allowedMethods("GET","POST","PUT","DELETE","PATCH","OPTIONS")
//       .allowedHeaders("*")
//       .allowCredentials(true);
//   }
// }
```

## Exemplos cURL
Login e uso do token:
```bash
curl -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@empresa.com","password":"SenhaForte123!"}'
```

```bash
TOKEN="<jwt>"
curl -X GET "$API_URL/employee?page-number=0&page-size=10" \
  -H "Authorization: Bearer $TOKEN"
```

Criação de recurso protegido (ex.: Department):
```bash
curl -X POST "$API_URL/department" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Produção",
    "description":"Departamento de produção",
    "location":"Bloco A",
    "budget":150000.00,
    "status":"ATIVO"
  }'
```

## Versionamento de API
- Atualmente sem prefixo de versão.
- Recomendado planejar `/v1` para estabilidade futura.

## Healthcheck (opcional)
Se desejar healthcheck automatizado:
- Adicione a dependência `spring-boot-starter-actuator` no `pom.xml`.
- Exponha `/actuator/health` (default) e, se necessário:
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info
```

## Padrão de erro
Estrutura padrão (`ErrorResponse`):
```json
{
  "statusErro": 400,
  "menssagem": "Mensagem de erro",
  "errosCampos": [
    { "field": "name", "message": "Por favor, preencha o campo" }
  ]
}
```

Notas:
- Códigos comuns: 400 (validação), 401 (não autenticado), 403 (sem escopo), 404 (não encontrado), 409 (conflito).
