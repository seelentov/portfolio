import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

import { computeProgress, weekData, formatNumber } from './utils';

const { width } = Dimensions.get('window');
const CARD_W = Math.min(width, 440) - 40;

const COLORS = {
  bg: '#0A0E1A',
  card: '#141828',
  card2: '#1B2030',
  fg: '#fff',
  muted: '#7E8597',
  accent: '#A8FF3E',
  accent2: '#5EEAD4',
  pink: '#F472B6',
  orange: '#FB923C',
  line: 'rgba(255,255,255,0.08)',
};

type Tab = 'home' | 'workout' | 'stats' | 'profile';

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const ringAnim = useRef(new Animated.Value(0)).current;
  const stepsAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(ringAnim, { toValue: 1, duration: 1400, useNativeDriver: false, easing: Easing.out(Easing.cubic) }).start();
    Animated.timing(stepsAnim, { toValue: 8420, duration: 1600, useNativeDriver: false, easing: Easing.out(Easing.cubic) }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const stepsDisplay = stepsAnim.interpolate({ inputRange: [0, 8420], outputRange: [0, 8420] });

  return (
    <View style={styles.app}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#1a1f3a', COLORS.bg, '#0a0a0a']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.bgGlow1} />
      <View style={styles.bgGlow2} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Header pulseAnim={pulseAnim} />

        {tab === 'home' && (
          <>
            <HeroRing ringAnim={ringAnim} stepsDisplay={stepsDisplay} />
            <QuickStats />
            <TodayWorkout />
            <WeekChart />
            <ActivityFeed />
          </>
        )}
        {tab === 'workout' && <WorkoutScreen />}
        {tab === 'stats' && <StatsScreen />}
        {tab === 'profile' && <ProfileScreen />}

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav tab={tab} setTab={setTab} />
    </View>
  );
}

function Header({ pulseAnim }: { pulseAnim: Animated.Value }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.helloSmall}>Понедельник, 8 июня</Text>
        <Text style={styles.helloBig}>Доброе утро, <Text style={{ color: COLORS.accent }}>Алекс</Text></Text>
      </View>
      <View style={styles.avatarWrap}>
        <Animated.View style={[styles.avatarPing, { opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }), transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.8] }) }] }]} />
        <View style={styles.avatar}><Text style={styles.avatarTxt}>AK</Text></View>
      </View>
    </View>
  );
}

function HeroRing({ ringAnim, stepsDisplay }: any) {
  const RING_SIZE = 240;
  const STROKE = 16;
  const radius = RING_SIZE / 2 - STROKE;
  const circumference = 2 * Math.PI * radius;
  const progress = ringAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.84] });
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    const id = stepsDisplay.addListener(({ value }: any) => setSteps(Math.floor(value)));
    return () => stepsDisplay.removeListener(id);
  }, []);

  return (
    <View style={styles.heroRing}>
      <View style={{ width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' }}>
        <View style={styles.ringBgCircle} />
        <Animated.View style={[
          styles.ringFgCircle,
          {
            transform: [{ rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
          },
        ]} />
        <View style={styles.ringInner}>
          <Text style={styles.ringLabel}>ШАГИ</Text>
          <Text style={styles.ringValue}>{formatNumber(steps)}</Text>
          <Text style={styles.ringSub}>из 10 000 цели</Text>
        </View>
      </View>
      <View style={styles.ringChips}>
        <View style={styles.chip}><Text style={[styles.chipDot, { backgroundColor: COLORS.accent }]}>●</Text><Text style={styles.chipTxt}>84% выполнено</Text></View>
        <View style={styles.chip}><Text style={[styles.chipDot, { backgroundColor: COLORS.pink }]}>●</Text><Text style={styles.chipTxt}>+12% к вчера</Text></View>
      </View>
    </View>
  );
}

function QuickStats() {
  const items = [
    { label: 'Калории', value: '628', unit: 'ккал', color: COLORS.orange, icon: '🔥' },
    { label: 'Дистанция', value: '6.4', unit: 'км', color: COLORS.accent2, icon: '🏃' },
    { label: 'Пульс', value: '72', unit: 'уд/мин', color: COLORS.pink, icon: '❤' },
  ];
  return (
    <View style={styles.statsRow}>
      {items.map((it, i) => (
        <View key={i} style={styles.statCard}>
          <Text style={styles.statIcon}>{it.icon}</Text>
          <Text style={styles.statValue}>{it.value}<Text style={styles.statUnit}> {it.unit}</Text></Text>
          <Text style={styles.statLabel}>{it.label}</Text>
          <View style={[styles.statBar, { backgroundColor: it.color, width: `${[80, 64, 50][i]}%` }]} />
        </View>
      ))}
    </View>
  );
}

function TodayWorkout() {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&auto=format&fit=crop' }}
      style={styles.workoutCard}
      imageStyle={{ borderRadius: 24, opacity: 0.25 }}
    >
      <LinearGradient colors={['#A8FF3E', '#5EEAD4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: 24, opacity: 0.92 }]} />
      <View style={{ flex: 1, zIndex: 1 }}>
        <Text style={styles.wkLabel}>ТРЕНИРОВКА ДНЯ</Text>
        <Text style={styles.wkTitle}>HIIT × Кардио</Text>
        <Text style={styles.wkMeta}>45 мин · 12 упражнений · 520 ккал</Text>
        <TouchableOpacity style={styles.wkBtn}>
          <Text style={styles.wkBtnTxt}>Начать ▶</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.wkVisual, { zIndex: 1 }]}>
        <View style={styles.wkRing1} />
        <View style={styles.wkRing2} />
        <Text style={styles.wkBig}>45'</Text>
      </View>
    </ImageBackground>
  );
}

function WeekChart() {
  const max = Math.max(...weekData.map((d) => d.steps));
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <View>
          <Text style={styles.sectionLabel}>На этой неделе</Text>
          <Text style={styles.sectionTitle}>Активность по шагам</Text>
        </View>
        <Text style={styles.sectionLink}>Все →</Text>
      </View>
      <View style={styles.chartCard}>
        <View style={styles.chartRow}>
          {weekData.map((d, i) => {
            const h = (d.steps / max) * 120;
            const isToday = i === 1;
            return (
              <View key={i} style={styles.chartCol}>
                <View style={[styles.bar, { height: h, backgroundColor: isToday ? COLORS.accent : 'rgba(255,255,255,0.15)' }]} />
                <Text style={[styles.chartLabel, isToday && { color: COLORS.accent, fontWeight: '700' }]}>{d.day}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.chartFoot}>
          <Text style={styles.chartFootTxt}>В среднем <Text style={{ color: COLORS.fg, fontWeight: '700' }}>7 840</Text> шагов в день</Text>
        </View>
      </View>
    </View>
  );
}

function ActivityFeed() {
  const items = [
    { time: '07:42', title: 'Утренняя пробежка', meta: '5.2 км · 28 мин', icon: '🏃', color: COLORS.accent },
    { time: '12:15', title: 'Обеденная прогулка', meta: '1.8 км · 22 мин', icon: '🚶', color: COLORS.accent2 },
    { time: '18:30', title: 'Силовая тренировка', meta: '45 мин · Верх тела', icon: '🏋', color: COLORS.pink },
  ];
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <View>
          <Text style={styles.sectionLabel}>Недавняя активность</Text>
          <Text style={styles.sectionTitle}>Сессии за день</Text>
        </View>
      </View>
      <View style={{ gap: 12 }}>
        {items.map((it, i) => (
          <View key={i} style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: `${it.color}22`, borderColor: it.color }]}>
              <Text style={{ fontSize: 22 }}>{it.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>{it.title}</Text>
              <Text style={styles.activityMeta}>{it.meta}</Text>
            </View>
            <Text style={styles.activityTime}>{it.time}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function WorkoutScreen() {
  const workouts = [
    { title: 'HIIT Кардио', meta: '20 мин · Новичок', kcal: 280, color: '#A8FF3E' },
    { title: 'Всё тело', meta: '45 мин · Средний', kcal: 520, color: '#5EEAD4' },
    { title: 'Йога-флоу', meta: '30 мин · Все уровни', kcal: 180, color: '#F472B6' },
    { title: 'Пресс на максимум', meta: '15 мин · Продвинутый', kcal: 220, color: '#FB923C' },
  ];
  return (
    <View style={styles.section}>
      <Text style={styles.bigHead}>Тренировки</Text>
      <Text style={styles.bigSub}>Выберите сессию на сегодня</Text>
      <View style={{ gap: 14, marginTop: 30 }}>
        {workouts.map((w, i) => (
          <View key={i} style={styles.workoutItem}>
            <View style={[styles.workoutBadge, { backgroundColor: w.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.workoutTitle}>{w.title}</Text>
              <Text style={styles.workoutMeta}>{w.meta}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.workoutKcal, { color: w.color }]}>{w.kcal}</Text>
              <Text style={styles.workoutKcalLbl}>ккал</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function StatsScreen() {
  return (
    <View style={styles.section}>
      <Text style={styles.bigHead}>Статистика</Text>
      <Text style={styles.bigSub}>Прогресс за период</Text>
      <View style={styles.bigStatGrid}>
        {[
          { label: 'Всего шагов', value: '186 420', delta: '+12%', color: COLORS.accent },
          { label: 'Тренировок', value: '28', delta: '+4', color: COLORS.accent2 },
          { label: 'Активных часов', value: '42.5', delta: '+8%', color: COLORS.pink },
          { label: 'Сожжено ккал', value: '12.8к', delta: '+15%', color: COLORS.orange },
        ].map((s, i) => (
          <View key={i} style={styles.bigStatCard}>
            <Text style={styles.bigStatLabel}>{s.label}</Text>
            <Text style={styles.bigStatValue}>{s.value}</Text>
            <Text style={[styles.bigStatDelta, { color: s.color }]}>↑ {s.delta} за месяц</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.section}>
      <View style={styles.profileHero}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80&auto=format&fit=crop' }}
          style={styles.profileAvatarImg}
        />
        <Text style={styles.profileName}>Алекс Константинов</Text>
        <Text style={styles.profileMeta}>В приложении с марта 2024</Text>
        <View style={styles.profileStats}>
          <View style={styles.profileStatItem}><Text style={styles.profileStatV}>128</Text><Text style={styles.profileStatL}>Сессий</Text></View>
          <View style={styles.profileStatItem}><Text style={styles.profileStatV}>42</Text><Text style={styles.profileStatL}>Достижений</Text></View>
          <View style={styles.profileStatItem}><Text style={styles.profileStatV}>7</Text><Text style={styles.profileStatL}>Дней подряд</Text></View>
        </View>
      </View>
      <View style={{ gap: 10, marginTop: 30 }}>
        {['Личные данные', 'Цели', 'Подключённые устройства', 'Уведомления', 'Помощь и поддержка'].map((m, i) => (
          <View key={i} style={styles.menuRow}>
            <Text style={styles.menuTxt}>{m}</Text>
            <Text style={styles.menuArrow}>→</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: string }[] = [
    { id: 'home', label: 'Главная', icon: '◉' },
    { id: 'workout', label: 'Тренировки', icon: '◈' },
    { id: 'stats', label: 'Статистика', icon: '▣' },
    { id: 'profile', label: 'Профиль', icon: '◐' },
  ];
  return (
    <View style={styles.navBar}>
      {items.map((it) => (
        <TouchableOpacity key={it.id} style={styles.navItem} onPress={() => setTab(it.id)}>
          <Text style={[styles.navIcon, tab === it.id && { color: COLORS.accent }]}>{it.icon}</Text>
          <Text style={[styles.navLabel, tab === it.id && { color: COLORS.accent }]}>{it.label}</Text>
          {tab === it.id && <View style={styles.navDot} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: COLORS.bg },
  bgGlow1: { position: 'absolute', top: -80, right: -100, width: 320, height: 320, borderRadius: 200, backgroundColor: COLORS.accent, opacity: 0.08 },
  bgGlow2: { position: 'absolute', top: 220, left: -80, width: 260, height: 260, borderRadius: 200, backgroundColor: COLORS.pink, opacity: 0.06 },
  scroll: { padding: 20, paddingTop: 60, paddingBottom: 40, maxWidth: 440, alignSelf: 'center', width: '100%' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  helloSmall: { color: COLORS.muted, fontSize: 12, letterSpacing: 1, marginBottom: 4 },
  helloBig: { color: COLORS.fg, fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  avatarWrap: { position: 'relative' },
  avatarPing: { position: 'absolute', width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.accent },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: COLORS.bg, fontWeight: '800', fontSize: 14 },

  heroRing: { alignItems: 'center', marginBottom: 28 },
  ringBgCircle: { position: 'absolute', width: 240, height: 240, borderRadius: 120, borderWidth: 16, borderColor: 'rgba(255,255,255,0.05)' },
  ringFgCircle: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
    borderWidth: 16, borderColor: 'transparent',
    borderTopColor: COLORS.accent, borderRightColor: COLORS.accent2,
  },
  ringInner: { alignItems: 'center' },
  ringLabel: { color: COLORS.muted, fontSize: 11, letterSpacing: 3, marginBottom: 6 },
  ringValue: { color: COLORS.fg, fontSize: 54, fontWeight: '800', letterSpacing: -2 },
  ringSub: { color: COLORS.muted, fontSize: 13, marginTop: 4 },
  ringChips: { flexDirection: 'row', gap: 10, marginTop: 22, flexWrap: 'wrap', justifyContent: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 100, gap: 6, borderWidth: 1, borderColor: COLORS.line },
  chipDot: { fontSize: 8 },
  chipTxt: { color: COLORS.fg, fontSize: 12, fontWeight: '500' },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: COLORS.card, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, overflow: 'hidden' },
  statIcon: { fontSize: 18, marginBottom: 8 },
  statValue: { color: COLORS.fg, fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  statUnit: { fontSize: 11, color: COLORS.muted, fontWeight: '500' },
  statLabel: { color: COLORS.muted, fontSize: 11, marginTop: 2, letterSpacing: 0.5 },
  statBar: { height: 3, borderRadius: 2, marginTop: 14 },

  workoutCard: { borderRadius: 24, padding: 26, flexDirection: 'row', alignItems: 'center', marginBottom: 28, overflow: 'hidden' },
  wkLabel: { color: 'rgba(10,14,26,0.6)', fontSize: 10, letterSpacing: 2, fontWeight: '700', marginBottom: 8 },
  wkTitle: { color: COLORS.bg, fontSize: 26, fontWeight: '800', letterSpacing: -1, marginBottom: 6 },
  wkMeta: { color: 'rgba(10,14,26,0.7)', fontSize: 13, marginBottom: 18, fontWeight: '500' },
  wkBtn: { backgroundColor: COLORS.bg, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 100, alignSelf: 'flex-start' },
  wkBtnTxt: { color: COLORS.accent, fontWeight: '700', fontSize: 13, letterSpacing: 0.5 },
  wkVisual: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  wkRing1: { position: 'absolute', width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: 'rgba(10,14,26,0.2)' },
  wkRing2: { position: 'absolute', width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: 'rgba(10,14,26,0.3)' },
  wkBig: { color: COLORS.bg, fontSize: 30, fontWeight: '800' },

  section: { marginBottom: 28 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18 },
  sectionLabel: { color: COLORS.muted, fontSize: 11, letterSpacing: 2, marginBottom: 4 },
  sectionTitle: { color: COLORS.fg, fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  sectionLink: { color: COLORS.accent, fontSize: 13, fontWeight: '600' },

  chartCard: { backgroundColor: COLORS.card, borderRadius: 20, padding: 22, borderWidth: 1, borderColor: COLORS.line },
  chartRow: { flexDirection: 'row', height: 140, alignItems: 'flex-end', gap: 10 },
  chartCol: { flex: 1, alignItems: 'center' },
  bar: { width: '100%', borderRadius: 6 },
  chartLabel: { color: COLORS.muted, fontSize: 11, marginTop: 8 },
  chartFoot: { marginTop: 18, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.line },
  chartFootTxt: { color: COLORS.muted, fontSize: 13 },

  activityCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORS.card, padding: 16, borderRadius: 18, borderWidth: 1, borderColor: COLORS.line },
  activityIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  activityTitle: { color: COLORS.fg, fontSize: 15, fontWeight: '600' },
  activityMeta: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
  activityTime: { color: COLORS.muted, fontSize: 12, fontWeight: '500' },

  bigHead: { color: COLORS.fg, fontSize: 38, fontWeight: '800', letterSpacing: -1.5, marginTop: 10 },
  bigSub: { color: COLORS.muted, fontSize: 15, marginTop: 4 },

  workoutItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, padding: 18, borderRadius: 18, gap: 14, borderWidth: 1, borderColor: COLORS.line },
  workoutBadge: { width: 4, height: 48, borderRadius: 2 },
  workoutTitle: { color: COLORS.fg, fontSize: 16, fontWeight: '600' },
  workoutMeta: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
  workoutKcal: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  workoutKcalLbl: { color: COLORS.muted, fontSize: 10, letterSpacing: 1 },

  bigStatGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 30 },
  bigStatCard: { width: (CARD_W - 12) / 2, backgroundColor: COLORS.card, padding: 22, borderRadius: 20, borderWidth: 1, borderColor: COLORS.line },
  bigStatLabel: { color: COLORS.muted, fontSize: 12, letterSpacing: 1 },
  bigStatValue: { color: COLORS.fg, fontSize: 30, fontWeight: '800', letterSpacing: -1, marginVertical: 8 },
  bigStatDelta: { fontSize: 12, fontWeight: '600' },

  profileHero: { alignItems: 'center', paddingVertical: 30, backgroundColor: COLORS.card, borderRadius: 24, borderWidth: 1, borderColor: COLORS.line },
  profileAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  profileAvatarImg: { width: 80, height: 80, borderRadius: 40, marginBottom: 18 },
  profileName: { color: COLORS.fg, fontSize: 22, fontWeight: '700' },
  profileMeta: { color: COLORS.muted, fontSize: 13, marginTop: 4 },
  profileStats: { flexDirection: 'row', gap: 40, marginTop: 24, paddingTop: 24, borderTopWidth: 1, borderTopColor: COLORS.line, width: '100%', justifyContent: 'center' },
  profileStatItem: { alignItems: 'center' },
  profileStatV: { color: COLORS.fg, fontSize: 24, fontWeight: '800' },
  profileStatL: { color: COLORS.muted, fontSize: 11, marginTop: 4 },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.card, padding: 18, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line },
  menuTxt: { color: COLORS.fg, fontSize: 15, fontWeight: '500' },
  menuArrow: { color: COLORS.muted, fontSize: 16 },

  navBar: { position: 'absolute', bottom: 20, left: 20, right: 20, maxWidth: 420, alignSelf: 'center', flexDirection: 'row', backgroundColor: 'rgba(20,24,40,0.85)', borderRadius: 100, padding: 8, borderWidth: 1, borderColor: COLORS.line, justifyContent: 'space-around' },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 10, position: 'relative' },
  navIcon: { color: COLORS.muted, fontSize: 18 },
  navLabel: { color: COLORS.muted, fontSize: 10, marginTop: 4, letterSpacing: 0.5 },
  navDot: { position: 'absolute', bottom: 2, width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.accent },
});
