# 📱 Exemplos Práticos de Uso - Sync Mobile

Este documento contém exemplos práticos de como usar os serviços da API em suas telas React Native.

---

## 🔐 Exemplo: Tela de Login

```javascript
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { login } from '../services/authService';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const response = await login(email, password);
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Entrar" onPress={handleLogin} />
      )}
    </View>
  );
};

export default LoginScreen;
```

---

## 👷 Exemplo: Tela de Funcionários com Filtros

```javascript
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getEmployees } from '../services/employeeService';

const FuncionariosScreen = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    shift: '',
    sectorName: ''
  });

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees({
        pageNumber: page,
        pageSize: 10,
        ...filters
      });
      
      setEmployees(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [page, filters]);

  const renderEmployee = ({ item }) => (
    <TouchableOpacity 
      style={{ padding: 15, borderBottomWidth: 1 }}
      onPress={() => navigation.navigate('EmployeeDetail', { id: item.id })}
    >
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
      <Text>ID: {item.employeeID}</Text>
      <Text>Setor: {item.sector?.name}</Text>
      <Text>Turno: {item.shift}</Text>
      <Text>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Filtros aqui */}
      
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={employees}
          renderItem={renderEmployee}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={() => {
            if (page < totalPages - 1) {
              setPage(page + 1);
            }
          }}
          onEndReachedThreshold={0.5}
        />
      )}
      
      {/* Paginação */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <Button 
          title="Anterior" 
          onPress={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
        />
        <Text>Página {page + 1} de {totalPages}</Text>
        <Button 
          title="Próxima" 
          onPress={() => setPage(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
        />
      </View>
    </View>
  );
};

export default FuncionariosScreen;
```

---

## 🏭 Exemplo: Criar Nova Máquina

```javascript
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, ScrollView, Picker } from 'react-native';
import { createMachine } from '../services/machineService';
import { getSectors } from '../services/sectorService';
import { getMachineModels } from '../services/machineModelService';

const CreateMachineScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    status: 'OPERANDO',
    oee: '',
    throughput: '',
    lastMaintenance: '',
    photo: '',
    serieNumber: '',
    machineModel: ''
  });
  
  const [sectors, setSectors] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSectorsAndModels();
  }, []);

  const loadSectorsAndModels = async () => {
    try {
      const [sectorsData, modelsData] = await Promise.all([
        getSectors({ pageSize: 100 }),
        getMachineModels({ pageSize: 100 })
      ]);
      
      setSectors(sectorsData.content);
      setModels(modelsData.content);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar dados: ' + error.message);
    }
  };

  const handleSubmit = async () => {
    // Validações
    if (!formData.name || !formData.sector || !formData.serieNumber) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const machineData = {
        ...formData,
        sector: parseInt(formData.sector),
        oee: parseFloat(formData.oee),
        throughput: parseInt(formData.throughput),
        serieNumber: parseInt(formData.serieNumber),
        machineModel: parseInt(formData.machineModel)
      };

      await createMachine(machineData);
      Alert.alert('Sucesso', 'Máquina criada com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <TextInput
        placeholder="Nome da Máquina *"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />
      
      <Picker
        selectedValue={formData.sector}
        onValueChange={(value) => setFormData({ ...formData, sector: value })}
      >
        <Picker.Item label="Selecione o Setor *" value="" />
        {sectors.map(sector => (
          <Picker.Item key={sector.id} label={sector.name} value={sector.id.toString()} />
        ))}
      </Picker>
      
      <Picker
        selectedValue={formData.status}
        onValueChange={(value) => setFormData({ ...formData, status: value })}
      >
        <Picker.Item label="Operando" value="OPERANDO" />
        <Picker.Item label="Parada" value="PARADA" />
        <Picker.Item label="Em Manutenção" value="EM_MANUTENCAO" />
        <Picker.Item label="Avariada" value="AVARIADA" />
      </Picker>
      
      <TextInput
        placeholder="OEE (%)"
        value={formData.oee}
        onChangeText={(text) => setFormData({ ...formData, oee: text })}
        keyboardType="numeric"
      />
      
      <TextInput
        placeholder="Throughput *"
        value={formData.throughput}
        onChangeText={(text) => setFormData({ ...formData, throughput: text })}
        keyboardType="numeric"
      />
      
      <TextInput
        placeholder="Última Manutenção (YYYY-MM-DD)"
        value={formData.lastMaintenance}
        onChangeText={(text) => setFormData({ ...formData, lastMaintenance: text })}
      />
      
      <TextInput
        placeholder="Número de Série (5 dígitos) *"
        value={formData.serieNumber}
        onChangeText={(text) => setFormData({ ...formData, serieNumber: text })}
        keyboardType="numeric"
        maxLength={5}
      />
      
      <Picker
        selectedValue={formData.machineModel}
        onValueChange={(value) => setFormData({ ...formData, machineModel: value })}
      >
        <Picker.Item label="Selecione o Modelo" value="" />
        {models.map(model => (
          <Picker.Item key={model.id} label={model.modelName} value={model.id.toString()} />
        ))}
      </Picker>
      
      <Button 
        title={loading ? "Salvando..." : "Criar Máquina"} 
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
};

export default CreateMachineScreen;
```

---

## 📦 Exemplo: Tela de Estoque

```javascript
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Button, Alert, TouchableOpacity } from 'react-native';
import { getStock, deleteStock } from '../services/stockService';

const EstoqueScreen = ({ navigation }) => {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // API de estoque começa em 1

  const loadStock = async () => {
    setLoading(true);
    try {
      const response = await getStock({
        pageNumber: page,
        pageSize: 10
      });
      
      setStockItems(response.content);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStock();
  }, [page]);

  const handleDelete = (id, nome) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir "${nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStock(id);
              Alert.alert('Sucesso', 'Item excluído com sucesso');
              loadStock();
            } catch (error) {
              Alert.alert('Erro', error.message);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={{ padding: 15, borderBottomWidth: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.nome}</Text>
          <Text>Código: {item.codigo}</Text>
          <Text>Categoria: {item.categoria}</Text>
          <Text>Quantidade: {item.quantidade} {item.unidade}</Text>
          <Text>Preço: R$ {item.precoUnitario.toFixed(2)}</Text>
          <Text>Localização: {item.localizacao}</Text>
          <Text>Status: {item.status}</Text>
        </View>
        <View>
          <TouchableOpacity 
            onPress={() => navigation.navigate('EditStock', { id: item.id })}
            style={{ padding: 5 }}
          >
            <Text style={{ color: 'blue' }}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleDelete(item.id, item.nome)}
            style={{ padding: 5 }}
          >
            <Text style={{ color: 'red' }}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Button 
        title="Adicionar Item" 
        onPress={() => navigation.navigate('CreateStock')}
      />
      
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={stockItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshing={loading}
          onRefresh={loadStock}
        />
      )}
    </View>
  );
};

export default EstoqueScreen;
```

---

## 📊 Exemplo: Tela de Relatórios

```javascript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import {
  downloadGeneralReport,
  downloadEmployeesReport,
  downloadMachinesReport
} from '../services/reportService';

const RelatoriosScreen = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('');

  const handleDownloadReport = async (type, downloadFunction) => {
    setLoading(true);
    setReportType(type);
    
    try {
      await downloadFunction();
      Alert.alert('Sucesso', 'Relatório gerado e salvo com sucesso!');
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
      setReportType('');
    }
  };

  const ReportButton = ({ title, type, onPress, icon }) => (
    <TouchableOpacity 
      style={styles.reportButton}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.reportTitle}>{title}</Text>
      {loading && reportType === type ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.arrow}>→</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Relatórios em PDF</Text>
      <Text style={styles.subtitle}>
        Selecione o tipo de relatório que deseja gerar
      </Text>

      <ReportButton
        title="Relatório Geral"
        type="geral"
        icon="📋"
        onPress={() => handleDownloadReport('geral', downloadGeneralReport)}
      />

      <ReportButton
        title="Relatório de Funcionários"
        type="funcionarios"
        icon="👷"
        onPress={() => handleDownloadReport('funcionarios', downloadEmployeesReport)}
      />

      <ReportButton
        title="Relatório de Máquinas"
        type="maquinas"
        icon="🏭"
        onPress={() => handleDownloadReport('maquinas', downloadMachinesReport)}
      />

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ Informações</Text>
        <Text style={styles.infoText}>
          • Os relatórios são gerados em tempo real{'\n'}
          • Formato: PDF{'\n'}
          • Após geração, você poderá compartilhar o arquivo{'\n'}
          • Requer permissão ADMIN ou GERENTE
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15
  },
  icon: {
    fontSize: 24,
    marginRight: 15
  },
  reportTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  arrow: {
    color: '#fff',
    fontSize: 20
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginTop: 30
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2'
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22
  }
});

export default RelatoriosScreen;
```

---

## 🔗 Exemplo: Alocar Funcionário em Máquina

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, Picker } from 'react-native';
import { getEmployees } from '../services/employeeService';
import { getMachines } from '../services/machineService';
import { createAllocation } from '../services/allocationService';

const AllocateScreen = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [machines, setMachines] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedMachine, setSelectedMachine] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [employeesData, machinesData] = await Promise.all([
        getEmployees({ pageSize: 100, availability: true }),
        getMachines({ pageSize: 100, statusMachine: 'OPERANDO' })
      ]);
      
      setEmployees(employeesData.content);
      setMachines(machinesData.content);
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleAllocate = async () => {
    if (!selectedEmployee || !selectedMachine) {
      Alert.alert('Erro', 'Selecione um funcionário e uma máquina');
      return;
    }

    setLoading(true);
    try {
      await createAllocation({
        employee: parseInt(selectedEmployee),
        machine: parseInt(selectedMachine)
      });
      
      Alert.alert('Sucesso', 'Funcionário alocado com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Funcionário:</Text>
      <Picker
        selectedValue={selectedEmployee}
        onValueChange={setSelectedEmployee}
      >
        <Picker.Item label="Selecione um funcionário" value="" />
        {employees.map(emp => (
          <Picker.Item 
            key={emp.id} 
            label={`${emp.name} - ${emp.sector?.name}`} 
            value={emp.id.toString()} 
          />
        ))}
      </Picker>

      <Text style={{ fontSize: 18, marginTop: 20, marginBottom: 10 }}>Máquina:</Text>
      <Picker
        selectedValue={selectedMachine}
        onValueChange={setSelectedMachine}
      >
        <Picker.Item label="Selecione uma máquina" value="" />
        {machines.map(machine => (
          <Picker.Item 
            key={machine.id} 
            label={`${machine.name} - ${machine.sector?.name}`} 
            value={machine.id.toString()} 
          />
        ))}
      </Picker>

      <Button 
        title={loading ? "Alocando..." : "Alocar"} 
        onPress={handleAllocate}
        disabled={loading}
      />
    </View>
  );
};

export default AllocateScreen;
```

---

## 🔍 Exemplo: Busca com Debounce

```javascript
import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text } from 'react-native';
import { getEmployees } from '../services/employeeService';

const SearchEmployeesScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce: aguarda 500ms após o usuário parar de digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 3) {
        searchEmployees();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const searchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees({
        employeeName: searchTerm,
        pageSize: 20
      });
      setResults(response.content);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Buscar funcionário..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={{ 
          borderWidth: 1, 
          borderColor: '#ccc', 
          padding: 10, 
          borderRadius: 5 
        }}
      />
      
      {loading && <Text>Buscando...</Text>}
      
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text>{item.sector?.name} - {item.shift}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default SearchEmployeesScreen;
```

---

## 🔄 Exemplo: Pull to Refresh

```javascript
import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl, View, Text } from 'react-native';
import { getMachines } from '../services/machineService';

const MachinesListScreen = () => {
  const [machines, setMachines] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadMachines = async () => {
    try {
      const response = await getMachines({ pageSize: 20 });
      setMachines(response.content);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadMachines();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMachines();
    setRefreshing(false);
  };

  return (
    <FlatList
      data={machines}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 15, borderBottomWidth: 1 }}>
          <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
          <Text>Status: {item.status}</Text>
          <Text>OEE: {item.oee}%</Text>
        </View>
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

export default MachinesListScreen;
```

---

## ✅ Dicas Importantes

### 1. Sempre use try-catch
```javascript
try {
  const data = await getEmployees();
  // Processar dados
} catch (error) {
  Alert.alert('Erro', error.message);
}
```

### 2. Mostre loading durante requisições
```javascript
const [loading, setLoading] = useState(false);

setLoading(true);
try {
  await createEmployee(data);
} finally {
  setLoading(false);
}
```

### 3. Valide dados antes de enviar
```javascript
if (!formData.name || !formData.email) {
  Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
  return;
}
```

### 4. Use paginação para listas grandes
```javascript
const [page, setPage] = useState(0);

const loadMore = () => {
  if (page < totalPages - 1) {
    setPage(page + 1);
  }
};
```

### 5. Implemente pull-to-refresh
```javascript
<FlatList
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
/>
```

---

**Última atualização**: Novembro 2024
