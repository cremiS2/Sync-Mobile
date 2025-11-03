# 📦 Dependências Opcionais - Sync Mobile

Este documento lista dependências opcionais que podem ser instaladas para funcionalidades adicionais.

---

## 📊 Relatórios PDF com Download Nativo

Para habilitar download e compartilhamento nativo de relatórios PDF no mobile:

### Instalação

```bash
npx expo install expo-file-system expo-sharing
```

### Após Instalação

Atualize o arquivo `src/services/reportService.js`:

```javascript
// Descomente estas linhas no início do arquivo:
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// E substitua a função downloadAndSharePDF por:
const downloadAndSharePDF = async (endpoint, filename) => {
  try {
    const response = await api.get(endpoint, {
      responseType: 'blob',
    });
    
    // Convert blob to base64
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64data = reader.result.split(',')[1];
          const fileUri = `${FileSystem.documentDirectory}${filename}`;
          
          // Save file
          await FileSystem.writeAsStringAsync(fileUri, base64data, {
            encoding: FileSystem.EncodingType.Base64,
          });
          
          // Share file
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
          } else {
            throw new Error('Compartilhamento não disponível neste dispositivo');
          }
          
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(response.data);
    });
  } catch (error) {
    throw handleError(error);
  }
};
```

### Funcionalidades Habilitadas

- ✅ Download de PDFs para o dispositivo
- ✅ Compartilhamento nativo (WhatsApp, Email, etc.)
- ✅ Salvamento em pasta de documentos
- ✅ Visualização offline

---

## 📸 Upload de Imagens

Para habilitar upload de fotos de funcionários e máquinas:

### Instalação

```bash
npx expo install expo-image-picker
```

### Exemplo de Uso

```javascript
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  // Solicitar permissão
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== 'granted') {
    Alert.alert('Erro', 'Permissão de acesso à galeria negada');
    return;
  }

  // Selecionar imagem
  const result = await ImagePicker.launchImagePickerAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
    base64: true,
  });

  if (!result.canceled) {
    const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
    // Usar base64Image no campo photo
    setFormData({ ...formData, photo: base64Image });
  }
};
```

---

## 📅 Seletor de Data

Para campos de data (lastMaintenance, dataEntrada, etc.):

### Instalação

```bash
npx expo install @react-native-community/datetimepicker
```

### Exemplo de Uso

```javascript
import DateTimePicker from '@react-native-community/datetimepicker';

const [date, setDate] = useState(new Date());
const [showPicker, setShowPicker] = useState(false);

const onChange = (event, selectedDate) => {
  setShowPicker(false);
  if (selectedDate) {
    setDate(selectedDate);
    // Formatar para YYYY-MM-DD
    const formatted = selectedDate.toISOString().split('T')[0];
    setFormData({ ...formData, lastMaintenance: formatted });
  }
};

// No render:
<TouchableOpacity onPress={() => setShowPicker(true)}>
  <Text>{date.toLocaleDateString()}</Text>
</TouchableOpacity>

{showPicker && (
  <DateTimePicker
    value={date}
    mode="date"
    display="default"
    onChange={onChange}
  />
)}
```

---

## 🔔 Notificações Push

Para notificações de máquinas em manutenção, estoque baixo, etc.:

### Instalação

```bash
npx expo install expo-notifications
```

### Configuração Básica

```javascript
import * as Notifications from 'expo-notifications';

// Configurar comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Solicitar permissão
const { status } = await Notifications.requestPermissionsAsync();

// Agendar notificação local
await Notifications.scheduleNotificationAsync({
  content: {
    title: "Manutenção Pendente",
    body: "A máquina Torno CNC 01 precisa de manutenção",
    data: { machineId: 1 },
  },
  trigger: { seconds: 60 },
});
```

---

## 📊 Gráficos e Dashboards

Para visualizações de dados (OEE, eficiência, etc.):

### Instalação

```bash
npm install react-native-chart-kit react-native-svg
```

### Exemplo de Uso

```javascript
import { LineChart } from 'react-native-chart-kit';

<LineChart
  data={{
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [{
      data: [78, 82, 75, 88, 85, 90]
    }]
  }}
  width={350}
  height={220}
  chartConfig={{
    backgroundColor: "#1cc910",
    backgroundGradientFrom: "#eff3ff",
    backgroundGradientTo: "#efefef",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  }}
  bezier
  style={{ marginVertical: 8, borderRadius: 16 }}
/>
```

---

## 🔍 Leitor de QR Code

Para escanear códigos de máquinas ou produtos:

### Instalação

```bash
npx expo install expo-camera expo-barcode-scanner
```

### Exemplo de Uso

```javascript
import { BarCodeScanner } from 'expo-barcode-scanner';

const [hasPermission, setHasPermission] = useState(null);
const [scanned, setScanned] = useState(false);

useEffect(() => {
  (async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  })();
}, []);

const handleBarCodeScanned = ({ type, data }) => {
  setScanned(true);
  Alert.alert('Código Escaneado', `Tipo: ${type}\nDados: ${data}`);
  // Buscar máquina/produto pelo código
};

if (hasPermission) {
  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={StyleSheet.absoluteFillObject}
    />
  );
}
```

---

## 🗺️ Localização

Para rastrear localização de funcionários ou equipamentos:

### Instalação

```bash
npx expo install expo-location
```

### Exemplo de Uso

```javascript
import * as Location from 'expo-location';

const getLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  
  if (status !== 'granted') {
    Alert.alert('Erro', 'Permissão de localização negada');
    return;
  }

  const location = await Location.getCurrentPositionAsync({});
  console.log('Localização:', location.coords);
  
  // Enviar para API se necessário
};
```

---

## 💾 Cache Offline

Para funcionar sem internet:

### Instalação

```bash
npm install @react-native-async-storage/async-storage
```

**Nota**: Já está instalado no projeto!

### Exemplo de Uso

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Salvar dados
const cacheData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar cache:', error);
  }
};

// Recuperar dados
const getCachedData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erro ao recuperar cache:', error);
    return null;
  }
};

// Exemplo: Cache de funcionários
const loadEmployees = async () => {
  try {
    // Tentar buscar da API
    const response = await getEmployees();
    await cacheData('employees', response.content);
    return response.content;
  } catch (error) {
    // Se falhar, usar cache
    const cached = await getCachedData('employees');
    if (cached) {
      Alert.alert('Modo Offline', 'Mostrando dados em cache');
      return cached;
    }
    throw error;
  }
};
```

---

## 🎨 UI Components Avançados

Para uma interface mais rica:

### Instalação

```bash
npm install react-native-paper
# ou
npm install @rneui/themed @rneui/base
```

### React Native Paper

```javascript
import { Button, Card, Title, Paragraph } from 'react-native-paper';

<Card>
  <Card.Content>
    <Title>Torno CNC 01</Title>
    <Paragraph>Status: Operando</Paragraph>
  </Card.Content>
  <Card.Actions>
    <Button>Ver Detalhes</Button>
  </Card.Actions>
</Card>
```

---

## 📝 Resumo de Instalação

Para instalar todas as dependências opcionais de uma vez:

```bash
# Relatórios e Arquivos
npx expo install expo-file-system expo-sharing

# Imagens
npx expo install expo-image-picker

# Data e Hora
npx expo install @react-native-community/datetimepicker

# Notificações
npx expo install expo-notifications

# Gráficos
npm install react-native-chart-kit react-native-svg

# QR Code
npx expo install expo-camera expo-barcode-scanner

# Localização
npx expo install expo-location

# UI Components
npm install react-native-paper
```

---

## ⚠️ Notas Importantes

1. **Permissões**: Algumas funcionalidades requerem permissões do usuário
2. **iOS**: Adicione descrições de uso no `app.json`:
   ```json
   {
     "expo": {
       "ios": {
         "infoPlist": {
           "NSCameraUsageDescription": "Necessário para escanear códigos",
           "NSPhotoLibraryUsageDescription": "Necessário para selecionar fotos",
           "NSLocationWhenInUseUsageDescription": "Necessário para rastreamento"
         }
       }
     }
   }
   ```

3. **Android**: Adicione permissões no `app.json`:
   ```json
   {
     "expo": {
       "android": {
         "permissions": [
           "CAMERA",
           "READ_EXTERNAL_STORAGE",
           "WRITE_EXTERNAL_STORAGE",
           "ACCESS_FINE_LOCATION"
         ]
       }
     }
   }
   ```

---

**Última atualização**: Novembro 2024
