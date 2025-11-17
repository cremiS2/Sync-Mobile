import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Protected Route Component
 * Verifica se o usuário está autenticado antes de renderizar o componente
 */
export default function ProtectedRoute({ children, navigation }) {
  const { isLoggedIn, loading } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    // Se não estiver autenticado e não estiver carregando, redirecionar para login
    if (!loading && !isLoggedIn) {
      console.warn('User not authenticated, redirecting to Login...');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [isLoggedIn, loading, navigation]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.text, { color: colors.text }]}>Verificando autenticação...</Text>
      </View>
    );
  }

  // Se não estiver autenticado, mostra uma tela vazia (será redirecionado)
  if (!isLoggedIn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.text, { color: colors.text }]}>Redirecionando para login...</Text>
      </View>
    );
  }

  // Se autenticado, renderiza os filhos
  return children;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    opacity: 0.7,
  },
});
