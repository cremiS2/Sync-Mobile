import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, FlatList } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function SelectField({ label, value, onSelect, options = [], placeholder = 'Selecionar', error }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [open, setOpen] = React.useState(false);

  const selected = options.find(o => o.value === value);

  return (
    <View style={{ marginBottom: 12 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable style={[styles.input, error ? { borderColor: colors.danger } : null]} onPress={() => setOpen(true)}>
        <Text style={[styles.valueText, !selected ? { color: colors.secondary } : null]}>
          {selected ? selected.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.secondary} />
      </Pressable>
      {!!error && <Text style={styles.error}>{error}</Text>}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onSelect(item.value);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </Pressable>
              )}
            />
            <Pressable style={styles.cancelBtn} onPress={() => setOpen(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    label: { color: COLORS.text, fontWeight: '600', marginBottom: 6 },
    input: {
      width: '100%',
      minHeight: 48,
      borderColor: COLORS.border,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: COLORS.cardBg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    valueText: { color: COLORS.text, fontSize: 16 },
    error: { marginTop: 4, color: COLORS.danger, fontSize: 12 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
    modalCard: { width: '86%', maxHeight: '70%', backgroundColor: COLORS.cardBg, borderRadius: 12, padding: 12 },
    option: { paddingVertical: 12 },
    optionText: { color: COLORS.text, fontSize: 16 },
    cancelBtn: { alignItems: 'center', paddingVertical: 10, marginTop: 6 },
    cancelText: { color: COLORS.primary, fontWeight: '700' },
  });


