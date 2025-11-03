import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import CustomButton from '../../components/CustomButton';
import { createDepartment, updateDepartment, deleteDepartment } from '../../services/departmentService';
import FormField from '../../components/FormField';
import SelectField from '../../components/SelectField';

export default function DepartamentoFormScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const editing = route?.name?.includes('Edit');
  const data = route?.params?.data;

  const [nome, setNome] = useState(data?.name || '');
  const [descricao, setDescricao] = useState(data?.description || '');
  const [local, setLocal] = useState(data?.location || '');
  const [status, setStatus] = useState(data?.status || 'active');
  const [orcamento, setOrcamento] = useState(String(data?.budget || ''));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const e = {};
    if (!nome.trim()) e.nome = 'Informe o nome';
    if (!local.trim()) e.local = 'Informe o local';
    if (!status) e.status = 'Selecione o status';
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      setLoading(true);
      const payload = {
        name: nome.trim(),
        description: descricao.trim(),
        location: local.trim(),
        status,
        employees: 0,
        budget: Number(orcamento) || 0
      };
      
      if (editing) {
        await updateDepartment(data.id, payload);
      } else {
        await createDepartment(payload);
      }
      
      Alert.alert('Sucesso', editing ? 'Departamento atualizado' : 'Departamento criado');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível salvar o departamento');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!editing) return;
    Alert.alert('Excluir', 'Deseja excluir este departamento?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Excluir', 
        style: 'destructive', 
        onPress: async () => {
          try {
            setLoading(true);
            await deleteDepartment(data.id);
            Alert.alert('Sucesso', 'Departamento excluído');
            navigation.goBack();
          } catch (error) {
            Alert.alert('Erro', error.message || 'Não foi possível excluir o departamento');
          } finally {
            setLoading(false);
          }
        }
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{editing ? 'Editar Departamento' : 'Novo Departamento'}</Text>
      <FormField label="Nome" placeholder="Nome do departamento" value={nome} onChangeText={setNome} error={errors.nome} />
      <FormField label="Descrição" placeholder="Descrição" value={descricao} onChangeText={setDescricao} multiline />
      <FormField label="Local" placeholder="Ex.: Bloco A" value={local} onChangeText={setLocal} error={errors.local} />
      <SelectField label="Status" value={status} onSelect={setStatus} options={[
        { label: 'Ativo', value: 'active' },
        { label: 'Inativo', value: 'inactive' },
        { label: 'Manutenção', value: 'maintenance' },
      ]} placeholder="Selecione" error={errors.status} />
      <FormField label="Orçamento" placeholder="Valor em R$" value={orcamento} onChangeText={setOrcamento} keyboardType="numeric" />
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


