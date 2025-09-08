import React, { useRef } from 'react';
import { Text, StyleSheet, Animated, Pressable } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function CustomButton({ title, onPress, style }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const scale = useRef(new Animated.Value(1)).current;

  const handleIn = () => {
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start();
  };
  const handleOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={handleIn} onPressOut={handleOut} style={{ borderRadius: 8 }}>
      <Animated.View style={[styles.button, style, { transform: [{ scale }] }]}>
        <Text style={styles.buttonText}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    button: {
      backgroundColor: COLORS.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      elevation: 2,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    buttonText: {
      color: COLORS.background,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
