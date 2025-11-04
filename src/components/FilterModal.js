import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import SelectField from './SelectField';
import CustomButton from './CustomButton';

export default function FilterModal({
  visible,
  onClose,
  statusValue,
  onStatusChange,
  categoryValue,
  onCategoryChange,
  categoryOptions = [],
  onApply,
  onClear,
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Filtros</Text>
          <SelectField
            label="Status"
            value={statusValue}
            onSelect={onStatusChange}
            options={[
              { label: 'Todos', value: '' },
              { label: 'OK', value: 'OK' },
              { label: 'Atenção', value: 'Atenção' },
              { label: 'Crítico', value: 'Crítico' },
              { label: 'Sem estoque', value: 'Sem estoque' },
            ]}
          />
          <SelectField
            label="Categoria"
            value={categoryValue}
            onSelect={onCategoryChange}
            options={[{ label: 'Todas', value: '' }, ...categoryOptions.map(c => ({ label: c, value: c }))]}
          />
          <View style={styles.row}>
            <CustomButton title="Aplicar" onPress={onApply} style={{ flex: 1, marginRight: 8 }} />
            <CustomButton title="Limpar" onPress={onClear} style={{ flex: 1, marginLeft: 8 }} />
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn}><Text style={styles.closeText}>Fechar</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000055',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  sheet: {
    width: '100%',
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginTop: 8,
  },
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 8,
  },
  closeText: {
    color: colors.secondary,
    fontWeight: '700',
  },
});
