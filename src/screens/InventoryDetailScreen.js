import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Modal, TextInput } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';
import { deleteInventoryItem, updateInventoryItem } from '@/data/store';

export default function InventoryDetailScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const data = route?.params?.data || {};

  const available = Math.max((data.quantity || 0) - (data.reserved || 0), 0);
  const totalValue = available * (data.unitPrice || 0);

  const [reserveModal, setReserveModal] = useState(false);
  const [reserveQty, setReserveQty] = useState('0');
  const fmtBRL = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(n || 0));

  const handleDelete = () => {
    Alert.alert('Excluir', 'Deseja excluir este item?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { deleteInventoryItem(data.id); navigation.goBack(); } },
    ]);
  };

  const handleReserve = () => {
    const qty = Number(reserveQty);
    if (!Number.isFinite(qty) || qty <= 0) {
      Alert.alert('Reservar', 'Informe uma quantidade válida.');
      return;
    }
    const newReserved = Number(data.reserved || 0) + qty;
    updateInventoryItem(data.id, { reserved: newReserved });
    setReserveModal(false);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{data.name}</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>{data.status}</Text></View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Código (SKU)</Text>
        <Text style={styles.value}>{data.sku}</Text>
        <Text style={styles.label}>Categoria</Text>
        <Text style={styles.value}>{data.category || '-'}</Text>
        <Text style={styles.label}>Localização</Text>
        <Text style={styles.value}>{data.location || '-'}</Text>
      </View>
      <View style={styles.cardRow}>
        <View style={styles.cardCol}>
          <Text style={styles.label}>Quantidade</Text>
          <Text style={styles.valueBold}>{data.quantity}</Text>
        </View>
        <View style={styles.cardCol}>
          <Text style={styles.label}>Reservado</Text>
          <Text style={styles.valueBold}>{data.reserved || 0}</Text>
        </View>
        <View style={styles.cardCol}>
          <Text style={styles.label}>Disponível</Text>
          <Text style={styles.valueBold}>{available}</Text>
        </View>
      </View>
      <View style={styles.cardRow}>
        <View style={styles.cardCol}>
          <Text style={styles.label}>Preço unitário</Text>
          <Text style={styles.value}>{fmtBRL(data.unitPrice)}</Text>
        </View>
        <View style={styles.cardCol}>
          <Text style={styles.label}>Valor total</Text>
          <Text style={styles.value}>{fmtBRL(totalValue)}</Text>
        </View>
      </View>

      <CustomButton title="Editar" onPress={() => navigation.navigate('InventoryEdit', { data })} />
      <CustomButton title="Reservar" onPress={() => { setReserveQty('0'); setReserveModal(true); }} style={{ marginTop: 8 }} />
      <Pressable onPress={handleDelete} style={styles.deleteBtn}><Text style={styles.deleteText}>Excluir</Text></Pressable>

      <Modal visible={reserveModal} transparent animationType="fade" onRequestClose={() => setReserveModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Reservar quantidade</Text>
            <TextInput
              keyboardType="numeric"
              value={reserveQty}
              onChangeText={setReserveQty}
              placeholder="0"
              style={styles.input}
            />
            <CustomButton title="Confirmar" onPress={handleReserve} />
            <Pressable onPress={() => setReserveModal(false)} style={styles.closeBtn}><Text style={styles.closeText}>Cancelar</Text></Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  cardCol: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 12,
  },
  label: {
    color: COLORS.secondary,
    fontSize: 12,
    marginBottom: 2,
  },
  value: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  valueBold: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },
  deleteBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 10,
  },
  deleteText: {
    color: '#d63031',
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000055',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalSheet: {
    width: '100%',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  input: {
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
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 8,
  },
  closeText: {
    color: COLORS.secondary,
    fontWeight: '700',
  },
});
