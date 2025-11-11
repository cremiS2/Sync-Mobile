import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LandingPage from "@/screens/LandingPage";
import LoginScreen from "@/screens/LoginScreen";
import HomeScreen from "@/screens/HomeScreen";
import DashboardScreen from '@/screens/DashboardPage';
import TabNavigator from './TabNavigator';
import ProtectedRoute from './ProtectedRoute';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import FuncionarioFormScreen from '@/screens/admin/FuncionarioFormScreen';
import MaquinaFormScreen from '@/screens/admin/MaquinaFormScreen';
import SetorFormScreen from '@/screens/admin/SetorFormScreen';
import DepartamentoFormScreen from '@/screens/admin/DepartamentoFormScreen';
import EstoqueFormScreen from '@/screens/admin/EstoqueFormScreen';
import InventoryDetailScreen from '@/screens/InventoryDetailScreen';
import ProfileEditScreen from '@/screens/ProfileEditScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.background,
        headerTitleStyle: { color: colors.background },
        headerRight: () => (
          <Ionicons
            name={isDark ? 'sunny' : 'moon'}
            size={22}
            color={colors.background}
            style={{ marginRight: 12 }}
            onPress={toggleTheme}
          />
        ),
      }}
    >
      <Stack.Screen
        name="Landing"
        component={LandingPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home">
        {(props) => (
          <ProtectedRoute navigation={props.navigation}>
            <HomeScreen {...props} />
          </ProtectedRoute>
        )}
      </Stack.Screen>
      <Stack.Screen 
        name="MainTabs"
        options={{ headerShown: false, title: 'Sistema' }}
      >
        {(props) => (
          <ProtectedRoute navigation={props.navigation}>
            <TabNavigator {...props} />
          </ProtectedRoute>
        )}
      </Stack.Screen>
      <Stack.Screen name="FuncionarioCreate" component={FuncionarioFormScreen} options={{ title: 'Novo Funcionário' }} />
      <Stack.Screen name="FuncionarioEdit" component={FuncionarioFormScreen} options={{ title: 'Editar Funcionário' }} />
      <Stack.Screen name="MaquinaCreate" component={MaquinaFormScreen} options={{ title: 'Nova Máquina' }} />
      <Stack.Screen name="MaquinaEdit" component={MaquinaFormScreen} options={{ title: 'Editar Máquina' }} />
      <Stack.Screen name="SetorCreate" component={SetorFormScreen} options={{ title: 'Novo Setor' }} />
      <Stack.Screen name="SetorEdit" component={SetorFormScreen} options={{ title: 'Editar Setor' }} />
      <Stack.Screen name="DepartamentoCreate" component={DepartamentoFormScreen} options={{ title: 'Novo Departamento' }} />
      <Stack.Screen name="DepartamentoEdit" component={DepartamentoFormScreen} options={{ title: 'Editar Departamento' }} />
      <Stack.Screen name="InventoryCreate" component={EstoqueFormScreen} options={{ title: 'Novo Item de Estoque' }} />
      <Stack.Screen name="InventoryEdit" component={EstoqueFormScreen} options={{ title: 'Editar Item de Estoque' }} />
      <Stack.Screen name="InventoryDetail" component={InventoryDetailScreen} options={{ title: 'Detalhes do Item' }} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} options={{ title: 'Editar Perfil' }} />
    </Stack.Navigator>
  );
}
