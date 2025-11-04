import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, TextInput } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ProfileEditScreen() {
  const { colors } = useTheme();
  const { user, updateUser } = useAuth();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = async () => {
    try {
      // Here you would typically call an API to update the user profile
      // For now, we'll just update the local state
      await updateUser(formData);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Erro', 'Erro ao atualizar perfil. Tente novamente.');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </Pressable>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nome</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Digite seu nome"
            placeholderTextColor={colors.secondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Digite seu email"
            placeholderTextColor={colors.secondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      paddingTop: 50,
      backgroundColor: COLORS.cardBg,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: COLORS.text,
    },
    saveButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: COLORS.primary,
      borderRadius: 8,
    },
    saveButtonText: {
      color: COLORS.background,
      fontSize: 16,
      fontWeight: '600',
    },
    form: {
      padding: 16,
    },
    inputGroup: {
      marginBottom: 24,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: COLORS.cardBg,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: COLORS.text,
    },
  });