import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export default function FAB({ onPress, icon = "add", style, size = 60 }) {
  const { colors } = useTheme();
  const styles = createStyles(colors, size);

  return (
    <Pressable style={[styles.fab, style]} onPress={onPress}>
      <Ionicons name={icon} size={26} color={colors.background} />
    </Pressable>
  );
}

const createStyles = (colors, size) => StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
