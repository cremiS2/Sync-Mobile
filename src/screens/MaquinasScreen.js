import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TextInput, Pressable } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Skeleton from '../components/Skeleton';
import FAB from '../components/FAB';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { listMachines } from '../data/store';

const dadosMaquinas = [
  { id: '1', nome: 'Impressora 3D', modelo: 'XYZ-2000', setor: 'Produção' },
  { id: '2', nome: 'Servidor', modelo: 'Dell R740', setor: 'TI' },
  { id: '3', nome: 'Máquina CNC', modelo: 'CNC-5000', setor: 'Fabricação' },
];

const MaquinaItem = ({ item, styles, onPress }) => (
  <Pressable onPress={() => onPress(item)} style={styles.itemContainer}>
    <View style={styles.rowBetween}>
      <View style={styles.machineBadge}>
        <MaterialCommunityIcons name="cog-outline" size={18} color={styles.badgeIcon.color} />
      </View>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.nomeText}>{item.name}</Text>
        <Text style={styles.infoText}>OEE {item.oee}% · {item.status}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={styles.chevronColor.color} />
    </View>
  </Pressable>
);

export default function MaquinasScreen() {
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
        <Text style={styles.titulo}>Máquinas</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{listMachines().length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{listMachines().filter(m => m.status === 'Operando').length}</Text>
            <Text style={styles.statLabel}>Operando</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{Math.round(listMachines().reduce((acc, m) => acc + m.oee, 0) / listMachines().length)}%</Text>
            <Text style={styles.statLabel}>OEE Médio</Text>
          </View>
        </View>
      </View>
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={colors.secondary} style={{ marginRight: 8 }} />
        <TextInput style={styles.searchInput} placeholder="Buscar por nome, modelo, setor" placeholderTextColor={colors.secondary} />
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
          data={listMachines()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MaquinaItem
              item={item}
              styles={styles}
              onPress={(data) => navigation.navigate('MaquinaEdit', { data })}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl colors={[colors.primary]} tintColor={colors.primary} refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
      <FAB onPress={() => navigation.navigate('MaquinaCreate')} />
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
    machineBadge: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: COLORS.info + '20',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: COLORS.info,
    },
    badgeIcon: {
      color: COLORS.info,
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