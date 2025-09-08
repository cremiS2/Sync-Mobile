import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import CustomButton from '../../components/CustomButton';
import { createEmployee, updateEmployee, deleteEmployee } from '../../data/store';
import FormField from '../../components/FormField';
import SelectField from '../../components/SelectField';

export default function FuncionarioFormScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const editing = route?.name?.includes('Edit');
  const data = route?.params?.data;

  const [nome, setNome] = useState(data?.name || '');
  const [cargo, setCargo] = useState(data?.role || '');
  const [setor, setSetor] = useState(data?.sectorId || '');
  const [departamento, setDepartamento] = useState(data?.departmentId || '');
  const [turno, setTurno] = useState(data?.shift || 'Manhã');
  const [status, setStatus] = useState(data?.status || 'Active');
  const [errors, setErrors] = useState({});

  const handleSave = () => {
    const e = {};
    if (!nome.trim()) e.nome = 'Informe o nome';
    if (!cargo.trim()) e.cargo = 'Informe o cargo';
    if (!departamento) e.departamento = 'Selecione um departamento';
    if (!setor) e.setor = 'Selecione um setor';
    if (!status) e.status = 'Selecione o status';
    setErrors(e);
    if (Object.keys(e).length) return;

    const payload = { name: nome.trim(), role: cargo.trim(), sectorId: setor, departmentId: departamento, shift: turno, status, photo: '' };
    if (editing) updateEmployee(data.id, payload); else createEmployee(payload);
    Alert.alert('Sucesso', editing ? 'Funcionário atualizado' : 'Funcionário criado');
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!editing) return;
    Alert.alert('Excluir', 'Deseja excluir este funcionário?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { deleteEmployee(data.id); navigation.goBack(); } },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{editing ? 'Editar Funcionário' : 'Novo Funcionário'}</Text>
      <FormField label="Nome" placeholder="Nome" value={nome} onChangeText={setNome} error={errors.nome} />
      <FormField label="Cargo" placeholder="Cargo" value={cargo} onChangeText={setCargo} error={errors.cargo} />
      <SelectField label="Departamento" value={departamento} onSelect={setDepartamento} options={[
        { label: 'Produção', value: 'dep-1' },
        { label: 'TI', value: 'dep-2' },
      ]} placeholder="Selecione" error={errors.departamento} />
      <SelectField label="Setor" value={setor} onSelect={setSetor} options={[
        { label: 'Montagem', value: 'sec-1' },
        { label: 'Acabamento', value: 'sec-2' },
        { label: 'Infraestrutura', value: 'sec-3' },
      ]} placeholder="Selecione" error={errors.setor} />
      <SelectField label="Turno" value={turno} onSelect={setTurno} options={[
        { label: 'Manhã', value: 'Manhã' },
        { label: 'Tarde', value: 'Tarde' },
        { label: 'Noite', value: 'Noite' },
      ]} />
      <SelectField label="Status" value={status} onSelect={setStatus} options={[
        { label: 'Active', value: 'Active' },
        { label: 'On Leave', value: 'On Leave' },
        { label: 'Medical Leave', value: 'Medical Leave' },
      ]} placeholder="Selecione" error={errors.status} />
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


