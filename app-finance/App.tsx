import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCurrency, transactions, monthlyData, savingsPercent } from './utils';

const { width } = Dimensions.get('window');

const C = {
  bg: '#0B0F12',
  card: '#161B22',
  card2: '#1F2630',
  fg: '#fff',
  muted: '#8893A7',
  accent: '#34D399',
  red: '#F87171',
  blue: '#60A5FA',
  yellow: '#FBBF24',
  purple: '#A78BFA',
  line: 'rgba(255,255,255,0.06)',
};

type Tab = 'home' | 'cards' | 'analytics' | 'profile';

export default function App() {
  const [tab, setTab] = useState<Tab>('home');

  return (
    <View style={styles.app}>
      <StatusBar style="light" />
      <View style={styles.bgGlow1} />
      <View style={styles.bgGlow2} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {tab === 'home' && <HomeScreen />}
        {tab === 'cards' && <CardsScreen />}
        {tab === 'analytics' && <AnalyticsScreen />}
        {tab === 'profile' && <ProfileScreen />}
        <View style={{ height: 100 }} />
      </ScrollView>
      <BottomNav tab={tab} setTab={setTab} />
    </View>
  );
}

function HomeScreen() {
  const balAnim = useRef(new Animated.Value(0)).current;
  const [bal, setBal] = useState(0);

  useEffect(() => {
    Animated.timing(balAnim, { toValue: 1248050, duration: 1400, useNativeDriver: false, easing: Easing.out(Easing.cubic) }).start();
    const id = balAnim.addListener(({ value }) => setBal(value));
    return () => balAnim.removeListener(id);
  }, []);

  return (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.greet}>С возвращением</Text>
          <Text style={styles.greetName}>Мира Чен</Text>
        </View>
        <View style={styles.bellWrap}>
          <Text style={{ fontSize: 18, color: C.fg }}>🔔</Text>
          <View style={styles.bellDot} />
        </View>
      </View>

      <LinearGradient colors={['#1F2630', '#0B0F12']} style={styles.balanceCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.balanceTopRow}>
          <View>
            <Text style={styles.balanceLabel}>ОБЩИЙ БАЛАНС</Text>
            <Text style={styles.balanceValue}>{formatCurrency(bal)}</Text>
          </View>
          <View style={styles.balanceTag}>
            <Text style={{ color: C.accent, fontSize: 12, fontWeight: '700' }}>↑ 12.4%</Text>
          </View>
        </View>
        <View style={styles.cardChip}>
          <View style={styles.chipBar} /><View style={styles.chipBar} /><View style={styles.chipBar} />
        </View>
        <View style={styles.cardBottom}>
          <Text style={styles.cardNum}>•••• •••• •••• 4892</Text>
          <Text style={styles.cardBrand}>VAULT</Text>
        </View>
      </LinearGradient>

      <View style={styles.quickActions}>
        {[
          { lbl: 'Отправить', icon: '↗', c: C.blue },
          { lbl: 'Получить', icon: '↙', c: C.accent },
          { lbl: 'Пополнить', icon: '+', c: C.purple },
          { lbl: 'Оплатить', icon: '◉', c: C.yellow },
        ].map((a, i) => (
          <TouchableOpacity key={i} style={styles.actionItem}>
            <View style={[styles.actionIcon, { borderColor: a.c }]}>
              <Text style={{ color: a.c, fontSize: 22, fontWeight: '700' }}>{a.icon}</Text>
            </View>
            <Text style={styles.actionLbl}>{a.lbl}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsRow}>
        <LinearGradient colors={['#34D399', '#10B981']} style={styles.statCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.statLbl}>ДОХОД</Text>
          <Text style={styles.statVal}>425 000 ₽</Text>
          <View style={styles.spark}>
            {[12, 18, 14, 24, 20, 28, 32].map((h, i) => (
              <View key={i} style={[styles.sparkBar, { height: h, backgroundColor: 'rgba(255,255,255,0.6)' }]} />
            ))}
          </View>
        </LinearGradient>
        <View style={styles.statCardDark}>
          <Text style={styles.statLbl}>РАСХОДЫ</Text>
          <Text style={[styles.statVal, { color: C.fg }]}>182 000 ₽</Text>
          <View style={styles.spark}>
            {[20, 16, 28, 18, 22, 14, 18].map((h, i) => (
              <View key={i} style={[styles.sparkBar, { height: h, backgroundColor: C.red, opacity: 0.6 }]} />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <View>
            <Text style={styles.sectionTitle}>Цель накоплений</Text>
            <Text style={styles.sectionSub}>Первый взнос за квартиру</Text>
          </View>
        </View>
        <View style={styles.savingsCard}>
          <View style={styles.savingsRow}>
            <View>
              <Text style={styles.savingsCur}>842 000 ₽</Text>
              <Text style={styles.savingsOf}>из 1 500 000 ₽</Text>
            </View>
            <Text style={styles.savingsPct}>{savingsPercent(8420, 15000)}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <LinearGradient colors={['#A78BFA', '#60A5FA']} style={[styles.progressFill, { width: `${savingsPercent(8420, 15000)}%` }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
          </View>
          <Text style={styles.savingsNote}>Осталось 125 000 ₽ в этом месяце — идёте по плану 🎯</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Последние операции</Text>
          <Text style={styles.sectionLink}>Все →</Text>
        </View>
        <View style={{ gap: 8 }}>
          {transactions.slice(0, 5).map((t) => (
            <View key={t.id} style={styles.txRow}>
              <View style={styles.txIcon}><Text style={{ fontSize: 22 }}>{t.icon}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txName}>{t.name}</Text>
                <Text style={styles.txCat}>{t.category}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.txAmt, t.amount > 0 && { color: C.accent }]}>
                  {t.amount > 0 ? '+' : ''}{formatCurrency(t.amount).replace('-','')}
                </Text>
                <Text style={styles.txDate}>{t.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}

function CardsScreen() {
  return (
    <>
      <Text style={styles.bigHead}>Мои карты</Text>
      <Text style={styles.bigSub}>Управляйте способами оплаты</Text>
      <View style={{ marginTop: 28, gap: 18 }}>
        <LinearGradient colors={['#1F2630', '#0B0F12']} style={styles.cardLarge} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.cardSmallLbl}>ОСНОВНАЯ</Text>
          <Text style={styles.cardLargeNum}>•••• 4892</Text>
          <View style={styles.cardLargeFoot}>
            <View><Text style={styles.cardSmallLbl}>БАЛАНС</Text><Text style={styles.cardLargeBal}>1 248 050 ₽</Text></View>
            <Text style={styles.cardBrand}>VAULT</Text>
          </View>
        </LinearGradient>
        <LinearGradient colors={['#34D399', '#0F766E']} style={styles.cardLarge} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.cardSmallLbl}>НАКОПЛЕНИЯ</Text>
          <Text style={styles.cardLargeNum}>•••• 7311</Text>
          <View style={styles.cardLargeFoot}>
            <View><Text style={styles.cardSmallLbl}>БАЛАНС</Text><Text style={styles.cardLargeBal}>842 000 ₽</Text></View>
            <Text style={styles.cardBrand}>SAVE</Text>
          </View>
        </LinearGradient>
        <LinearGradient colors={['#A78BFA', '#6D28D9']} style={styles.cardLarge} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.cardSmallLbl}>ИНВЕСТИЦИИ</Text>
          <Text style={styles.cardLargeNum}>•••• 2456</Text>
          <View style={styles.cardLargeFoot}>
            <View><Text style={styles.cardSmallLbl}>ПОРТФЕЛЬ</Text><Text style={styles.cardLargeBal}>2 489 010 ₽</Text></View>
            <Text style={styles.cardBrand}>STOCKS</Text>
          </View>
        </LinearGradient>
      </View>
      <TouchableOpacity style={styles.addCard}>
        <Text style={{ color: C.muted, fontSize: 24, marginBottom: 6 }}>+</Text>
        <Text style={{ color: C.muted, fontSize: 13, fontWeight: '600' }}>Добавить карту</Text>
      </TouchableOpacity>
    </>
  );
}

function AnalyticsScreen() {
  const maxV = Math.max(...monthlyData.map(d => d.income));
  return (
    <>
      <Text style={styles.bigHead}>Аналитика</Text>
      <Text style={styles.bigSub}>Финансовый обзор</Text>
      <View style={styles.analyticCard}>
        <Text style={styles.analyticLbl}>ЧИСТЫЙ КАПИТАЛ</Text>
        <Text style={styles.analyticVal}>4 579 060 ₽</Text>
        <Text style={{ color: C.accent, fontSize: 13, fontWeight: '600' }}>+342 000 ₽ за месяц (+8.1%)</Text>
        <View style={styles.chartContainer}>
          {monthlyData.map((d, i) => {
            const ih = (d.income / maxV) * 100;
            const eh = (d.expense / maxV) * 100;
            return (
              <View key={i} style={styles.chartColAna}>
                <View style={styles.chartBars}>
                  <View style={[styles.chartBar, { height: ih, backgroundColor: C.accent }]} />
                  <View style={[styles.chartBar, { height: eh, backgroundColor: C.red, opacity: 0.5 }]} />
                </View>
                <Text style={styles.chartLbl}>{d.month}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: C.accent }]} /><Text style={styles.legendTxt}>Доход</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: C.red, opacity: 0.7 }]} /><Text style={styles.legendTxt}>Расходы</Text></View>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 28, marginBottom: 16 }]}>Топ категорий</Text>
      <View style={{ gap: 10 }}>
        {[
          { lbl: 'Покупки', pct: 38, val: '69 200 ₽', c: C.blue, icon: '🛍' },
          { lbl: 'Еда и напитки', pct: 24, val: '43 600 ₽', c: C.yellow, icon: '🍽' },
          { lbl: 'Транспорт', pct: 18, val: '32 800 ₽', c: C.purple, icon: '🚗' },
          { lbl: 'Подписки', pct: 12, val: '21 800 ₽', c: C.red, icon: '🎬' },
        ].map((c, i) => (
          <View key={i} style={styles.catRow}>
            <View style={[styles.catIcon, { backgroundColor: `${c.c}22` }]}>
              <Text style={{ fontSize: 18 }}>{c.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={styles.catLbl}>{c.lbl}</Text>
                <Text style={styles.catVal}>{c.val}</Text>
              </View>
              <View style={styles.catTrack}><View style={[styles.catFill, { width: `${c.pct}%`, backgroundColor: c.c }]} /></View>
            </View>
          </View>
        ))}
      </View>
    </>
  );
}

function ProfileScreen() {
  return (
    <>
      <Text style={styles.bigHead}>Аккаунт</Text>
      <View style={styles.profileHero}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop' }}
          style={styles.profileAvatar}
        />
        <Text style={styles.profileName}>Мира Чен</Text>
        <Text style={styles.profileMeta}>Premium · с 2023 года</Text>
      </View>
      <View style={{ gap: 8, marginTop: 30 }}>
        {[
          { label: 'Личные данные', icon: '👤' },
          { label: 'Безопасность', icon: '🔒' },
          { label: 'Способы оплаты', icon: '💳' },
          { label: 'Уведомления', icon: '🔔' },
          { label: 'Валюта и язык', icon: '🌐' },
          { label: 'Помощь и поддержка', icon: '💬' },
        ].map((m, i) => (
          <View key={i} style={styles.menuRow}>
            <Text style={{ fontSize: 20 }}>{m.icon}</Text>
            <Text style={styles.menuTxt}>{m.label}</Text>
            <Text style={styles.menuArrow}>→</Text>
          </View>
        ))}
      </View>
    </>
  );
}

function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: string }[] = [
    { id: 'home', label: 'Главная', icon: '◉' },
    { id: 'cards', label: 'Карты', icon: '▭' },
    { id: 'analytics', label: 'Статистика', icon: '▣' },
    { id: 'profile', label: 'Профиль', icon: '◐' },
  ];
  return (
    <View style={styles.navBar}>
      {items.map(it => (
        <TouchableOpacity key={it.id} style={styles.navItem} onPress={() => setTab(it.id)}>
          <Text style={[styles.navIcon, tab === it.id && { color: C.accent }]}>{it.icon}</Text>
          <Text style={[styles.navLabel, tab === it.id && { color: C.accent }]}>{it.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: C.bg },
  bgGlow1: { position: 'absolute', top: -120, right: -100, width: 360, height: 360, borderRadius: 200, backgroundColor: C.purple, opacity: 0.08 },
  bgGlow2: { position: 'absolute', top: 240, left: -100, width: 300, height: 300, borderRadius: 200, backgroundColor: C.accent, opacity: 0.06 },
  scroll: { padding: 22, paddingTop: 60, maxWidth: 460, alignSelf: 'center', width: '100%' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greet: { color: C.muted, fontSize: 13, letterSpacing: 0.5 },
  greetName: { color: C.fg, fontSize: 24, fontWeight: '700', letterSpacing: -0.5, marginTop: 2 },
  bellWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  bellDot: { position: 'absolute', top: 10, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: C.red },

  balanceCard: { padding: 26, borderRadius: 24, marginBottom: 24, overflow: 'hidden', borderWidth: 1, borderColor: C.line },
  balanceTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  balanceLabel: { color: C.muted, fontSize: 11, letterSpacing: 2, fontWeight: '600' },
  balanceValue: { color: C.fg, fontSize: 38, fontWeight: '800', letterSpacing: -1.5, marginTop: 8 },
  balanceTag: { backgroundColor: 'rgba(52,211,153,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  cardChip: { flexDirection: 'row', gap: 4, marginTop: 30, marginBottom: 24 },
  chipBar: { width: 24, height: 18, backgroundColor: '#C0A472', borderRadius: 3 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardNum: { color: C.fg, fontSize: 16, letterSpacing: 3, fontFamily: 'monospace' },
  cardBrand: { color: C.fg, fontSize: 16, fontWeight: '800', letterSpacing: 2 },

  quickActions: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: C.card, padding: 18, borderRadius: 20, marginBottom: 24, borderWidth: 1, borderColor: C.line },
  actionItem: { alignItems: 'center', gap: 8 },
  actionIcon: { width: 48, height: 48, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  actionLbl: { color: C.fg, fontSize: 11, fontWeight: '500' },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  statCard: { flex: 1, padding: 20, borderRadius: 20, minHeight: 130, justifyContent: 'space-between' },
  statCardDark: { flex: 1, padding: 20, borderRadius: 20, minHeight: 130, backgroundColor: C.card, justifyContent: 'space-between', borderWidth: 1, borderColor: C.line },
  statLbl: { color: 'rgba(255,255,255,0.85)', fontSize: 11, letterSpacing: 2, fontWeight: '700' },
  statVal: { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.5, marginTop: 8 },
  spark: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 32 },
  sparkBar: { width: 4, borderRadius: 2 },

  section: { marginBottom: 28 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  sectionTitle: { color: C.fg, fontSize: 20, fontWeight: '700', letterSpacing: -0.5 },
  sectionSub: { color: C.muted, fontSize: 13, marginTop: 2 },
  sectionLink: { color: C.accent, fontSize: 13, fontWeight: '600' },

  savingsCard: { backgroundColor: C.card, padding: 22, borderRadius: 22, borderWidth: 1, borderColor: C.line },
  savingsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18 },
  savingsCur: { color: C.fg, fontSize: 28, fontWeight: '800', letterSpacing: -1 },
  savingsOf: { color: C.muted, fontSize: 13, marginTop: 4 },
  savingsPct: { color: C.purple, fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  progressTrack: { height: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
  savingsNote: { color: C.muted, fontSize: 12, marginTop: 14 },

  txRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.card, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: C.line },
  txIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center' },
  txName: { color: C.fg, fontSize: 15, fontWeight: '600' },
  txCat: { color: C.muted, fontSize: 12, marginTop: 2 },
  txAmt: { color: C.fg, fontSize: 16, fontWeight: '700' },
  txDate: { color: C.muted, fontSize: 11, marginTop: 2 },

  bigHead: { color: C.fg, fontSize: 38, fontWeight: '800', letterSpacing: -1.5, marginTop: 10 },
  bigSub: { color: C.muted, fontSize: 15, marginTop: 6 },

  cardLarge: { padding: 26, borderRadius: 22, minHeight: 170 },
  cardSmallLbl: { color: 'rgba(255,255,255,0.8)', fontSize: 10, letterSpacing: 2, fontWeight: '700' },
  cardLargeNum: { color: '#fff', fontSize: 22, letterSpacing: 4, fontFamily: 'monospace', marginTop: 14, marginBottom: 26 },
  cardLargeFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLargeBal: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 4, letterSpacing: -0.5 },
  addCard: { backgroundColor: 'transparent', borderRadius: 22, padding: 30, alignItems: 'center', borderWidth: 1.5, borderColor: C.line, borderStyle: 'dashed', marginTop: 20 },

  analyticCard: { backgroundColor: C.card, padding: 24, borderRadius: 24, marginTop: 28, borderWidth: 1, borderColor: C.line },
  analyticLbl: { color: C.muted, fontSize: 11, letterSpacing: 2, fontWeight: '700' },
  analyticVal: { color: C.fg, fontSize: 36, fontWeight: '800', letterSpacing: -1.5, marginTop: 6, marginBottom: 6 },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140, marginTop: 26 },
  chartColAna: { flex: 1, alignItems: 'center' },
  chartBars: { flexDirection: 'row', gap: 3, alignItems: 'flex-end', height: 110 },
  chartBar: { width: 8, borderRadius: 3, minHeight: 4 },
  chartLbl: { color: C.muted, fontSize: 11, marginTop: 6 },
  legend: { flexDirection: 'row', gap: 20, marginTop: 18, paddingTop: 16, borderTopWidth: 1, borderTopColor: C.line },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendTxt: { color: C.muted, fontSize: 12 },

  catRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.card, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: C.line },
  catIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  catLbl: { color: C.fg, fontSize: 14, fontWeight: '600' },
  catVal: { color: C.fg, fontSize: 14, fontWeight: '700' },
  catTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' },
  catFill: { height: '100%', borderRadius: 3 },

  profileHero: { alignItems: 'center', backgroundColor: C.card, padding: 30, borderRadius: 24, borderWidth: 1, borderColor: C.line, marginTop: 28 },
  profileAvatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  profileName: { color: C.fg, fontSize: 22, fontWeight: '700' },
  profileMeta: { color: C.muted, fontSize: 13, marginTop: 4 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.card, padding: 18, borderRadius: 16, borderWidth: 1, borderColor: C.line },
  menuTxt: { color: C.fg, fontSize: 15, fontWeight: '500', flex: 1 },
  menuArrow: { color: C.muted, fontSize: 16 },

  navBar: { position: 'absolute', bottom: 20, left: 22, right: 22, maxWidth: 420, alignSelf: 'center', flexDirection: 'row', backgroundColor: 'rgba(22,27,34,0.95)', borderRadius: 100, padding: 8, borderWidth: 1, borderColor: C.line, justifyContent: 'space-around' },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  navIcon: { color: C.muted, fontSize: 18 },
  navLabel: { color: C.muted, fontSize: 10, marginTop: 4, letterSpacing: 0.5 },
});
