import React, { useMemo, useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import InfoCard from "@/components/InfoCard.js";
import { useTheme } from "@/contexts/ThemeContext";
import { formatCurrency } from "@/utils/helpers";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getEmployees } from "@/services/employeeService";
import { getMachines } from "@/services/machineService";
import { getDepartments } from "@/services/departmentService";
import { getSectors } from "@/services/sectorService";
import { getStock } from "@/services/stockService";

export default function DashboardPage() {
   const { colors } = useTheme();
   const styles = useMemo(() => createStyles(colors), [colors]);
   const navigation = useNavigation();

   const [dashboardData, setDashboardData] = useState({
      employees: { total: 0, active: 0 },
      machines: { total: 0, operating: 0, maintenance: 0 },
      departments: { total: 0, active: 0 },
      sectors: { total: 0 },
      stock: { total: 0, available: 0 },
      loading: true,
      error: null
   });

   useEffect(() => {
      const fetchDashboardData = async () => {
         try {
            // Carregar dados em paralelo com tratamento de erro individual (como no web)
            const [employeesRes, machinesRes, departmentsRes, sectorsRes, stockRes] = await Promise.all([
               getEmployees({ pageSize: 1000, pageNumber: 0 }).catch(() => ({ content: [] })),
               getMachines({ pageSize: 1000, pageNumber: 0 }).catch(() => ({ content: [] })),
               getDepartments({ pageSize: 1000, pageNumber: 0 }).catch(() => ({ content: [] })),
               getSectors().catch(() => ({ content: [] })), // Sem parâmetros - backend pode não aceitar paginação
               getStock({ pageSize: 1000, pageNumber: 0 }).catch(() => ({ content: [] }))
            ]);

            const employees = employeesRes.content || employeesRes || [];
            const machines = machinesRes.content || machinesRes || [];
            const departments = departmentsRes.content || departmentsRes || [];
            const sectors = sectorsRes.content || sectorsRes || [];
            const stock = stockRes.content || stockRes || [];

            setDashboardData({
               employees: {
                  total: employees.length,
                  active: employees.filter(emp => emp.status === 'ATIVO' || emp.status === 'ACTIVE').length
               },
               machines: {
                  total: machines.length,
                  operating: machines.filter(mach => mach.status === 'OPERANDO' || mach.status === 'OPERATING').length,
                  maintenance: machines.filter(mach => mach.status === 'MANUTENCAO' || mach.status === 'MAINTENANCE').length
               },
               departments: {
                  total: departments.length,
                  active: departments.filter(dept => dept.status === 'ATIVO' || dept.status === 'ACTIVE').length
               },
               sectors: {
                  total: sectors.length
               },
               stock: {
                  total: stock.length,
                  available: stock.filter(item => item.status === 'DISPONIVEL' || item.status === 'IN_STOCK').length
               },
               loading: false,
               error: null
            });
         } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setDashboardData(prev => ({ ...prev, loading: false, error: error.message }));
         }
      };

      fetchDashboardData();
   }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      <View style={styles.row}>
        <InfoCard title="Funcionários" value={dashboardData.employees.total.toString()} subtitle={`${dashboardData.employees.active} ativos`} color="#ff8400" />
        <InfoCard title="Máquinas" value={dashboardData.machines.total.toString()} subtitle={`${dashboardData.machines.operating} operando`} color="#00b894" />
      </View>

      <View style={styles.row}>
        <InfoCard title="Departamentos" value={dashboardData.departments.total.toString()} subtitle={`${dashboardData.departments.active} ativos`} color="#0984e3" />
        <InfoCard title="Estoque" value={dashboardData.stock.total.toString()} subtitle={`${dashboardData.stock.available} disponível`} color="#d63031" />
      </View>

      {/* Ações rápidas */}
      <View style={styles.quickRow}>
        <Pressable style={styles.quickAction} onPress={() => navigation.navigate('FuncionarioCreate')}>
          <Ionicons name="person-add-outline" size={18} color={colors.primary} />
          <Text style={styles.quickText}>Novo Funcionário</Text>
        </Pressable>
        <Pressable style={styles.quickAction} onPress={() => navigation.navigate('MaquinaCreate')}>
          <Ionicons name="cog-outline" size={18} color={colors.primary} />
          <Text style={styles.quickText}>Nova Máquina</Text>
        </Pressable>
        <Pressable style={styles.quickAction} onPress={() => navigation.navigate('EstoqueCreate')}>
          <Ionicons name="cube-outline" size={18} color={colors.primary} />
          <Text style={styles.quickText}>Novo Item</Text>
        </Pressable>
      </View>

      {/* Progresso e resumo */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Eficiência das Máquinas</Text>
          <Text style={styles.summaryValue}>{dashboardData.machines.total > 0 ? Math.round((dashboardData.machines.operating / dashboardData.machines.total) * 100) : 0}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${dashboardData.machines.total > 0 ? (dashboardData.machines.operating / dashboardData.machines.total) * 100 : 0}%` }]} />
        </View>
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Operando</Text>
            <Text style={styles.statValue}>{dashboardData.machines.operating}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Manutenção</Text>
            <Text style={styles.statValue}>{dashboardData.machines.maintenance}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Paradas</Text>
            <Text style={styles.statValue}>{dashboardData.machines.total - dashboardData.machines.operating - dashboardData.machines.maintenance}</Text>
          </View>
        </View>
      </View>

      {/* Atividades recentes */}
      <View style={styles.recentCard}>
        <Text style={styles.recentTitle}>Atividades recentes</Text>
        {[
          { icon: 'account-plus-outline', text: `${dashboardData.employees.total} funcionários registrados`, time: 'hoje' },
          { icon: 'cog-outline', text: `${dashboardData.machines.total} máquinas monitoradas`, time: 'hoje' },
          { icon: 'domain', text: `${dashboardData.departments.total} departamentos ativos`, time: 'hoje' },
          { icon: 'office-building', text: `${dashboardData.sectors.total} setores cadastrados`, time: 'hoje' },
          { icon: 'cube-outline', text: `${dashboardData.stock.available} itens em estoque`, time: 'hoje' },
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
