import React from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export default function SearchBar({ 
  placeholder = "Buscar...", 
  onFilterPress, 
  showFilter = true,
  value,
  onChangeText,
  style 
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={[styles.searchWrap, style]}>
      <Ionicons name="search-outline" size={18} color={colors.secondary} style={styles.searchIcon} />
      <TextInput 
        style={styles.searchInput} 
        placeholder={placeholder} 
        placeholderTextColor={colors.secondary}
        value={value}
        onChangeText={onChangeText}
      />
      {showFilter && (
        <Pressable style={styles.filterChip} onPress={onFilterPress}>
          <MaterialCommunityIcons name="filter-outline" size={16} color={colors.primary} />
          <Text style={styles.filterText}>Filtros</Text>
        </Pressable>
      )}
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 12,
  },
  filterText: {
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
});
