import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import SelectField from '@/components/SelectField';
import { createInventoryItem, updateInventoryItem, deleteInventoryItem } from '@/data/store';

export default function EstoqueFormScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const editing = route?.name?.includes('Edit');
  const data = route?.params?.data;

  const [name, setName] = useState(data?.name || '');
  const [sku, setSku] = useState(data?.sku || '');
  const [quantity, setQuantity] = useState(String(data?.quantity ?? ''));
  const [minStock, setMinStock] = useState(String(data?.minStock ?? ''));
  const [unit, setUnit] = useState(data?.unit || 'un');
  const [location, setLocation] = useState(data?.location || '');
  const [category, setCategory] = useState(data?.category || '');
  const [reserved, setReserved] = useState(String(data?.reserved ?? '0'));
  const [unitPrice, setUnitPrice] = useState(String(data?.unitPrice ?? '0'));
  const [errors, setErrors] = useState({});

  const handleSave = () => {
    const e = {};
    if (!name.trim()) e.name = 'Informe o nome do item';
    if (!sku.trim()) e.sku = 'Informe o SKU';
    const q = Number(quantity);
    const m = Number(minStock);
    const r = Number(reserved);
    const p = Number(unitPrice);
    if (!Number.isFinite(q)) e.quantity = 'Quantidade inválida';
    if (!Number.isFinite(m)) e.minStock = 'Estoque mínimo inválido';
    if (!Number.isFinite(r) || r < 0) e.reserved = 'Reservado inválido';
    if (!Number.isFinite(p) || p < 0) e.unitPrice = 'Preço inválido';
    if (!unit) e.unit = 'Selecione a unidade';
    if (!location.trim()) e.location = 'Informe a localização';
    if (!category.trim()) e.category = 'Informe a categoria';
    setErrors(e);
    if (Object.keys(e).length) return;

    const payload = { name: name.trim(), sku: sku.trim(), quantity: q, minStock: m, unit, location: location.trim(), category: category.trim(), reserved: r, unitPrice: p };
    if (editing) updateInventoryItem(data.id, payload); else createInventoryItem(payload);
    Alert.alert('Sucesso', editing ? 'Item atualizado' : 'Item criado');
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!editing) return;
    Alert.alert('Excluir', 'Deseja excluir este item?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { deleteInventoryItem(data.id); navigation.goBack(); } },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{editing ? 'Editar Item de Estoque' : 'Novo Item de Estoque'}</Text>
      <FormField label="Nome" placeholder="Nome do item" value={name} onChangeText={setName} error={errors.name} />
      <FormField label="SKU" placeholder="Código SKU" value={sku} onChangeText={setSku} error={errors.sku} />

      <View style={styles.row}>
        <View style={styles.col}>
          <FormField label="Quantidade" placeholder="0" keyboardType="numeric" value={quantity} onChangeText={setQuantity} error={errors.quantity} />
        </View>
        <View style={styles.col}>
          <FormField label="Estoque mínimo" placeholder="0" keyboardType="numeric" value={minStock} onChangeText={setMinStock} error={errors.minStock} />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.col}>
          <FormField label="Reservado" placeholder="0" keyboardType="numeric" value={reserved} onChangeText={setReserved} error={errors.reserved} />
        </View>
        <View style={styles.col}>
          <FormField label="Preço unitário (R$)" placeholder="0,00" keyboardType="decimal-pad" value={unitPrice} onChangeText={setUnitPrice} error={errors.unitPrice} />
        </View>
      </View>

      <SelectField label="Unidade" value={unit} onSelect={setUnit} options={[
        { label: 'Unidades (un)', value: 'un' },
        { label: 'Peças (pz)', value: 'pz' },
        { label: 'Quilos (kg)', value: 'kg' },
        { label: 'Litros (L)', value: 'L' },
      ]} placeholder="Selecione" error={errors.unit} />
      <FormField label="Localização" placeholder="Ex: Almox A1" value={location} onChangeText={setLocation} error={errors.location} />
      <FormField label="Categoria" placeholder="Ex: Matéria-prima" value={category} onChangeText={setCategory} error={errors.category} />
      <CustomButton title={editing ? 'Salvar alterações' : 'Criar'} onPress={handleSave} style={{ marginTop: 8 }} />
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
      paddingBottom: 24,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: COLORS.text,
      marginBottom: 8,
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    col: {
      flex: 1,
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
