# Guia de Integração - Backend com Mobile

Este guia explica como conectar o aplicativo mobile SyncMob com o backend Spring Boot.

## 📋 Pré-requisitos

1. **Backend rodando**: O backend Spring Boot deve estar rodando em `http://localhost:8080`
2. **Node.js**: Versão 18 ou superior
3. **Expo CLI**: Para rodar o app mobile

## 🔧 Instalação das Dependências

Execute o comando para instalar as novas dependências necessárias:

```bash
npm install axios @react-native-async-storage/async-storage
```

## ⚙️ Configuração

### 1. Configurar URL do Backend

Edite o arquivo `src/config/api.js` e altere a URL base conforme seu ambiente:

```javascript
// Para desenvolvimento local (emulador Android)
export const API_BASE_URL = 'http://10.0.2.2:8080';

// Para desenvolvimento local (dispositivo físico na mesma rede)
export const API_BASE_URL = 'http://192.168.1.X:8080'; // Substitua X pelo IP da sua máquina

// Para produção
export const API_BASE_URL = 'https://api.seu-dominio.com';
```

**Importante**: 
- **Emulador Android**: Use `http://10.0.2.2:8080` (aponta para localhost da máquina host)
- **Emulador iOS**: Use `http://localhost:8080`
- **Dispositivo físico**: Use o IP da sua máquina na rede local (ex: `http://192.168.1.100:8080`)

### 2. Verificar Backend

Certifique-se de que o backend está rodando e acessível:

```bash
# Testar se o backend está respondendo
curl http://localhost:8080/v3/api-docs
```

## 🚀 Estrutura Criada

### Arquivos de Configuração
- **`src/config/api.js`**: Configurações da API (URL base, endpoints)

### Serviços de API
- **`src/services/api.js`**: Cliente axios configurado com interceptors para JWT
- **`src/services/authService.js`**: Serviços de autenticação (login, signup, logout)
- **`src/services/employeeService.js`**: CRUD de funcionários
- **`src/services/machineService.js`**: CRUD de máquinas
- **`src/services/departmentService.js`**: CRUD de departamentos
- **`src/services/sectorService.js`**: CRUD de setores

### Contextos
- **`src/contexts/AuthContext.js`**: Gerenciamento de estado de autenticação e JWT

## 📱 Como Usar

### 1. Autenticação

O `AuthContext` gerencia automaticamente o token JWT:

```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { login, logout, isLoggedIn, user } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login('user@empresa.com', 'senha123');
      // Login bem-sucedido, token salvo automaticamente
    } catch (error) {
      console.error('Erro no login:', error.message);
    }
  };
  
  return (
    // seu componente
  );
}
```

### 2. Consumir APIs

Exemplo de uso dos serviços:

```javascript
import { getEmployees, createEmployee } from '../services/employeeService';

// Listar funcionários com paginação
const employees = await getEmployees({
  pageNumber: 0,
  pageSize: 10,
  employeeName: 'João'
});

// Criar funcionário
const newEmployee = await createEmployee({
  name: 'João Silva',
  employeeID: 12345,
  sector: 1,
  shift: 'MANHA',
  status: 'ATIVO',
  photo: 'https://exemplo.com/foto.jpg',
  user: 10,
  availability: true
});
```

### 3. Tratamento de Erros

Todos os serviços retornam erros tratados:

```javascript
try {
  const data = await getEmployees();
} catch (error) {
  // error.message contém a mensagem de erro do backend
  Alert.alert('Erro', error.message);
}
```

## 🔐 Autenticação JWT

O token JWT é gerenciado automaticamente:

1. **Login**: Token é salvo no AsyncStorage após login bem-sucedido
2. **Requisições**: Token é adicionado automaticamente no header `Authorization: Bearer <token>`
3. **Expiração**: Token é removido automaticamente quando expira (401)
4. **Logout**: Token é removido do AsyncStorage

## 📊 Mapeamento de Endpoints

### Autenticação
- `POST /login` → `authService.login(email, password)`
- `POST /sign-in` → `authService.signUp(userData)`

### Funcionários
- `GET /employee` → `employeeService.getEmployees(params)`
- `GET /employee/{id}` → `employeeService.getEmployeeById(id)`
- `POST /employee` → `employeeService.createEmployee(data)`
- `PUT /employee/{id}` → `employeeService.updateEmployee(id, data)`
- `DELETE /employee/{id}` → `employeeService.deleteEmployee(id)`

### Máquinas
- `GET /machine` → `machineService.getMachines(params)`
- `GET /machine/{id}` → `machineService.getMachineById(id)`
- `POST /machine` → `machineService.createMachine(data)`
- `PUT /machine/{id}` → `machineService.updateMachine(id, data)`
- `DELETE /machine/{id}` → `machineService.deleteMachine(id)`

### Departamentos
- `GET /department` → `departmentService.getDepartments(params)`
- `GET /department/{id}` → `departmentService.getDepartmentById(id)`
- `POST /department` → `departmentService.createDepartment(data)`
- `PUT /department/{id}` → `departmentService.updateDepartment(id, data)`
- `DELETE /department/{id}` → `departmentService.deleteDepartment(id)`

### Setores
- `GET /sector` → `sectorService.getSectors(params)`
- `GET /sector/{id}` → `sectorService.getSectorById(id)`
- `POST /sector` → `sectorService.createSector(data)`
- `PUT /sector/{id}` → `sectorService.updateSector(id, data)`
- `DELETE /sector/{id}` → `sectorService.deleteSector(id)`

## 🧪 Testando a Integração

### 1. Criar um usuário no backend

```bash
curl -X POST http://localhost:8080/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@empresa.com",
    "password": "SenhaForte123!",
    "roles": ["ADMIN"]
  }'
```

### 2. Testar login no app

1. Inicie o app: `npm start`
2. Na tela de login, use as credenciais criadas
3. O app deve fazer login e navegar para a tela principal

### 3. Verificar token

O token JWT é salvo automaticamente no AsyncStorage. Para debug, você pode verificar:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const token = await AsyncStorage.getItem('@syncmob_token');
console.log('Token:', token);
```

## 🐛 Troubleshooting

### Erro: "Não foi possível conectar ao servidor"

1. Verifique se o backend está rodando
2. Verifique a URL em `src/config/api.js`
3. Se estiver usando emulador Android, use `http://10.0.2.2:8080`
4. Se estiver usando dispositivo físico, use o IP da sua máquina

### Erro 401: "Não autenticado"

1. Verifique se o token está sendo salvo corretamente
2. Verifique se o token não expirou
3. Faça logout e login novamente

### Erro 403: "Acesso negado"

1. Verifique se o usuário tem as permissões necessárias (SCOPE_ADMIN ou SCOPE_GERENTE)
2. Verifique as roles do usuário no backend

### CORS Error

Se estiver tendo problemas de CORS, configure no backend:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
      .allowedOrigins("*")
      .allowedMethods("GET","POST","PUT","DELETE","PATCH","OPTIONS")
      .allowedHeaders("*");
  }
}
```

## 📝 Próximos Passos

1. **Atualizar outras telas**: Aplicar o mesmo padrão usado em `FuncionariosScreen` para as outras telas (Máquinas, Departamentos, Setores)
2. **Implementar busca**: Adicionar funcionalidade de busca usando os filtros da API
3. **Implementar paginação**: Adicionar scroll infinito para carregar mais dados
4. **Tratamento de erros**: Melhorar feedback visual de erros
5. **Offline mode**: Implementar cache local para funcionar offline

## 🔗 Referências

- [Documentação do Backend](./READMEBACK.md)
- [Axios Documentation](https://axios-http.com/)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)
