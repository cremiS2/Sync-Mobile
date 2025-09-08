import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import CustomButton from '../../components/CustomButton';
import { createMachine, updateMachine, deleteMachine } from '../../data/store';
import FormField from '../../components/FormField';
import SelectField from '../../components/SelectField';

export default function MaquinaFormScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const editing = route?.name?.includes('Edit');
  const data = route?.params?.data;

  const [nome, setNome] = useState(data?.name || '');
  const [departamento, setDepartamento] = useState(data?.departmentId || '');
  const [setor, setSetor] = useState(data?.sectorId || '');
  const [status, setStatus] = useState(data?.status || 'Operando');
  const [oee, setOee] = useState(String(data?.oee || ''));
  const [throughput, setThroughput] = useState(String(data?.throughput || ''));
  const [errors, setErrors] = useState({});

  const handleSave = () => {
    const e = {};
    if (!nome.trim()) e.nome = 'Informe o nome';
    if (!departamento) e.departamento = 'Selecione um departamento';
    if (!setor) e.setor = 'Selecione um setor';
    if (!status) e.status = 'Selecione o status';
    if (oee && (Number(oee) < 0 || Number(oee) > 100)) e.oee = 'OEE deve estar entre 0 e 100';
    setErrors(e);
    if (Object.keys(e).length) return;

    const payload = { name: nome.trim(), departmentId: departamento, sectorId: setor, status, oee: Number(oee) || 0, throughput: Number(throughput) || 0, lastMaintenance: new Date().toISOString(), photo: '' };
    if (editing) updateMachine(data.id, payload); else createMachine(payload);
    Alert.alert('Sucesso', editing ? 'Máquina atualizada' : 'Máquina criada');
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!editing) return;
    Alert.alert('Excluir', 'Deseja excluir esta máquina?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { deleteMachine(data.id); navigation.goBack(); } },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{editing ? 'Editar Máquina' : 'Nova Máquina'}</Text>
      <FormField label="Nome" placeholder="Nome da máquina" value={nome} onChangeText={setNome} error={errors.nome} />
      <SelectField label="Departamento" value={departamento} onSelect={setDepartamento} options={[
        { label: 'Produção', value: 'dep-1' },
        { label: 'TI', value: 'dep-2' },
      ]} placeholder="Selecione" error={errors.departamento} />
      <SelectField label="Setor" value={setor} onSelect={setSetor} options={[
        { label: 'Montagem', value: 'sec-1' },
        { label: 'Acabamento', value: 'sec-2' },
        { label: 'Infraestrutura', value: 'sec-3' },
      ]} placeholder="Selecione" error={errors.setor} />
      <SelectField label="Status" value={status} onSelect={setStatus} options={[
        { label: 'Operando', value: 'Operando' },
        { label: 'Parada', value: 'Parada' },
        { label: 'Manutenção', value: 'Manutenção' },
      ]} placeholder="Selecione" error={errors.status} />
      <FormField label="OEE (%)" placeholder="Ex.: 85" value={oee} onChangeText={setOee} keyboardType="numeric" error={errors.oee} />
      <FormField label="Throughput" placeholder="Peças/hora" value={throughput} onChangeText={setThroughput} keyboardType="numeric" />
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


