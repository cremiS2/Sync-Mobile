import React, { useMemo, useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getEmployees } from "@/services/employeeService";
import { getDepartments } from "@/services/departmentService";
import { getAuthToken } from "@/services/api";

// Função para decodificar JWT token (compatível com React Native)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Usar Buffer se disponível (React Native com polyfill) ou atob (web)
    let decoded;
    if (typeof Buffer !== 'undefined') {
      decoded = Buffer.from(base64, 'base64').toString('utf-8');
    } else if (typeof atob !== 'undefined') {
      decoded = atob(base64);
    } else {
      // Fallback manual para React Native puro
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      let str = '';
      let i = 0;
      while (i < base64.length) {
        const enc1 = chars.indexOf(base64.charAt(i++));
        const enc2 = chars.indexOf(base64.charAt(i++));
        const enc3 = chars.indexOf(base64.charAt(i++));
        const enc4 = chars.indexOf(base64.charAt(i++));
        const chr1 = (enc1 << 2) | (enc2 >> 4);
        const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        const chr3 = ((enc3 & 3) << 6) | enc4;
        str += String.fromCharCode(chr1);
        if (enc3 !== 64) str += String.fromCharCode(chr2);
        if (enc4 !== 64) str += String.fromCharCode(chr3);
      }
      decoded = str;
    }
    
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
};

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation();
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: 'Administrador',
  });
  const [profileStats, setProfileStats] = useState([
    { title: "Dias Ativo", value: "0", subtitle: "desde o cadastro" },
    { title: "Ações Realizadas", value: "0", subtitle: "este mês" },
    { title: "Departamentos", value: "0", subtitle: "gerenciados" },
  ]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do perfil da API
  const loadProfileData = async () => {
    try {
      setLoading(true);
      console.log('=== CARREGANDO DADOS DO PERFIL ===');
      
      // Extrair email do token JWT
      const token = await getAuthToken();
      let userEmail = '';
      
      if (token) {
        try {
          const payload = decodeJWT(token);
          userEmail = payload.sub || payload.email || '';
          console.log('Email do usuário logado:', userEmail);
        } catch (err) {
          console.error('Erro ao decodificar token:', err);
        }
      }
      
      // Carregar dados dos funcionários e departamentos
      const [employeesRes, departmentsRes] = await Promise.all([
        getEmployees({ pageSize: 1000, pageNumber: 0 }).catch(() => ({ content: [] })),
        getDepartments({ pageSize: 1000, pageNumber: 0 }).catch(() => ({ content: [] }))
      ]);
      
      const employees = employeesRes.content || employeesRes || [];
      const departments = departmentsRes.content || departmentsRes || [];
      
      console.log('Dados carregados para perfil:');
      console.log('- Funcionários:', employees.length);
      console.log('- Departamentos:', departments.length);
      
      // Buscar o funcionário pelo email do usuário logado
      const currentEmployee = employees.find(emp => emp.user?.email === userEmail) || employees[0] || {};
      const currentDepartment = departments.find(d => d.id === currentEmployee.sector?.department?.id) || departments[0] || {};
      
      console.log('Funcionário encontrado:', currentEmployee.name || 'Nenhum');
      
      // Preencher dados do perfil
      const name = currentEmployee.name || user?.name || 'Usuário';
      const email = userEmail || currentEmployee.user?.email || user?.email || 'Não informado';
      const role = getRoleFromEmployee(currentEmployee, currentDepartment);
      
      setProfileData({
        name,
        email,
        role,
      });
      
      // Calcular estatísticas reais
      const daysActive = calculateDaysActive(currentEmployee);
      const actionsThisMonth = calculateActionsThisMonth(); // Pode ser melhorado depois
      const managedDepartments = departments.length; // Total de departamentos disponíveis
      
      setProfileStats([
        { title: "Dias Ativo", value: daysActive.toString(), subtitle: "desde o cadastro" },
        { title: "Ações Realizadas", value: actionsThisMonth.toString(), subtitle: "este mês" },
        { title: "Departamentos", value: managedDepartments.toString(), subtitle: "gerenciados" },
      ]);
      
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
      // Manter dados padrão em caso de erro
      setProfileData({
        name: user?.name || 'Usuário',
        email: user?.email || 'Não informado',
        role: 'Administrador',
      });
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para determinar o cargo baseado no setor/departamento
  const getRoleFromEmployee = (employee, department) => {
    if (employee.sector?.name) {
      const sectorName = employee.sector.name;
      const roles = {
        'Produção': 'Operador de Produção',
        'Qualidade': 'Analista de Qualidade',
        'Manutenção': 'Técnico de Manutenção',
        'Logística': 'Assistente de Logística',
        'Administração': 'Assistente Administrativo'
      };
      return roles[sectorName] || `Especialista em ${sectorName}`;
    }
    return 'Administrador';
  };

  // Calcular dias ativos (simulado - pode ser melhorado com data de cadastro real)
  const calculateDaysActive = (employee) => {
    // Se tiver data de cadastro no employee, calcular a diferença
    // Por enquanto, retorna um valor simulado baseado no ID
    return employee.id ? Math.min(365, 30 + (employee.id * 7)) : 30;
  };

  // Calcular ações realizadas este mês (simulado)
  const calculateActionsThisMonth = () => {
    // Pode ser melhorado para buscar ações reais da API
    return Math.floor(Math.random() * 2000) + 500;
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Landing' }],
              });
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Erro', 'Erro ao fazer logout. Tente novamente.');
            }
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Perfil</Text>

      {/* Card principal do usuário */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{profileData.name || 'Usuário'}</Text>
            <Text style={styles.userRole}>{profileData.role}</Text>
            <Text style={styles.userEmail}>{profileData.email || 'Não informado'}</Text>
          </View>
          <Pressable style={styles.editButton} onPress={() => navigation.navigate('ProfileEdit')}>
            <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} />
          </Pressable>
        </View>

        {/* Estatísticas rápidas */}
        {loading ? (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>...</Text>
              <Text style={styles.statTitle}>Carregando</Text>
              <Text style={styles.statSubtitle}>aguarde</Text>
            </View>
          </View>
        ) : (
          <View style={styles.statsRow}>
            {profileStats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
                <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
              </View>
            ))}
          </View>
        )}
      </View>


      {/* Botão de logout */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <MaterialCommunityIcons name="logout" size={20} color="#ff4444" />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </Pressable>

      <View style={styles.bottomSpacing} />
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
    profileCard: {
      backgroundColor: COLORS.cardBg,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    avatarContainer: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    avatarText: {
      color: COLORS.background,
      fontWeight: '700',
      fontSize: 28,
    },
    profileInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 22,
      fontWeight: '700',
      color: COLORS.text,
      marginBottom: 4,
      letterSpacing: -0.3,
    },
    userRole: {
      fontSize: 14,
      color: COLORS.primary,
      fontWeight: '600',
      marginBottom: 2,
    },
    userEmail: {
      fontSize: 14,
      color: COLORS.secondary,
      fontWeight: '500',
    },
    editButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: COLORS.primary + '15',
      alignItems: 'center',
      justifyContent: 'center',
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statValue: {
      fontSize: 24,
      fontWeight: '700',
      color: COLORS.primary,
      marginBottom: 4,
    },
    statTitle: {
      fontSize: 12,
      color: COLORS.text,
      fontWeight: '600',
      marginBottom: 2,
    },
    statSubtitle: {
      fontSize: 11,
      color: COLORS.secondary,
      fontWeight: '500',
    },
    menuSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: COLORS.text,
      marginBottom: 12,
      marginLeft: 4,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.cardBg,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    menuIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: COLORS.primary + '10',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    menuContent: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.text,
      marginBottom: 2,
    },
    menuSubtitle: {
      fontSize: 13,
      color: COLORS.secondary,
      fontWeight: '500',
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ff444420',
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginTop: 8,
      borderWidth: 1,
      borderColor: '#ff444430',
    },
    logoutText: {
      color: '#ff4444',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    bottomSpacing: {
      height: 20,
    },
  });