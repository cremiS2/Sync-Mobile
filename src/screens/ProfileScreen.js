import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation();

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

  const profileStats = [
    { title: "Dias Ativo", value: "127", subtitle: "desde o cadastro" },
    { title: "Ações Realizadas", value: "1.250", subtitle: "este mês" },
    { title: "Departamentos", value: "5", subtitle: "gerenciados" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Perfil</Text>

      {/* Card principal do usuário */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
            <Text style={styles.userRole}>Administrador</Text>
            <Text style={styles.userEmail}>{user?.email || 'Não informado'}</Text>
          </View>
          <Pressable style={styles.editButton} onPress={() => navigation.navigate('ProfileEdit')}>
            <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} />
          </Pressable>
        </View>

        {/* Estatísticas rápidas */}
        <View style={styles.statsRow}>
          {profileStats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
              <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
            </View>
          ))}
        </View>
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