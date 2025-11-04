import React, { useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Pressable, useWindowDimensions, Platform } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function LandingPage({ navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { width } = useWindowDimensions();

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(12)).current;
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [kpiUsers, setKpiUsers] = useState(0);
  const [kpiUptime, setKpiUptime] = useState(0);
  const [kpiSyncs, setKpiSyncs] = useState(0);

  useEffect(() => {
    const isWeb = Platform.OS === 'web';
    Animated.parallel([
      Animated.timing(heroOpacity, { toValue: 1, duration: 450, useNativeDriver: !isWeb }),
      Animated.timing(heroTranslate, { toValue: 0, duration: 450, useNativeDriver: !isWeb }),
    ]).start();
  }, [heroOpacity, heroTranslate]);

  useEffect(() => {
    // KPIs contadores simples
    let u = 0, up = 0, s = 0;
    const interval = setInterval(() => {
      u = Math.min(1250, u + 25);
      up = Math.min(100, up + 4);
      s = Math.min(9800, s + 200);
      setKpiUsers(u);
      setKpiUptime(up);
      setKpiSyncs(s);
      if (u === 1250 && up === 100 && s === 9800) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const slides = [
    {
      icon: 'cloud-sync-outline',
      title: 'Sincronização em tempo real',
      text: 'Mantenha tudo alinhado entre times e dispositivos.',
    },
    {
      icon: 'shield-lock-outline',
      title: 'Segurança de ponta a ponta',
      text: 'Criptografia e controles avançados por padrão.',
    },
    {
      icon: 'flash-outline',
      title: 'Desempenho e confiabilidade',
      text: 'Arquitetura otimizada para operações exigentes.',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Background decorativo */}
      <View pointerEvents="none" style={styles.blobA} />
      <View pointerEvents="none" style={styles.blobB} />

      <Animated.View style={[styles.hero, { opacity: heroOpacity, transform: [{ translateY: heroTranslate }] }]}>
        <View style={styles.heroBadge}> 
          <Ionicons name="sync-outline" size={24} color={colors.background} />
        </View>
        <Text style={styles.heroTitle}>SyncMob</Text>
        <Text style={styles.heroSubtitle}>Sincronização moderna para sua operação</Text>
      </Animated.View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Comece agora</Text>
        <CustomButton title="Entrar" onPress={() => navigation.navigate('Login')} />
        <Pressable style={styles.secondaryCta} onPress={() => navigation.navigate('MainTabs')}>
          <Text style={styles.secondaryCtaText}>Explorar o app</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} style={{ marginLeft: 6 }} />
        </Pressable>
        <View style={styles.ctaRow}>
          <Pressable style={styles.ghostBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.ghostBtnText}>Criar conta</Text>
          </Pressable>
        </View>
      </View>

      {/* Carrossel de destaques */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCarouselIndex(idx);
        }}
        scrollEventThrottle={16}
        style={{ marginBottom: 10 }}
      >
        {slides.map((s, i) => (
          <View key={i} style={[styles.slide, { width }]}> 
            <View style={styles.slideIconWrap}>
              <MaterialCommunityIcons name={s.icon} size={22} color={colors.background} />
            </View>
            <Text style={styles.slideTitle}>{s.title}</Text>
            <Text style={styles.slideText}>{s.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === carouselIndex ? styles.dotActive : null]} />
        ))}
      </View>

      {/* KPIs */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{kpiUsers}+ </Text>
          <Text style={styles.kpiLabel}>Usuários</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{kpiUptime}% </Text>
          <Text style={styles.kpiLabel}>Uptime</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{kpiSyncs}+ </Text>
          <Text style={styles.kpiLabel}>Sincronizações</Text>
        </View>
      </View>

      <View style={styles.features}>
        <View style={styles.featureItem}>
          <View style={styles.featureIconWrap}>
            <MaterialCommunityIcons name="cloud-sync-outline" size={18} color={colors.background} />
          </View>
          <Text style={styles.featureTitle}>Sincronização</Text>
          <Text style={styles.featureDesc}>Dados sempre atualizados entre dispositivos</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.featureIconWrap}>
            <MaterialCommunityIcons name="shield-check-outline" size={18} color={colors.background} />
          </View>
          <Text style={styles.featureTitle}>Segurança</Text>
          <Text style={styles.featureDesc}>Criptografia e boas práticas de segurança</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.featureIconWrap}>
            <MaterialCommunityIcons name="speedometer-medium" size={18} color={colors.background} />
          </View>
          <Text style={styles.featureTitle}>Desempenho</Text>
          <Text style={styles.featureDesc}>Rápido, fluido e otimizado</Text>
        </View>
      </View>

      {/* Benefícios (grid) */}
      <View style={styles.benefitsGrid}>
        {[
          { icon: 'account-group-outline', title: 'Colaboração' },
          { icon: 'chart-box-outline', title: 'Insights' },
          { icon: 'bell-outline', title: 'Alertas' },
          { icon: 'database-outline', title: 'Backup' },
          { icon: 'api', title: 'Integrações' },
          { icon: 'headset', title: 'Suporte' },
        ].map((b, i) => (
          <View key={i} style={styles.benefitCard}>
            <MaterialCommunityIcons name={b.icon} size={18} color={colors.primary} />
            <Text style={styles.benefitTitle}>{b.title}</Text>
          </View>
        ))}
      </View>

      {/* Como funciona */}
      <View style={styles.stepsWrap}>
        {[
          { n: 1, t: 'Criar conta' },
          { n: 2, t: 'Conectar equipes' },
          { n: 3, t: 'Sincronizar dados' },
        ].map((s, i) => (
          <View key={i} style={styles.stepItem}>
            <View style={styles.stepBadge}><Text style={styles.stepNum}>{s.n}</Text></View>
            <Text style={styles.stepText}>{s.t}</Text>
          </View>
        ))}
      </View>

      {/* Depoimentos */}
      <View style={styles.testimonials}>
        {[
          { name: 'Ana Souza', role: 'Operações', text: 'O SyncMob agilizou nossa rotina e reduziu erros.' },
          { name: 'Carlos Lima', role: 'TI', text: 'Integração simples e suporte excelente.' },
        ].map((t, i) => (
          <View key={i} style={styles.testimonialCard}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{t.name.charAt(0)}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.testimonialName}>{t.name} · <Text style={styles.testimonialRole}>{t.role}</Text></Text>
              <Text style={styles.testimonialText}>{t.text}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Logos clientes (placeholders com ícones) */}
      <View style={styles.logosRow}>
        {['microsoft-windows', 'github', 'google', 'apple'].map((l, i) => (
          <MaterialCommunityIcons key={i} name={l} size={22} color={colors.secondary} style={{ opacity: 0.7 }} />
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} SyncMob · v1.0</Text>
        <View style={{ flexDirection: 'row' }}>
          <Pressable><Text style={styles.footerLink}>Privacidade</Text></Pressable>
          <Text style={styles.footerSep}> · </Text>
          <Pressable><Text style={styles.footerLink}>Termos</Text></Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: COLORS.background,
      padding: 24,
      paddingTop: 36,
    },
    blobA: {
      position: 'absolute',
      top: -60,
      right: -40,
      width: 180,
      height: 180,
      borderRadius: 100,
      backgroundColor: COLORS.primary,
      opacity: 0.08,
    },
    blobB: {
      position: 'absolute',
      bottom: -50,
      left: -50,
      width: 220,
      height: 220,
      borderRadius: 120,
      backgroundColor: COLORS.primary,
      opacity: 0.06,
    },
    hero: {
      alignItems: 'center',
      marginBottom: 24,
    },
    heroBadge: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    heroTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: COLORS.text,
    },
    heroSubtitle: {
      fontSize: 14,
      color: COLORS.text,
      opacity: 0.7,
      marginTop: 6,
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
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: COLORS.text,
      marginBottom: 12,
    },
    ctaRow: {
      marginTop: 10,
      alignItems: 'center',
    },
    ghostBtn: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: COLORS.border,
      backgroundColor: COLORS.background,
    },
    ghostBtnText: {
      color: COLORS.primary,
      fontWeight: '600',
    },
    secondaryCta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
    },
    secondaryCtaText: {
      color: COLORS.primary,
      fontWeight: '600',
    },
    slide: {
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 18,
    },
    slideIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    slideTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: COLORS.text,
      marginBottom: 6,
      textAlign: 'center',
    },
    slideText: {
      textAlign: 'center',
      color: COLORS.text,
      opacity: 0.75,
      fontSize: 13,
    },
    dotsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 12,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: COLORS.border,
      marginHorizontal: 3,
    },
    dotActive: {
      backgroundColor: COLORS.primary,
    },
    kpiRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    kpiCard: {
      flex: 1,
      backgroundColor: COLORS.cardBg,
      borderRadius: 10,
      paddingVertical: 12,
      marginHorizontal: 4,
      alignItems: 'center',
      elevation: 1,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    kpiValue: {
      fontWeight: '800',
      color: COLORS.text,
      fontSize: 18,
    },
    kpiLabel: {
      color: COLORS.text,
      opacity: 0.7,
      fontSize: 12,
    },
    features: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    featureItem: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 8,
    },
    featureIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    featureTitle: {
      fontWeight: '700',
      color: COLORS.text,
      marginBottom: 2,
    },
    featureDesc: {
      textAlign: 'center',
      color: COLORS.text,
      opacity: 0.7,
      fontSize: 12,
    },
    benefitsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
      marginBottom: 10,
    },
    benefitCard: {
      width: '33%',
      alignItems: 'center',
      paddingVertical: 10,
    },
    benefitTitle: {
      marginTop: 4,
      color: COLORS.text,
      fontSize: 12,
    },
    stepsWrap: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 8,
    },
    stepItem: {
      flex: 1,
      alignItems: 'center',
    },
    stepBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },
    stepNum: {
      color: COLORS.background,
      fontWeight: '700',
    },
    stepText: {
      color: COLORS.text,
      fontSize: 12,
    },
    testimonials: {
      marginTop: 8,
      marginBottom: 10,
    },
    testimonialCard: {
      flexDirection: 'row',
      backgroundColor: COLORS.cardBg,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    avatarText: {
      color: COLORS.background,
      fontWeight: '700',
    },
    testimonialName: {
      color: COLORS.text,
      fontWeight: '700',
      marginBottom: 2,
    },
    testimonialRole: {
      color: COLORS.text,
      opacity: 0.7,
      fontWeight: '400',
    },
    testimonialText: {
      color: COLORS.text,
      opacity: 0.8,
      fontSize: 12,
    },
    logosRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginTop: 6,
      marginBottom: 12,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 6,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
    },
    footerText: {
      color: COLORS.text,
      opacity: 0.6,
      fontSize: 12,
    },
    footerLink: {
      color: COLORS.primary,
      fontSize: 12,
    },
    footerSep: {
      color: COLORS.text,
      opacity: 0.4,
      marginHorizontal: 6,
    },
  });
