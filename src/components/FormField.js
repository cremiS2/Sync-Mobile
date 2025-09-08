import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function FormField({ label, placeholder, value, onChangeText, keyboardType = 'default', multiline = false, error }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, multiline && styles.multiline, error ? { borderColor: colors.danger } : null]}
        placeholder={placeholder}
        placeholderTextColor={colors.secondary}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    wrap: { marginBottom: 12 },
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
      color: COLORS.text,
      fontSize: 16,
    },
    multiline: { minHeight: 90, textAlignVertical: 'top' },
    error: { marginTop: 4, color: COLORS.danger, fontSize: 12 },
  });


