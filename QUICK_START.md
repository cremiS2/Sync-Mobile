# 🚀 Quick Start - Iniciar Backend e Mobile

## ❌ Erro Atual: ERR_CONNECTION_REFUSED

Este erro significa que o **backend não está rodando**. Siga os passos abaixo:

---

## 📋 Passo a Passo

### 1️⃣ Instalar Dependências do Mobile

```bash
npm install axios @react-native-async-storage/async-storage
```

### 2️⃣ Iniciar o Backend Spring Boot

**Opção A: Via Maven Wrapper (Recomendado)**
```bash
# No diretório do backend
cd caminho/do/backend
./mvnw spring-boot:run
```

**Opção B: Via IDE**
- Abra o projeto backend na sua IDE (IntelliJ, Eclipse, VS Code)
- Execute a classe `TccApplication.java`

**Opção C: Via JAR compilado**
```bash
# Compilar
./mvnw clean package -DskipTests

# Executar
java -jar target/tcc-0.0.1-SNAPSHOT.jar
```

### 3️⃣ Verificar se o Backend Está Rodando

Abra o navegador e acesse:
```
http://localhost:8080/swagger-ui/index.html
```

Ou teste via curl:
```bash
curl http://localhost:8080/v3/api-docs
```

Se retornar JSON, o backend está funcionando! ✅

### 4️⃣ Criar Usuário de Teste

```bash
curl -X POST http://localhost:8080/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@empresa.com",
    "password": "SenhaForte123!",
    "roles": ["ADMIN"]
  }'
```

### 5️⃣ Iniciar o App Mobile

```bash
npm start
```

Pressione:
- `w` para abrir no navegador (web)
- `a` para abrir no emulador Android
- `i` para abrir no simulador iOS

### 6️⃣ Fazer Login

Use as credenciais:
- **Email**: `admin@empresa.com`
- **Senha**: `SenhaForte123!`

---

## 🔧 Configuração do Backend

### Requisitos
- **Java 21**
- **Maven 3.9+**
- **PostgreSQL** (ou MySQL)

### Configurar Banco de Dados

Edite `src/main/resources/application.yml` no backend:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/tccdb
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update
```

### Gerar Chaves RSA para JWT

```bash
# No diretório do backend
cd src/main/resources

# Gerar chave privada
openssl genrsa -out chave_privada.key 2048

# Gerar chave pública
openssl rsa -in chave_privada.key -pubout -out chave_publica.pub
```

---

## 📱 Configuração do Mobile

### URL do Backend

O arquivo `src/config/api.js` já está configurado para usar `http://localhost:8080`.

**Se estiver usando emulador Android**, altere para:
```javascript
export const API_BASE_URL = BACKEND_OPTIONS.LOCAL_ANDROID_EMULATOR;
```

**Se estiver usando dispositivo físico**, use o IP da sua máquina:
```javascript
export const API_BASE_URL = 'http://192.168.1.X:8080'; // Substitua X
```

Para descobrir seu IP:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

---

## ✅ Checklist de Verificação

Antes de testar, confirme:

- [ ] Backend está rodando em `http://localhost:8080`
- [ ] Swagger UI acessível em `http://localhost:8080/swagger-ui/index.html`
- [ ] Banco de dados configurado e rodando
- [ ] Chaves RSA geradas em `src/main/resources/`
- [ ] Usuário criado via `/sign-in`
- [ ] Dependências do mobile instaladas (`npm install`)
- [ ] URL correta em `src/config/api.js`

---

## 🐛 Problemas Comuns

### Backend não inicia

**Erro: "Port 8080 already in use"**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8080 | xargs kill -9
```

**Erro: "Cannot connect to database"**
- Verifique se o PostgreSQL está rodando
- Confirme usuário/senha em `application.yml`
- Crie o banco de dados: `CREATE DATABASE tccdb;`

**Erro: "JWT keys not found"**
- Gere as chaves RSA conforme instruções acima
- Verifique se estão em `src/main/resources/`

### Mobile não conecta

**ERR_CONNECTION_REFUSED**
- Backend não está rodando → Inicie o backend
- URL incorreta → Verifique `src/config/api.js`

**CORS Error**
- Configure CORS no backend (veja `TROUBLESHOOTING.md`)

**401 Unauthorized**
- Token expirado → Faça logout e login novamente
- Usuário não existe → Crie via `/sign-in`

---

## 🎯 Fluxo Completo de Teste

1. **Inicie o backend**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **Aguarde até ver**: `Started TccApplication in X seconds`

3. **Crie um usuário**
   ```bash
   curl -X POST http://localhost:8080/sign-in \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"Test123!","roles":["ADMIN"]}'
   ```

4. **Inicie o mobile**
   ```bash
   cd mobile
   npm start
   ```

5. **Abra no navegador** (pressione `w`)

6. **Faça login** com `test@test.com` / `Test123!`

7. **Navegue para "Funcionários"** → Deve carregar dados do backend

---

## 📞 Suporte

Se ainda tiver problemas:

1. Verifique os logs do backend no terminal
2. Abra o DevTools do navegador (F12) e veja o Console
3. Consulte `TROUBLESHOOTING.md` para erros específicos
4. Verifique se todas as dependências estão instaladas

---

## 🎉 Sucesso!

Se você conseguir:
- ✅ Ver o Swagger UI
- ✅ Criar um usuário
- ✅ Fazer login no app
- ✅ Ver dados carregando da API

**Parabéns! A integração está funcionando!** 🚀
