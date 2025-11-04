import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import CustomButton from '@/components/CustomButton';
import { createSector, updateSector, deleteSector } from '@/services/sectorService';
import { getDepartments } from '@/services/departmentService';
import FormField from '@/components/FormField';
import SelectField from '@/components/SelectField';

export default function SetorFormScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const editing = route?.name?.includes('Edit');
  const data = route?.params?.data;

  const [nome, setNome] = useState(data?.name || '');
  const [departamento, setDepartamento] = useState(data?.department?.id ? String(data.department.id) : '');
  const [funcionarios, setFuncionarios] = useState(String(data?.employees || ''));
  const [eficiencia, setEficiencia] = useState(String(data?.efficiency || ''));
  const [producao, setProducao] = useState(String(data?.production || ''));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      const deptData = await getDepartments({ pageSize: 100 });
      const deptArray = Array.isArray(deptData) ? deptData : (deptData?.content || []);
      setDepartments(deptArray);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSave = async () => {
    const e = {};
    if (!nome.trim()) e.nome = 'Informe o nome';
    if (!departamento) e.departamento = 'Selecione um departamento';
    if (!funcionarios) e.funcionarios = 'Informe funcionários';
    if (eficiencia && (Number(eficiencia) < 0 || Number(eficiencia) > 100)) e.eficiencia = '0 a 100';
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      setLoading(true);
      const payload = {
        name: nome.trim(),
        employees: Number(funcionarios) || 0,
        efficiency: Number(eficiencia) || 0,
        production: Number(producao) || 0,
        department: Number(departamento)
      };
      
      if (editing) {
        await updateSector(data.id, payload);
      } else {
        await createSector(payload);
      }
      
      Alert.alert('Sucesso', editing ? 'Setor atualizado' : 'Setor criado');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível salvar o setor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!editing) return;
    Alert.alert('Excluir', 'Deseja excluir este setor?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Excluir', 
        style: 'destructive', 
        onPress: async () => {
          try {
            setLoading(true);
            await deleteSector(data.id);
            Alert.alert('Sucesso', 'Setor excluído');
            navigation.goBack();
          } catch (error) {
            Alert.alert('Erro', error.message || 'Não foi possível excluir o setor');
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
      <Text style={styles.title}>{editing ? 'Editar Setor' : 'Novo Setor'}</Text>
      <FormField label="Nome" placeholder="Nome do setor" value={nome} onChangeText={setNome} error={errors.nome} />
      <SelectField 
        label="Departamento" 
        value={departamento} 
        onSelect={setDepartamento} 
        options={departments.map(d => ({ label: d.name, value: String(d.id) }))}
        placeholder="Selecione" 
        error={errors.departamento} 
      />
      <FormField label="Funcionários" placeholder="Quantidade" value={funcionarios} onChangeText={setFuncionarios} keyboardType="numeric" error={errors.funcionarios} />
      <FormField label="Eficiência (%)" placeholder="0-100" value={eficiencia} onChangeText={setEficiencia} keyboardType="numeric" error={errors.eficiencia} />
      <FormField label="Produção" placeholder="Unidades" value={producao} onChangeText={setProducao} keyboardType="numeric" />
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


