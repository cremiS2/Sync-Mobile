import React, { useMemo, useRef } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme as NavigationDarkTheme, CommonActions } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

// Criar referência global de navegação
export const navigationRef = React.createRef();

// Função helper para navegação
export function navigate(name, params) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
}

// Função helper para reset
export function resetNavigation(routes) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: routes,
      })
    );
  }
}

function RootNavigation() {
  const { isDark, colors } = useTheme();
  const baseTheme = isDark ? NavigationDarkTheme : DefaultTheme;
  const navTheme = useMemo(
    () => ({
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.cardBg,
        text: colors.text,
        border: colors.border,
        notification: colors.primary,
      },
      fonts: {
        ...(baseTheme.fonts || {}),
        regular: { fontFamily: 'System', fontWeight: '400' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: '700' },
      },
    }),
    [isDark, colors, baseTheme]
  );

  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function Main() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>
    </ThemeProvider>
  );
}
