import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TextInput, Pressable, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Skeleton from '@/components/Skeleton';
import FAB from '@/components/FAB';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getEmployees, deleteEmployee } from '@/services/employeeService';

const dadosFuncionarios = [
  { id: '1', nome: 'João Silva', cargo: 'Desenvolvedor', setor: 'TI' },
  { id: '2', nome: 'Maria Oliveira', cargo: 'Designer', setor: 'Marketing' },
  { id: '3', nome: 'Pedro Santos', cargo: 'Analista', setor: 'Financeiro' },
];

const FuncionarioItem = ({ item, styles, onPress }) => (
  <Pressable onPress={() => onPress(item)} style={styles.itemContainer}>
    <View style={styles.rowBetween}>
      <View style={styles.avatar}><Text style={styles.avatarText}>{item.name.charAt(0)}</Text></View>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.nomeText}>{item.name}</Text>
        <Text style={styles.infoText}>{item.role} · {item.status}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={styles.chevronColor.color} />
    </View>
  </Pressable>
);

export default function FuncionariosScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEmployees();
      setEmployees(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      setError(err.message);
      Alert.alert('Erro', 'Não foi possível carregar os funcionários: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEmployees();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Funcionários</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{employees.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{employees.filter(e => e.status === 'ATIVO' || e.status === 'Active').length}</Text>
            <Text style={styles.statLabel}>Ativos</Text>
          </View>
        </View>
      </View>
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={colors.secondary} style={{ marginRight: 8 }} />
        <TextInput style={styles.searchInput} placeholder="Buscar por nome, cargo, setor" placeholderTextColor={colors.secondary} />
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
          data={employees}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <FuncionarioItem
              item={item}
              styles={styles}
              onPress={(data) => navigation.navigate('FuncionarioEdit', { data })}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl colors={[colors.primary]} tintColor={colors.primary} refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <FAB onPress={() => navigation.navigate('FuncionarioCreate')} />
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
      gap: 12,
      marginBottom: 8,
    },
    statCard: {
      backgroundColor: COLORS.cardBg,
      paddingVertical: 12,
      paddingHorizontal: 16,
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
      fontSize: 20,
      fontWeight: '700',
      color: COLORS.primary,
      marginBottom: 2,
    },
    statLabel: {
      fontSize: 12,
      color: COLORS.secondary,
      fontWeight: '500',
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
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: COLORS.background,
      fontWeight: '700',
      fontSize: 18,
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