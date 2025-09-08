import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import CustomButton from '../../components/CustomButton';
import { createSector, updateSector, deleteSector } from '../../data/store';
import FormField from '../../components/FormField';
import SelectField from '../../components/SelectField';

export default function SetorFormScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const editing = route?.name?.includes('Edit');
  const data = route?.params?.data;

  const [nome, setNome] = useState(data?.name || '');
  const [departamento, setDepartamento] = useState(data?.departmentId || '');
  const [funcionarios, setFuncionarios] = useState(String(data?.employees || ''));
  const [eficiencia, setEficiencia] = useState(String(data?.efficiency || ''));
  const [producao, setProducao] = useState(String(data?.production || ''));
  const [errors, setErrors] = useState({});

  const handleSave = () => {
    const e = {};
    if (!nome.trim()) e.nome = 'Informe o nome';
    if (!departamento) e.departamento = 'Selecione um departamento';
    if (!funcionarios) e.funcionarios = 'Informe funcionários';
    if (eficiencia && (Number(eficiencia) < 0 || Number(eficiencia) > 100)) e.eficiencia = '0 a 100';
    setErrors(e);
    if (Object.keys(e).length) return;

    const payload = { name: nome.trim(), employees: Number(funcionarios) || 0, efficiency: Number(eficiencia) || 0, production: Number(producao) || 0, departmentId: departamento };
    if (editing) updateSector(data.id, payload); else createSector(payload);
    Alert.alert('Sucesso', editing ? 'Setor atualizado' : 'Setor criado');
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!editing) return;
    Alert.alert('Excluir', 'Deseja excluir este setor?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { deleteSector(data.id); navigation.goBack(); } },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{editing ? 'Editar Setor' : 'Novo Setor'}</Text>
      <FormField label="Nome" placeholder="Nome do setor" value={nome} onChangeText={setNome} error={errors.nome} />
      <SelectField label="Departamento" value={departamento} onSelect={setDepartamento} options={[
        { label: 'Produção', value: 'dep-1' },
        { label: 'TI', value: 'dep-2' },
      ]} placeholder="Selecione" error={errors.departamento} />
      <FormField label="Funcionários" placeholder="Quantidade" value={funcionarios} onChangeText={setFuncionarios} keyboardType="numeric" error={errors.funcionarios} />
      <FormField label="Eficiência (%)" placeholder="0-100" value={eficiencia} onChangeText={setEficiencia} keyboardType="numeric" error={errors.eficiencia} />
      <FormField label="Produção" placeholder="Unidades" value={producao} onChangeText={setProducao} keyboardType="numeric" />
      <CustomButton title={editing ? 'Salvar alterações' : 'Criar'} onPress={handleSave} style={{ marginTop: 12 }} />
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


