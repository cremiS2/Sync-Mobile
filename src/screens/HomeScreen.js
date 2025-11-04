import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao App!</Text>
      <CustomButton 
        title="Sistema de Gestão" 
        onPress={() => navigation.navigate('MainTabs')} 
        style={styles.button}
      />
    </View>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.background,
      padding: 24,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
      color: COLORS.text,
    },
    button: {
      marginBottom: 16,
      width: '80%',
    },
  });
