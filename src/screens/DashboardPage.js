import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import InfoCard from "../components/InfoCard.js";
import { useTheme } from "../contexts/ThemeContext";
import { formatCurrency } from "../utils/helpers";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function DashboardPage() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      <View style={styles.row}>
        <InfoCard title="Usuários" value="1.250" subtitle="Ativos este mês" color="#ff8400" />
        <InfoCard title="Vendas" value="320" subtitle="Últimos 7 dias" color="#00b894" />
      </View>

      <View style={styles.row}>
        <InfoCard title="Lucro" value={formatCurrency(12500)} subtitle="Este mês" color="#0984e3" />
        <InfoCard title="Novos Leads" value="85" subtitle="Últimas 24h" color="#d63031" />
      </View>

      {/* Ações rápidas */}
      <View style={styles.quickRow}>
        <Pressable style={styles.quickAction} onPress={() => navigation.navigate('FuncionarioCreate')}>
          <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.quickText}>Novo Registro</Text>
        </Pressable>
        <Pressable style={styles.quickAction} onPress={() => navigation.navigate('MaquinaCreate')}>
          <Ionicons name="cloud-upload-outline" size={18} color={colors.primary} />
          <Text style={styles.quickText}>Sincronizar</Text>
        </Pressable>
        <Pressable style={styles.quickAction} onPress={() => navigation.navigate('DepartamentoCreate')}>
          <Ionicons name="analytics-outline" size={18} color={colors.primary} />
          <Text style={styles.quickText}>Relatórios</Text>
        </Pressable>
      </View>

      {/* Progresso e resumo */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Meta de Vendas</Text>
          <Text style={styles.summaryValue}>75%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Alvo</Text>
            <Text style={styles.statValue}>{formatCurrency(20000)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Atual</Text>
            <Text style={styles.statValue}>{formatCurrency(15000)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Restante</Text>
            <Text style={styles.statValue}>{formatCurrency(5000)}</Text>
          </View>
        </View>
      </View>

      {/* Atividades recentes */}
      <View style={styles.recentCard}>
        <Text style={styles.recentTitle}>Atividades recentes</Text>
        {[
          { icon: 'account-plus-outline', text: 'Novo funcionário cadastrado', time: 'há 2h' },
          { icon: 'cog-refresh-outline', text: 'Máquina XYZ revisada', time: 'há 5h' },
          { icon: 'domain', text: 'Departamento atualizado', time: 'ontem' },
        ].map((a, i) => (
          <View key={i} style={styles.recentItem}>
            <MaterialCommunityIcons name={a.icon} size={18} color={colors.primary} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.recentText}>{a.text}</Text>
              <Text style={styles.recentTime}>{a.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
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
      fontSize: 28,
      fontWeight: '700',
      color: COLORS.text,
      marginBottom: 20,
      marginTop: 10,
      letterSpacing: -0.5,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    quickRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 12,
    },
    quickAction: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.cardBg,
      borderRadius: 12,
      paddingVertical: 14,
      marginHorizontal: 4,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    quickText: {
      marginLeft: 8,
      fontWeight: '600',
      color: COLORS.text,
      fontSize: 13,
    },
    summaryCard: {
      backgroundColor: COLORS.cardBg,
      borderRadius: 12,
      padding: 14,
      marginBottom: 12,
      elevation: 1,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    summaryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    summaryTitle: {
      color: COLORS.text,
      fontWeight: '700',
    },
    summaryValue: {
      color: COLORS.text,
      fontWeight: '800',
    },
    progressTrack: {
      height: 8,
      backgroundColor: COLORS.border,
      borderRadius: 6,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressFill: {
      width: '75%',
      height: '100%',
      backgroundColor: COLORS.primary,
    },
    summaryStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statItem: {
      alignItems: 'flex-start',
      flex: 1,
    },
    statLabel: {
      color: COLORS.text,
      opacity: 0.7,
      fontSize: 12,
    },
    statValue: {
      color: COLORS.text,
      fontWeight: '700',
    },
    recentCard: {
      backgroundColor: COLORS.cardBg,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: COLORS.border,
      marginBottom: 16,
    },
    recentTitle: {
      color: COLORS.text,
      fontWeight: '700',
      marginBottom: 8,
    },
    recentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    recentText: {
      color: COLORS.text,
      fontWeight: '500',
    },
    recentTime: {
      color: COLORS.text,
      opacity: 0.7,
      fontSize: 12,
    },
  });
