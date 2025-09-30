import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import StatCard from './StatCard';

export default function StatsCarousel({ items = [], style }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {items.map((it, idx) => (
          <View key={`${it.label}-${idx}`} style={styles.cardWrap}>
            <StatCard number={it.number} label={it.label} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  content: {
    paddingHorizontal: 4,
  },
  cardWrap: {
    width: 180,
    marginHorizontal: 6,
  },
});
