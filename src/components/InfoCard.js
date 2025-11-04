import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function InfoCard({ title, value, subtitle, color }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.98)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <Animated.View style={[styles.card, { borderLeftColor: color, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Animated.View>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    card: {
      backgroundColor: COLORS.cardBg,
      borderRadius: 8,
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 4,
      borderLeftWidth: 4,
      elevation: 2,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      flex: 1,
    },
    title: {
      fontSize: 14,
      color: COLORS.text,
      opacity: 0.8,
      marginBottom: 4,
    },
    value: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 12,
      color: COLORS.text,
      opacity: 0.65,
    },
  });
