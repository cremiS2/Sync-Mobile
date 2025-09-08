import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TextInput, Pressable } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Skeleton from '../components/Skeleton';
import FAB from '../components/FAB';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { listDepartments } from '../data/store';

const dadosDepartamentos = [
  { id: '1', nome: 'Recursos Humanos', diretor: 'Juliana Martins', orcamento: 'R$ 250.000,00' },
  { id: '2', nome: 'Comercial', diretor: 'Ricardo Gomes', orcamento: 'R$ 350.000,00' },
  { id: '3', nome: 'Operações', diretor: 'Marcelo Costa', orcamento: 'R$ 500.000,00' },
  { id: '4', nome: 'Administrativo', diretor: 'Patrícia Lopes', orcamento: 'R$ 200.000,00' },
];

const DepartamentoItem = ({ item, styles, onPress }) => (
  <Pressable onPress={() => onPress(item)} style={styles.itemContainer}>
    <View style={styles.rowBetween}>
      <View style={styles.deptBadge}>
        <MaterialCommunityIcons name="domain" size={18} color={styles.badgeIcon.color} />
      </View>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.nomeText}>{item.name}</Text>
        <Text style={styles.infoText}>{item.location} · {item.status}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={styles.chevronColor.color} />
    </View>
  </Pressable>
);

export default function DepartamentosScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
    }, 900);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Departamentos</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{listDepartments().length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{listDepartments().filter(d => d.status === 'Ativo').length}</Text>
            <Text style={styles.statLabel}>Ativos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>R$ {(listDepartments().reduce((acc, d) => {
              const budget = d.budget || '0';
              const cleanBudget = typeof budget === 'string' ? budget.replace(/[R$.,\s]/g, '') : '0';
              return acc + parseFloat(cleanBudget || 0);
            }, 0) / 1000).toFixed(0)}K</Text>
            <Text style={styles.statLabel}>Orçamento</Text>
          </View>
        </View>
      </View>
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={colors.secondary} style={{ marginRight: 8 }} />
        <TextInput style={styles.searchInput} placeholder="Buscar por departamento, diretor" placeholderTextColor={colors.secondary} />
        <Pressable style={styles.filterChip}>
          <MaterialCommunityIcons name="filter-outline" size={16} color={colors.primary} />
          <Text style={styles.filterText}>Filtros</Text>
        </Pressable>
      </View>
      {loading ? (
        <View>
          <Skeleton height={90} style={{ marginBottom: 12 }} />
          <Skeleton height={90} style={{ marginBottom: 12 }} />
          <Skeleton height={90} style={{ marginBottom: 12 }} />
        </View>
      ) : (
        <FlatList
          data={listDepartments()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DepartamentoItem
              item={item}
              styles={styles}
              onPress={(data) => navigation.navigate('DepartamentoEdit', { data })}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl colors={[colors.primary]} tintColor={colors.primary} refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
      <FAB onPress={() => navigation.navigate('DepartamentoCreate')} />
    </View>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
      paddingTop: 20,
      paddingHorizontal: 16,
      paddingBottom: 100,
    },
    header: {
      marginBottom: 16,
      marginTop: 10,
    },
    titulo: {
      fontSize: 28,
      fontWeight: '700',
      color: COLORS.text,
      marginBottom: 16,
      letterSpacing: -0.5,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 8,
    },
    statCard: {
      backgroundColor: COLORS.cardBg,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 12,
      alignItems: 'center',
      flex: 1,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statNumber: {
      fontSize: 18,
      fontWeight: '700',
      color: COLORS.primary,
      marginBottom: 2,
    },
    statLabel: {
      fontSize: 11,
      color: COLORS.secondary,
      fontWeight: '500',
      textAlign: 'center',
    },
    searchWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.cardBg,
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 48,
      marginBottom: 20,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    searchInput: {
      flex: 1,
      color: COLORS.text,
      fontSize: 14,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.primary + '10',
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginLeft: 12,
    },
    filterText: {
      color: COLORS.primary,
      marginLeft: 4,
      fontWeight: '600',
    },
    listContent: {
      paddingBottom: 16,
    },
    itemContainer: {
      backgroundColor: COLORS.cardBg,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    deptBadge: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: COLORS.warning + '20',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: COLORS.warning,
    },
    badgeIcon: {
      color: COLORS.warning,
    },
    nomeText: {
      fontSize: 18,
      fontWeight: '600',
      color: COLORS.text,
      marginBottom: 6,
      letterSpacing: -0.3,
    },
    infoText: {
      fontSize: 14,
      color: COLORS.secondary,
      fontWeight: '500',
    },
    chevronColor: {
      color: COLORS.secondary,
    },
  });