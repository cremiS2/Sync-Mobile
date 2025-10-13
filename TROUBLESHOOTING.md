# Troubleshooting - Resolução de Problemas

## ❌ Erro: CORS / Site Disabled (403)

### Problema
```
Access to XMLHttpRequest at 'https://sync-d8hac6hdg3czc4aa.brazilsouth-01.azurewebsites.net/employee' 
from origin 'http://localhost:8081' has been blocked by CORS policy
```

ou

```
GET https://sync-d8hac6hdg3czc4aa.brazilsouth-01.azurewebsites.net/employee net::ERR_FAILED 403 (Site Disabled)
```

### Causa
1. **Site Azure desabilitado**: O backend no Azure está desabilitado ou pausado
2. **CORS não configurado**: O backend não permite requisições do localhost

### Solução

#### Opção 1: Usar Backend Local (Recomendado para desenvolvimento)

1. **Inicie o backend Spring Boot localmente**:
   ```bash
   cd caminho/do/backend
   ./mvnw spring-boot:run
   ```

2. **Configure o app mobile para usar localhost**:
   
   Edite `src/config/api.js`:
   ```javascript
   export const API_BASE_URL = BACKEND_OPTIONS.LOCAL;
   ```

3. **Se estiver usando emulador Android**, use:
   ```javascript
   export const API_BASE_URL = BACKEND_OPTIONS.LOCAL_ANDROID_EMULATOR;
   ```

#### Opção 2: Ativar o Site Azure

1. Acesse o portal do Azure
2. Vá para o App Service: `sync-d8hac6hdg3czc4aa`
3. Clique em "Start" para iniciar o serviço
4. Aguarde alguns minutos até o site estar ativo

#### Opção 3: Configurar CORS no Backend

Adicione esta classe no backend Spring Boot:

```java
package com.projeto.tcc.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(
                "http://localhost:8081",
                "http://localhost:3000",
                "http://10.0.2.2:8081"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

---

## ⚠️ Warning: useNativeDriver not supported

### Problema
```
Animated: `useNativeDriver` is not supported because the native animated module is missing
```

### Causa
O `useNativeDriver` não é suportado no React Native Web.

### Solução
✅ **Já corrigido!** O código agora detecta se está rodando na web e desabilita `useNativeDriver` automaticamente.

```javascript
const isWeb = Platform.OS === 'web';
Animated.spring(logoScale, { toValue: 1, useNativeDriver: !isWeb })
```

---

## ⚠️ Warning: shadow* props deprecated

### Problema
```
"shadow*" style props are deprecated. Use "boxShadow"
```

### Causa
React Native Web deprecou as propriedades `shadowColor`, `shadowOffset`, etc. em favor de `boxShadow`.

### Solução
Para manter compatibilidade entre web e mobile, você pode:

1. **Manter como está** (funciona, mas gera warnings)
2. **Usar StyleSheet condicional**:

```javascript
const styles = StyleSheet.create({
  card: {
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 2,
        }
    ),
  },
});
```

---

## ❌ Erro: Cannot record touch end without a touch start

### Problema
```
Cannot record touch end without a touch start
```

### Causa
Problema conhecido do React Native Web com eventos de toque.

### Solução
Este é um warning benigno que pode ser ignorado. Não afeta a funcionalidade do app.

---

## ❌ Erro: Blocked aria-hidden

### Problema
```
Blocked aria-hidden on an element because its descendant retained focus
```

### Causa
Problema de acessibilidade quando um modal/overlay está aberto e um elemento focado está dentro de um elemento com `aria-hidden`.

### Solução
Este é um warning de acessibilidade que pode ser ignorado em desenvolvimento. Para produção, considere usar bibliotecas de modal que gerenciam foco corretamente.

---

## 🔧 Checklist de Configuração

Antes de testar a integração, verifique:

- [ ] Backend está rodando (local ou Azure)
- [ ] URL correta em `src/config/api.js`
- [ ] Dependências instaladas: `npm install axios @react-native-async-storage/async-storage`
- [ ] Usuário criado no backend para teste
- [ ] CORS configurado no backend (se necessário)

---

## 🧪 Teste de Conexão

### 1. Testar Backend Diretamente

```bash
# Testar se o backend está respondendo
curl http://localhost:8080/v3/api-docs

# Testar login
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@empresa.com","password":"SenhaForte123!"}'
```

### 2. Verificar URL no App

Adicione um console.log temporário em `src/services/api.js`:

```javascript
console.log('API Base URL:', API_BASE_URL);
```

### 3. Testar Requisição Simples

Crie um componente de teste:

```javascript
import { useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export default function TestConnection() {
  useEffect(() => {
    fetch(`${API_BASE_URL}/v3/api-docs`)
      .then(res => res.json())
      .then(data => console.log('Backend conectado:', data))
      .catch(err => console.error('Erro ao conectar:', err));
  }, []);
  
  return null;
}
```

---

## 📱 Configuração por Plataforma

### Web (localhost:8081)
```javascript
export const API_BASE_URL = BACKEND_OPTIONS.LOCAL; // http://localhost:8080
```

### Android Emulator
```javascript
export const API_BASE_URL = BACKEND_OPTIONS.LOCAL_ANDROID_EMULATOR; // http://10.0.2.2:8080
```

### iOS Simulator
```javascript
export const API_BASE_URL = BACKEND_OPTIONS.LOCAL; // http://localhost:8080
```

### Dispositivo Físico (mesma rede)
```javascript
export const API_BASE_URL = 'http://192.168.1.X:8080'; // IP da sua máquina
```

### Produção (Azure)
```javascript
export const API_BASE_URL = BACKEND_OPTIONS.AZURE;
```

---

## 🆘 Ainda com problemas?

1. **Limpe o cache**:
   ```bash
   npm start -- --clear
   ```

2. **Reinstale dependências**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Verifique logs do backend**:
   - Procure por erros de CORS
   - Verifique se as rotas estão registradas
   - Confirme que o JWT está configurado

4. **Use ferramentas de debug**:
   - React Native Debugger
   - Chrome DevTools (para web)
   - Postman/Insomnia para testar API diretamente
