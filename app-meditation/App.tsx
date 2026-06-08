import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { formatMinutes, sessions, streakDays, totalSessionMinutes } from './utils';

const { width } = Dimensions.get('window');

const C = {
  bg: '#F4EEE0',
  bg2: '#EEE4D0',
  ink: '#2A1F1A',
  muted: '#7C6E63',
  rose: '#E89F8A',
  rose2: '#D67D63',
  sage: '#A4B59A',
  cream: '#F8F1E1',
  card: '#FFFFFF',
};

type Tab = 'home' | 'sessions' | 'breathe' | 'progress';

export default function App() {
  const [tab, setTab] = useState<Tab>('home');

  return (
    <View style={styles.app}>
      <StatusBar style="dark" />
      <View style={styles.bgWrap}>
        <View style={styles.blob1} />
        <View style={styles.blob2} />
        <View style={styles.blob3} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {tab === 'home' && <HomeScreen />}
        {tab === 'sessions' && <SessionsScreen />}
        {tab === 'breathe' && <BreatheScreen />}
        {tab === 'progress' && <ProgressScreen />}
        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav tab={tab} setTab={setTab} />
    </View>
  );
}

function HomeScreen() {
  return (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Добрый вечер,</Text>
          <Text style={styles.greetingName}>София</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakNum}>7</Text>
          <Text style={styles.streakLbl}>дней подряд</Text>
        </View>
      </View>

      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=900&q=80&auto=format&fit=crop' }}
        style={styles.featuredCard}
        imageStyle={{ borderRadius: 28, opacity: 0.35 }}
      >
        <LinearGradient
          colors={['rgba(232,159,138,0.88)', 'rgba(214,125,99,0.82)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 28 }]}
        />
        <View style={{ flex: 1, zIndex: 1 }}>
          <Text style={styles.featuredKicker}>СЕГОДНЯ</Text>
          <Text style={styles.featuredTitle}>Обрети центр</Text>
          <Text style={styles.featuredMeta}>15 мин · Гид-медитация</Text>
          <TouchableOpacity style={styles.playBtn}>
            <Text style={styles.playBtnTxt}>▶ Начать</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.featuredVisual, { zIndex: 1 }]}>
          <View style={styles.fLayer1} />
          <View style={styles.fLayer2} />
          <View style={styles.fLayer3} />
        </View>
      </ImageBackground>

      <View style={styles.section}>
        <Text style={styles.sectionHead}>Быстрый старт</Text>
        <View style={styles.quickGrid}>
          {[
            { t: 'Спокойствие', m: '5 мин', c1: '#A4B59A', c2: '#6F8A7E', icon: '◯' },
            { t: 'Фокус', m: '10 мин', c1: '#E8B07A', c2: '#C58D55', icon: '◐' },
            { t: 'Сон', m: '20 мин', c1: '#7E8DAC', c2: '#4F5F84', icon: '◑' },
            { t: 'Дыхание', m: '3 мин', c1: '#D8A4C0', c2: '#A87D96', icon: '◒' },
          ].map((it, i) => (
            <LinearGradient
              key={i}
              colors={[it.c1, it.c2]}
              style={styles.quickCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.quickIcon}>{it.icon}</Text>
              <Text style={styles.quickT}>{it.t}</Text>
              <Text style={styles.quickM}>{it.m}</Text>
            </LinearGradient>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
          <Text style={styles.sectionHead}>Под настроение</Text>
          <Text style={styles.linkSmall}>Все</Text>
        </View>
        {sessions.slice(0, 3).map((s) => (
          <View key={s.id} style={styles.moodCard}>
            <LinearGradient
              colors={moodColors[s.mood]}
              style={styles.moodVisual}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.moodIcon}>{moodIcons[s.mood]}</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.moodCategory}>{s.category}</Text>
              <Text style={styles.moodTitle}>{s.title}</Text>
              <Text style={styles.moodTime}>{s.minutes} мин</Text>
            </View>
            <View style={styles.moodPlay}>
              <Text style={{ color: C.ink, fontSize: 16 }}>▶</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.quote}>
        <Text style={styles.quoteText}>«Чем тише ты становишься,{'\n'}тем больше можешь услышать».</Text>
        <Text style={styles.quoteAuthor}>— Рам Дасс</Text>
      </View>
    </>
  );
}

function SessionsScreen() {
  const categories = ['Все', 'Фокус', 'Сон', 'Тревога', 'Осознанность', 'Сострадание'];
  const [active, setActive] = useState('Все');
  const filtered = active === 'Все' ? sessions : sessions.filter(s => s.category === active);
  return (
    <>
      <Text style={styles.bigHead}>Библиотека</Text>
      <Text style={styles.bigSub}>Сессии для любого состояния</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 28 }}>
        <View style={{ flexDirection: 'row', gap: 8, paddingRight: 20 }}>
          {categories.map(c => (
            <TouchableOpacity key={c} onPress={() => setActive(c)} style={[styles.tab, active === c && styles.tabActive]}>
              <Text style={[styles.tabTxt, active === c && styles.tabTxtActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={{ gap: 14, marginTop: 24 }}>
        {filtered.map(s => (
          <View key={s.id} style={styles.libCard}>
            <LinearGradient colors={moodColors[s.mood]} style={styles.libVisual} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={styles.libIcon}>{moodIcons[s.mood]}</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.libCat}>{s.category}</Text>
              <Text style={styles.libTitle}>{s.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 }}>
                <Text style={styles.libMeta}>⏱ {s.minutes} мин</Text>
                <Text style={styles.libMeta}>★ 4.8</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </>
  );
}

function BreatheScreen() {
  const scale = useRef(new Animated.Value(0.5)).current;
  const [phase, setPhase] = useState<'Вдох' | 'Задержка' | 'Выдох'>('Вдох');

  useEffect(() => {
    const seq = () => {
      setPhase('Вдох');
      Animated.timing(scale, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }).start(() => {
        setPhase('Задержка');
        setTimeout(() => {
          setPhase('Выдох');
          Animated.timing(scale, { toValue: 0.5, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }).start(seq);
        }, 2000);
      });
    };
    seq();
  }, []);

  return (
    <View style={{ alignItems: 'center', paddingTop: 60 }}>
      <Text style={styles.bigHead}>Дыхание</Text>
      <Text style={styles.bigSub}>Квадратное дыхание · 4–2–4</Text>
      <View style={{ height: 360, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
        <Animated.View style={[styles.breatheOuter, { transform: [{ scale }] }]} />
        <Animated.View style={[styles.breatheMid, { transform: [{ scale }] }]} />
        <Animated.View style={[styles.breatheInner, { transform: [{ scale }] }]}>
          <LinearGradient colors={['#E89F8A', '#D67D63']} style={StyleSheet.absoluteFill} />
        </Animated.View>
        <Text style={styles.breathePhase}>{phase}</Text>
      </View>
      <View style={styles.breatheStats}>
        <View style={styles.breatheStat}><Text style={styles.breatheStatV}>04:32</Text><Text style={styles.breatheStatL}>Длительность</Text></View>
        <View style={styles.divider} />
        <View style={styles.breatheStat}><Text style={styles.breatheStatV}>12</Text><Text style={styles.breatheStatL}>Циклов</Text></View>
        <View style={styles.divider} />
        <View style={styles.breatheStat}><Text style={styles.breatheStatV}>68</Text><Text style={styles.breatheStatL}>уд/мин</Text></View>
      </View>
    </View>
  );
}

function ProgressScreen() {
  const history = [
    { day: 'Пн', done: true, mins: 10 },
    { day: 'Вт', done: true, mins: 15 },
    { day: 'Ср', done: true, mins: 8 },
    { day: 'Чт', done: true, mins: 20 },
    { day: 'Пт', done: true, mins: 12 },
    { day: 'Сб', done: true, mins: 25 },
    { day: 'Вс', done: true, mins: 18 },
  ];
  return (
    <>
      <Text style={styles.bigHead}>Прогресс</Text>
      <Text style={styles.bigSub}>Каждый вдох важен</Text>
      <LinearGradient colors={['#A4B59A', '#6F8A7E']} style={styles.statHero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View>
          <Text style={styles.statHeroKicker}>ВСЕГО МИНУТ</Text>
          <Text style={styles.statHeroValue}>1 248</Text>
          <Text style={styles.statHeroNote}>Это больше 20 часов осознанности 🌿</Text>
        </View>
      </LinearGradient>
      <View style={styles.weekCard}>
        <Text style={styles.weekHead}>На этой неделе</Text>
        <View style={styles.weekRow}>
          {history.map((d, i) => (
            <View key={i} style={styles.weekDay}>
              <View style={[styles.weekDot, d.done && { backgroundColor: C.rose2 }]} />
              <Text style={styles.weekLabel}>{d.day}</Text>
            </View>
          ))}
        </View>
        <View style={styles.weekFoot}>
          <Text style={styles.weekFootTxt}><Text style={{ color: C.ink, fontWeight: '700' }}>108 мин</Text> на этой неделе</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
        <View style={styles.miniStat}><Text style={styles.miniStatV}>7</Text><Text style={styles.miniStatL}>Дней подряд</Text></View>
        <View style={styles.miniStat}><Text style={styles.miniStatV}>42</Text><Text style={styles.miniStatL}>Сессий</Text></View>
        <View style={styles.miniStat}><Text style={styles.miniStatV}>18</Text><Text style={styles.miniStatL}>Мин/день</Text></View>
      </View>
    </>
  );
}

const moodColors: Record<string, [string, string]> = {
  sunrise: ['#FFD8A8', '#E89F8A'],
  ocean: ['#A4B5C8', '#5E7A9C'],
  night: ['#7E8DAC', '#3F4D6F'],
  forest: ['#A4B59A', '#6F8A7E'],
  sunset: ['#E8A8B0', '#A87D96'],
};

const moodIcons: Record<string, string> = {
  sunrise: '☀',
  ocean: '🌊',
  night: '🌙',
  forest: '🌲',
  sunset: '✦',
};

function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: string }[] = [
    { id: 'home', label: 'Главная', icon: '◯' },
    { id: 'sessions', label: 'Сессии', icon: '◑' },
    { id: 'breathe', label: 'Дыхание', icon: '◉' },
    { id: 'progress', label: 'Прогресс', icon: '▣' },
  ];
  return (
    <View style={styles.navBar}>
      {items.map(it => (
        <TouchableOpacity key={it.id} style={styles.navItem} onPress={() => setTab(it.id)}>
          <Text style={[styles.navIcon, tab === it.id && { color: C.rose2 }]}>{it.icon}</Text>
          <Text style={[styles.navLabel, tab === it.id && { color: C.rose2, fontWeight: '700' }]}>{it.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: C.bg },
  bgWrap: { ...StyleSheet.absoluteFill as any, overflow: 'hidden' },
  blob1: { position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: 200, backgroundColor: C.rose, opacity: 0.18 },
  blob2: { position: 'absolute', top: 300, left: -120, width: 320, height: 320, borderRadius: 160, backgroundColor: C.sage, opacity: 0.18 },
  blob3: { position: 'absolute', bottom: 200, right: -80, width: 280, height: 280, borderRadius: 140, backgroundColor: '#E8B07A', opacity: 0.15 },

  scroll: { padding: 24, paddingTop: 70, maxWidth: 460, alignSelf: 'center', width: '100%' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  greeting: { color: C.muted, fontSize: 14, letterSpacing: 0.5 },
  greetingName: { color: C.ink, fontSize: 32, fontWeight: '300', letterSpacing: -1, marginTop: 2 },
  streakBadge: { backgroundColor: C.card, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 18, alignItems: 'center' },
  streakNum: { color: C.rose2, fontSize: 22, fontWeight: '800', lineHeight: 24 },
  streakLbl: { color: C.muted, fontSize: 10, letterSpacing: 1, marginTop: 2 },

  featuredCard: { borderRadius: 28, padding: 28, flexDirection: 'row', overflow: 'hidden', marginBottom: 32, minHeight: 200 },
  featuredKicker: { color: 'rgba(42,31,26,0.6)', fontSize: 11, letterSpacing: 2, fontWeight: '700', marginBottom: 8 },
  featuredTitle: { color: C.ink, fontSize: 30, fontWeight: '300', letterSpacing: -0.5, marginBottom: 6 },
  featuredMeta: { color: 'rgba(42,31,26,0.75)', fontSize: 13, marginBottom: 22 },
  playBtn: { backgroundColor: C.ink, paddingHorizontal: 22, paddingVertical: 12, borderRadius: 100, alignSelf: 'flex-start' },
  playBtnTxt: { color: C.bg, fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  featuredVisual: { width: 110, height: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  fLayer1: { position: 'absolute', width: 110, height: 110, borderRadius: 55, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)' },
  fLayer2: { position: 'absolute', width: 80, height: 80, borderRadius: 40, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)' },
  fLayer3: { position: 'absolute', width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.7)' },

  section: { marginBottom: 32 },
  sectionHead: { color: C.ink, fontSize: 22, fontWeight: '300', letterSpacing: -0.5 },
  linkSmall: { color: C.rose2, fontSize: 13, fontWeight: '600' },

  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  quickCard: { width: (Math.min(width, 460) - 24 * 2 - 12) / 2, padding: 22, borderRadius: 22, height: 130, justifyContent: 'space-between' },
  quickIcon: { color: 'rgba(255,255,255,0.9)', fontSize: 28 },
  quickT: { color: '#fff', fontSize: 22, fontWeight: '600', letterSpacing: -0.5 },
  quickM: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: -4 },

  moodCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: C.card, padding: 16, borderRadius: 22, marginBottom: 12 },
  moodVisual: { width: 64, height: 64, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  moodIcon: { fontSize: 26, color: '#fff' },
  moodCategory: { color: C.muted, fontSize: 11, letterSpacing: 1.5, fontWeight: '600' },
  moodTitle: { color: C.ink, fontSize: 17, fontWeight: '600', marginTop: 4 },
  moodTime: { color: C.muted, fontSize: 12, marginTop: 4 },
  moodPlay: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.bg2, alignItems: 'center', justifyContent: 'center' },

  quote: { backgroundColor: 'rgba(42,31,26,0.05)', padding: 30, borderRadius: 24, alignItems: 'center' },
  quoteText: { color: C.ink, fontSize: 18, fontWeight: '300', textAlign: 'center', lineHeight: 28, fontStyle: 'italic' },
  quoteAuthor: { color: C.muted, fontSize: 12, letterSpacing: 1, marginTop: 14 },

  bigHead: { color: C.ink, fontSize: 42, fontWeight: '300', letterSpacing: -1.5 },
  bigSub: { color: C.muted, fontSize: 15, marginTop: 6 },

  tab: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 100, backgroundColor: 'rgba(42,31,26,0.06)' },
  tabActive: { backgroundColor: C.ink },
  tabTxt: { color: C.ink, fontSize: 13, fontWeight: '500' },
  tabTxtActive: { color: C.bg },

  libCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: C.card, padding: 16, borderRadius: 22 },
  libVisual: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  libIcon: { fontSize: 30, color: '#fff' },
  libCat: { color: C.muted, fontSize: 11, letterSpacing: 1.5, fontWeight: '600' },
  libTitle: { color: C.ink, fontSize: 17, fontWeight: '600', marginTop: 4 },
  libMeta: { color: C.muted, fontSize: 12 },

  breatheOuter: { position: 'absolute', width: 320, height: 320, borderRadius: 160, backgroundColor: C.rose, opacity: 0.15 },
  breatheMid: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: C.rose, opacity: 0.25 },
  breatheInner: { position: 'absolute', width: 160, height: 160, borderRadius: 80, overflow: 'hidden' },
  breathePhase: { color: C.ink, fontSize: 26, fontWeight: '300', letterSpacing: 4, position: 'absolute', backgroundColor: 'transparent' },
  breatheStats: { flexDirection: 'row', alignItems: 'center', gap: 24, marginTop: 30, paddingHorizontal: 20 },
  breatheStat: { alignItems: 'center' },
  breatheStatV: { color: C.ink, fontSize: 22, fontWeight: '600' },
  breatheStatL: { color: C.muted, fontSize: 11, letterSpacing: 1, marginTop: 4 },
  divider: { width: 1, height: 30, backgroundColor: 'rgba(42,31,26,0.15)' },

  statHero: { padding: 30, borderRadius: 28, marginTop: 28 },
  statHeroKicker: { color: 'rgba(255,255,255,0.85)', fontSize: 11, letterSpacing: 2, fontWeight: '600' },
  statHeroValue: { color: '#fff', fontSize: 70, fontWeight: '200', letterSpacing: -3, marginTop: 6 },
  statHeroNote: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },

  weekCard: { backgroundColor: C.card, borderRadius: 24, padding: 22, marginTop: 16 },
  weekHead: { color: C.muted, fontSize: 12, letterSpacing: 2, fontWeight: '600', marginBottom: 18 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weekDay: { alignItems: 'center', gap: 8 },
  weekDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(42,31,26,0.08)' },
  weekLabel: { color: C.muted, fontSize: 11 },
  weekFoot: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(42,31,26,0.08)' },
  weekFootTxt: { color: C.muted, fontSize: 13 },

  miniStat: { flex: 1, backgroundColor: C.card, padding: 16, borderRadius: 18, alignItems: 'center' },
  miniStatV: { color: C.ink, fontSize: 26, fontWeight: '600' },
  miniStatL: { color: C.muted, fontSize: 11, letterSpacing: 1, marginTop: 4, textAlign: 'center' },

  navBar: { position: 'absolute', bottom: 20, left: 20, right: 20, maxWidth: 440, alignSelf: 'center', flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 100, padding: 8, justifyContent: 'space-around' },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  navIcon: { color: C.muted, fontSize: 18 },
  navLabel: { color: C.muted, fontSize: 10, marginTop: 4, letterSpacing: 0.5 },
});
