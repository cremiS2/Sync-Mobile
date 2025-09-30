import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// Importando as telas
import FuncionariosScreen from '../screens/FuncionariosScreen';
import MaquinasScreen from '../screens/MaquinasScreen';
import SetoresScreen from '../screens/SetoresScreen';
import DepartamentosScreen from '../screens/DepartamentosScreen';
import DashboardScreen from '../screens/DashboardPage';
import EstoqueScreen from '../screens/EstoqueScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName = 'circle-outline';
          if (route.name === 'Funcionarios') {
            iconName = focused ? 'account-group' : 'account-group-outline';
          } else if (route.name === 'Maquinas') {
            iconName = focused ? 'cog' : 'cog-outline';
          } else if (route.name === 'Setores') {
            iconName = focused ? 'office-building' : 'office-building-outline';
          } else if (route.name === 'Departamentos') {
            iconName = focused ? 'domain' : 'domain';
          } else if (route.name === 'Dashboard') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'Estoque') {
            iconName = focused ? 'package-variant' : 'package-variant-closed';
          }
          return (
            <MaterialCommunityIcons
              name={iconName}
              size={26}
              color={focused ? colors.primary : color}
            />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: styles.tabBar,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        headerRight: () => (
          <Ionicons
            name={isDark ? 'sunny' : 'moon'}
            size={20}
            color={colors.background}
            style={{ marginRight: 12, opacity: 0.9 }}
            onPress={toggleTheme}
          />
        ),
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Funcionarios" 
        component={FuncionariosScreen} 
        options={{ title: 'Funcionários' }}
      />
      <Tab.Screen 
        name="Maquinas" 
        component={MaquinasScreen} 
        options={{ title: 'Máquinas' }}
      />
      <Tab.Screen 
        name="Setores" 
        component={SetoresScreen} 
        options={{ title: 'Setores' }}
      />
      <Tab.Screen 
        name="Departamentos" 
        component={DepartamentosScreen} 
        options={{ title: 'Departamentos' }}
      />
      <Tab.Screen 
        name="Estoque" 
        component={EstoqueScreen} 
        options={{ title: 'Estoque' }}
      />
    </Tab.Navigator>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: COLORS.cardBg,
      borderTopWidth: 0,
      height: 80,
      paddingBottom: 20,
      paddingTop: 8,
      paddingHorizontal: 8,
      elevation: 15,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    header: {
      backgroundColor: COLORS.primary,
      elevation: 4,
      shadowColor: COLORS.shadow,
    },
    headerTitle: {
      color: COLORS.background,
      fontWeight: 'bold',
    },
    tabBarLabel: {
      fontSize: 11,
      fontWeight: '600',
      marginBottom: 2,
      marginTop: 4,
    },
    tabBarItem: {
      paddingVertical: 6,
      paddingHorizontal: 4,
      borderRadius: 12,
      marginHorizontal: 2,
    },
  });