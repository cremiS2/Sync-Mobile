import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export default function ListItem({ 
  item, 
  onPress, 
  badgeIcon, 
  badgeColor, 
  title, 
  subtitle,
  style 
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors, badgeColor);

  return (
    <Pressable onPress={() => onPress(item)} style={[styles.itemContainer, style]}>
      <View style={styles.rowBetween}>
        <View style={styles.badge}>
          <MaterialCommunityIcons name={badgeIcon} size={18} color={styles.badgeIcon.color} />
        </View>
        <View style={styles.content}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.subtitleText}>{subtitle}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.secondary} />
      </View>
    </Pressable>
  );
}

const createStyles = (colors, badgeColor) => StyleSheet.create({
  itemContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: (badgeColor || colors.primary) + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: badgeColor || colors.primary,
  },
  badgeIcon: {
    color: badgeColor || colors.primary,
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '500',
  },
});
