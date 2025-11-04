import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import CustomButton from '@/components/CustomButton';
import { createMachine, updateMachine, deleteMachine } from '@/services/machineService';
import { getSectors } from '@/services/sectorService';
import { getDepartments } from '@/services/departmentService';
import FormField from '@/components/FormField';
import SelectField from '@/components/SelectField';

export default function MaquinaFormScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const editing = route?.name?.includes('Edit');
  const data = route?.params?.data;

  const [nome, setNome] = useState(data?.name || '');
  const [setor, setSetor] = useState(data?.sector?.id ? String(data.sector.id) : '');
  const [status, setStatus] = useState(data?.status || 'OPERANDO');
  const [oee, setOee] = useState(String(data?.oee || ''));
  const [throughput, setThroughput] = useState(String(data?.throughput || ''));
  const [serieNumber, setSerieNumber] = useState(String(data?.serieNumber || ''));
  const [machineModel, setMachineModel] = useState(data?.machineModel?.id ? String(data.machineModel.id) : '');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sectors, setSectors] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      const sectorsData = await getSectors({ pageSize: 100 });
      // A API retorna um objeto paginado com { content: [...] }
      const sectorsArray = Array.isArray(sectorsData) ? sectorsData : (sectorsData?.content || []);
      setSectors(sectorsArray);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSave = async () => {
    const e = {};
    if (!nome.trim()) e.nome = 'Informe o nome';
    if (!setor) e.setor = 'Selecione um setor';
    if (!status) e.status = 'Selecione o status';
    if (oee && (Number(oee) < 0 || Number(oee) > 1)) e.oee = 'OEE deve estar entre 0 e 1';
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      setLoading(true);
      const payload = {
        name: nome.trim(),
        sector: Number(setor),
        status: status,
        oee: Number(oee) || 0,
        throughput: Number(throughput) || 0,
        lastMaintenance: new Date().toISOString().split('T')[0],
        photo: '',
        serieNumber: Number(serieNumber) || 0,
        machineModel: machineModel ? Number(machineModel) : null
      };
      
      if (editing) {
        await updateMachine(data.id, payload);
      } else {
        await createMachine(payload);
      }
      
      Alert.alert('Sucesso', editing ? 'Máquina atualizada' : 'Máquina criada');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível salvar a máquina');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!editing) return;
    Alert.alert('Excluir', 'Deseja excluir esta máquina?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Excluir', 
        style: 'destructive', 
        onPress: async () => {
          try {
            setLoading(true);
            await deleteMachine(data.id);
            Alert.alert('Sucesso', 'Máquina excluída');
            navigation.goBack();
          } catch (error) {
            Alert.alert('Erro', error.message || 'Não foi possível excluir a máquina');
          } finally {
            setLoading(false);
          }
        }
      },
    ]);
  };

  if (loadingData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{editing ? 'Editar Máquina' : 'Nova Máquina'}</Text>
      <FormField label="Nome" placeholder="Nome da máquina" value={nome} onChangeText={setNome} error={errors.nome} />
      <SelectField 
        label="Setor" 
        value={setor} 
        onSelect={setSetor} 
        options={sectors.map(s => ({ label: s.name, value: String(s.id) }))}
        placeholder="Selecione" 
        error={errors.setor} 
      />
      <SelectField label="Status" value={status} onSelect={setStatus} options={[
        { label: 'Operando', value: 'OPERANDO' },
        { label: 'Parada', value: 'PARADA' },
        { label: 'Manutenção', value: 'MANUTENCAO' },
      ]} placeholder="Selecione" error={errors.status} />
      <FormField label="OEE (0-1)" placeholder="Ex.: 0.85" value={oee} onChangeText={setOee} keyboardType="numeric" error={errors.oee} />
      <FormField label="Throughput" placeholder="Peças/hora" value={throughput} onChangeText={setThroughput} keyboardType="numeric" />
      <FormField label="Número de Série" placeholder="Ex.: 12345" value={serieNumber} onChangeText={setSerieNumber} keyboardType="numeric" />
      <CustomButton 
        title={editing ? 'Salvar alterações' : 'Criar'} 
        onPress={handleSave} 
        style={{ marginTop: 12 }}
        disabled={loading}
      />
      {loading && <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 12 }} />}
      {editing ? (
        <Pressable onPress={handleDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Excluir</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: COLORS.background,
      padding: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: COLORS.text,
      marginBottom: 12,
    },
    input: {
      width: '100%',
      height: 48,
      borderColor: COLORS.border,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 12,
      fontSize: 16,
      backgroundColor: COLORS.cardBg,
      color: COLORS.text,
    },
    deleteBtn: {
      marginTop: 12,
      alignItems: 'center',
      paddingVertical: 10,
    },
    deleteText: {
      color: '#d63031',
      fontWeight: '700',
    },
  });


