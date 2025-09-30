import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Pressable, Modal, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Skeleton from '../components/Skeleton';
import FAB from '../components/FAB';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { listInventory, computeInventoryStats, deleteInventoryItem } from '../data/store';
import SearchBar from '../components/SearchBar';
import StatCard from '../components/StatCard';
import SelectField from '../components/SelectField';
import StatsCarousel from '../components/StatsCarousel';
import FilterModal from '../components/FilterModal';

const InventoryItem = ({ item, styles, onPress, colors, onMenu }) => {
  const status = item.status;
  const { bg, fg } = (() => {
    switch (status) {
      case 'OK':
        return { bg: colors.primary + '15', fg: colors.primary };
      case 'Atenção':
        return { bg: '#ffb30022', fg: '#ffb300' };
      case 'Crítico':
        return { bg: '#d6303122', fg: '#d63031' };
      case 'Sem estoque':
        return { bg: '#6c757d22', fg: '#6c757d' };
      default:
        return { bg: colors.secondary + '22', fg: colors.secondary };
    }
  })();
  const available = Math.max((item.quantity || 0) - (item.reserved || 0), 0);
  const totalValue = (available * (item.unitPrice || 0));
  return (
  <Pressable onPress={() => onPress(item)} style={styles.itemContainer}>
    <View style={styles.rowBetween}>
      <View style={styles.avatar}><Text style={styles.avatarText}>{item.name.charAt(0)}</Text></View>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.nomeText}>{item.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: bg }]}>
            <Text style={[styles.statusBadgeText, { color: fg }]}>{status}</Text>
          </View>
        </View>
        <Text style={styles.infoText}>{item.sku} · qtd: {item.quantity} {item.unit} · disp: {available} · res: {item.reserved || 0} · {item.location}</Text>
        <Text style={styles.valueText}>Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}</Text>
      </View>
      <Pressable onPress={() => onMenu(item)} hitSlop={10}>
        <MaterialCommunityIcons name="dots-vertical" size={22} color={styles.chevronColor.color} />
      </Pressable>
    </View>
  </Pressable>
  );
};

export default function EstoqueScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState(''); // '', 'OK', 'Atenção', 'Crítico', 'Sem estoque'
  const [categoryFilter, setCategoryFilter] = useState('');
  const [menuItem, setMenuItem] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const items = listInventory();
  const stats = computeInventoryStats();
  const categories = Array.from(new Set(items.map(i => i.category).filter(Boolean)));
  const normalized = (s) => (s || '').toString().toLowerCase();
  const fmtInt = (n) => new Intl.NumberFormat('pt-BR').format(Number(n || 0));
  const fmtCurrency = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(n || 0));
  const filteredItems = items.filter(i => {
    const q = normalized(query);
    if (!q) return (
      (!statusFilter || i.status === statusFilter) &&
      (!categoryFilter || i.category === categoryFilter)
    );
    const matchesText = (
      normalized(i.name).includes(q) ||
      normalized(i.sku).includes(q) ||
      normalized(i.location).includes(q) ||
      normalized(i.category).includes(q)
    );
    const matchesFilters = (
      (!statusFilter || i.status === statusFilter) &&
      (!categoryFilter || i.category === categoryFilter)
    );
    return matchesText && matchesFilters;
  });

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
        <Text style={styles.titulo}>Estoque</Text>
        <StatsCarousel
          items={[
            { label: 'Total de Itens', number: fmtInt(items.length) },
            { label: 'Disponíveis', number: fmtInt(stats.totalAvailable) },
            { label: 'Estoque baixo', number: fmtInt(stats.totalLow) },
            { label: 'Esgotados', number: fmtInt(stats.totalOut) },
            { label: 'Reservados', number: fmtInt(stats.totalReserved) },
            { label: 'Valor total', number: fmtCurrency(stats.totalValue) },
          ]}
        />
      </View>
      <SearchBar
        placeholder="Buscar por nome, SKU, localização, categoria"
        value={query}
        onChangeText={setQuery}
        onFilterPress={() => setFilterModalVisible(true)}
        style={{ marginBottom: 12 }}
      />
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        statusValue={statusFilter}
        onStatusChange={setStatusFilter}
        categoryValue={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categoryOptions={categories}
        onApply={() => setFilterModalVisible(false)}
        onClear={() => { setStatusFilter(''); setCategoryFilter(''); setFilterModalVisible(false); }}
      />
      {loading ? (
        <View>
          <Skeleton height={90} style={{ marginBottom: 12 }} />
          <Skeleton height={90} style={{ marginBottom: 12 }} />
          <Skeleton height={90} style={{ marginBottom: 12 }} />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <InventoryItem
              item={item}
              styles={styles}
              colors={colors}
              onPress={(data) => navigation.navigate('InventoryDetail', { data })}
              onMenu={(data) => { setMenuItem(data); setMenuVisible(true); }}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl colors={[colors.primary]} tintColor={colors.primary} refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <View style={styles.menuBackdrop}>
          <View style={styles.menuSheet}>
            <Pressable style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('InventoryDetail', { data: menuItem }); }}>
              <MaterialCommunityIcons name="eye-outline" size={18} color={colors.text} />
              <Text style={styles.menuItemText}>Visualizar</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('InventoryEdit', { data: menuItem }); }}>
              <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.text} />
              <Text style={styles.menuItemText}>Editar</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => {
              setMenuVisible(false);
              Alert.alert('Excluir', 'Deseja excluir este item?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', style: 'destructive', onPress: () => { deleteInventoryItem(menuItem.id); onRefresh(); } },
              ]);
            }}>
              <MaterialCommunityIcons name="trash-can-outline" size={18} color="#d63031" />
              <Text style={[styles.menuItemText, { color: '#d63031' }]}>Excluir</Text>
            </Pressable>
            <Pressable onPress={() => setMenuVisible(false)} style={styles.closeBtn}><Text style={styles.closeText}>Fechar</Text></Pressable>
          </View>
        </View>
      </Modal>
      <FAB onPress={() => navigation.navigate('InventoryCreate')} />
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
    statusBadge: {
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    statusBadgeText: {
      fontSize: 11,
      fontWeight: '700',
    },
    header: {
      marginBottom: 16,
      marginTop: 10,
    },
    statsRowSingle: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 12,
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
    filtersPanel: {
      backgroundColor: COLORS.cardBg,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      gap: 8,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
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
    valueText: {
      marginTop: 6,
      fontSize: 14,
      fontWeight: '700',
      color: COLORS.primary,
    },
    chevronColor: {
      color: COLORS.secondary,
    },
    menuBackdrop: {
      flex: 1,
      backgroundColor: '#00000055',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    menuSheet: {
      width: '100%',
      backgroundColor: COLORS.cardBg,
      borderRadius: 12,
      padding: 8,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 10,
      gap: 8,
    },
    menuItemText: {
      color: COLORS.text,
      fontWeight: '600',
    },
  });
