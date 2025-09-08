import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Pressable,
  Animated,
} from "react-native";
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../contexts/ThemeContext";
import { isValidEmail } from "../utils/helpers";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(true);
  const [emailErro, setEmailErro] = useState("");
  const [senhaErro, setSenhaErro] = useState("");
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [logoScale, logoOpacity]);

  const handleLogin = () => {
    // Validação avançada
    let ok = true;
    setEmailErro("");
    setSenhaErro("");
    if (!email) {
      setEmailErro("Informe seu email");
      ok = false;
    } else if (!isValidEmail(email)) {
      setEmailErro("Email inválido");
      ok = false;
    }
    if (!senha) {
      setSenhaErro("Informe sua senha");
      ok = false;
    }
    if (!ok) return;

    // Simulação de login bem-sucedido
    navigation.navigate("MainTabs");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Animated.View style={[styles.brandRow, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
            <View style={styles.brandIconWrap}>
              <Ionicons name="sync-outline" size={24} color={colors.background} />
            </View>
            <View>
              <Text style={styles.brandTitle}>SyncMob</Text>
              <Text style={styles.brandSubtitle}>Acesse sua conta para continuar</Text>
            </View>
          </Animated.View>

          <View style={styles.card}>
            <Text style={styles.title}>Login</Text>

            <View style={[styles.inputWrap, emailErro ? { borderColor: colors.danger } : null]}>
              <Ionicons name="mail-outline" size={20} color={colors.secondary} style={styles.leftIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.secondary}
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (emailErro) setEmailErro("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {emailErro ? <Text style={styles.errorText}>{emailErro}</Text> : null}

            <View style={[styles.inputWrap, senhaErro ? { borderColor: colors.danger } : null]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.secondary} style={styles.leftIcon} />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor={colors.secondary}
                value={senha}
                onChangeText={(t) => {
                  setSenha(t);
                  if (senhaErro) setSenhaErro("");
                }}
                secureTextEntry={!mostrarSenha}
              />
              <Pressable onPress={() => setMostrarSenha((v) => !v)} style={styles.rightIcon} hitSlop={8}>
                <Ionicons name={mostrarSenha ? "eye-off-outline" : "eye-outline"} size={20} color={colors.secondary} />
              </Pressable>
            </View>
            {senhaErro ? <Text style={styles.errorText}>{senhaErro}</Text> : null}

            <View style={styles.rowBetween}>
              <View style={styles.switchRow}>
                <Switch value={lembrar} onValueChange={setLembrar} trackColor={{ true: colors.primary }} />
                <Text style={styles.switchLabel}>Lembrar-me</Text>
              </View>
              <Pressable onPress={() => Alert.alert("Recuperar senha", "Funcionalidade em breve")}> 
                <Text style={styles.linkText}>Esqueci a senha</Text>
              </Pressable>
            </View>

            <CustomButton title="Entrar" onPress={handleLogin} style={{ marginTop: 12 }} />

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialRow}>
              <Pressable style={[styles.socialButton, { borderColor: colors.border }]} onPress={() => Alert.alert("Google", "Login social em breve")}> 
                <MaterialCommunityIcons name="google" size={18} color="#DB4437" style={{ marginRight: 8 }} />
                <Text style={styles.socialText}>Google</Text>
              </Pressable>
              <Pressable style={[styles.socialButton, { borderColor: colors.border }]} onPress={() => Alert.alert("Apple", "Login social em breve")}>
                <MaterialCommunityIcons name="apple" size={18} color={colors.text} style={{ marginRight: 8 }} />
                <Text style={styles.socialText}>Apple</Text>
              </Pressable>
            </View>

            <View style={styles.signupRow}>
              <Text style={styles.subtitle}>Ainda não tem conta? </Text>
              <Pressable onPress={() => Alert.alert("Cadastro", "Fluxo de cadastro em breve")}> 
                <Text style={styles.linkAccent}>Criar conta</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      backgroundColor: COLORS.background,
    },
    container: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
    },
    brandRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    brandIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    brandTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: COLORS.text,
    },
    brandSubtitle: {
      fontSize: 13,
      color: COLORS.text,
      opacity: 0.7,
    },
    card: {
      backgroundColor: COLORS.cardBg,
      borderRadius: 12,
      padding: 16,
      elevation: 2,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 16,
      color: COLORS.text,
    },
    inputWrap: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: COLORS.border,
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: COLORS.background,
      paddingHorizontal: 12,
      height: 50,
      marginBottom: 12,
    },
    leftIcon: {
      marginRight: 8,
    },
    rightIcon: {
      marginLeft: 8,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: COLORS.text,
      paddingVertical: 10,
    },
    errorText: {
      marginTop: -6,
      marginBottom: 8,
      color: COLORS.danger,
      fontSize: 12,
    },
    rowBetween: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 6,
      marginBottom: 8,
    },
    switchRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    switchLabel: {
      marginLeft: 8,
      color: COLORS.text,
    },
    linkText: {
      color: COLORS.primary,
      fontWeight: "600",
    },
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 12,
    },
    divider: {
      height: 1,
      flex: 1,
      backgroundColor: COLORS.border,
    },
    dividerText: {
      marginHorizontal: 10,
      color: COLORS.secondary,
    },
    socialRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    socialButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: 10,
      height: 46,
      backgroundColor: COLORS.background,
      marginRight: 8,
    },
    socialText: {
      color: COLORS.text,
      fontWeight: "600",
    },
    signupRow: {
      marginTop: 16,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    subtitle: {
      color: COLORS.text,
      opacity: 0.8,
    },
    linkAccent: {
      color: COLORS.primary,
      fontWeight: "700",
    },
  });
