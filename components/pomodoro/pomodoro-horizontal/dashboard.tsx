import { useThemeColor } from '@/hooks/use-theme-color';
import { fetchDayData } from '@/utils/mock-data';
import { formatTime as formatPomodoroTime } from '@/utils/pomodoro';
import { BlurView } from 'expo-blur';
import { ImageBackground } from 'expo-image';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BACKGROUND_IMAGE = require('@/assets/images/welcome.png');

const MOTIVATION_QUOTES = [
  '别被时间追着跑，和它做朋友。',
  '保持专注的每一分钟，都是向前迈出的坚实一步。',
  '深呼吸，慢慢来，一切都会有答案。',
  '今天播种的努力，正悄悄发芽。',
  '学习不只是完成任务，而是与更好的自己相遇。',
];

function useClock() {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return now;
}

function useMiniTimer(durationMinutes = 25) {
  const [elapsed, setElapsed] = React.useState(0);
  const totalSeconds = durationMinutes * 60;

  React.useEffect(() => {
    const id = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= totalSeconds) {
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [totalSeconds]);

  const remaining = Math.max(0, totalSeconds - elapsed);
  const progress = 1 - remaining / totalSeconds;

  return {
    elapsed,
    remaining,
    progress,
    display: formatPomodoroTime(remaining),
  };
}

export function PomodoroHorizontalDashboard() {
  const now = useClock();
  const timer = useMiniTimer(25);
  const insets = useSafeAreaInsets();
  const accentColor = useThemeColor({}, 'accent');
  const textColor = '#FFFFFF';
  const softTextColor = 'rgba(255,255,255,0.7)';
  const cardColor = 'rgba(8, 8, 12, 0.35)';
  const borderColor = 'rgba(255,255,255,0.15)';

  const { courses, todos } = React.useMemo(() => fetchDayData(now), [now]);
  const slogan = React.useMemo(() => {
    const index = now.getDate() % MOTIVATION_QUOTES.length;
    return MOTIVATION_QUOTES[index];
  }, [now]);

  const formattedTime = now.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';

  return (
    <ImageBackground
      source={BACKGROUND_IMAGE}
      style={styles.background}
      contentFit="cover"
    >
      <BlurView intensity={50} tint="dark" style={styles.blurOverlay}>
        <View style={styles.overlay} />
        <View style={[styles.grid, { paddingBottom: 12 + insets.bottom }]}>
          <View style={styles.leftColumn}>
            <View
              style={[
                styles.timePanel,
                { backgroundColor: cardColor, borderColor, marginBottom: 12 },
              ]}
            >
              <View style={styles.timeHeader}>
                <Text style={[styles.ampmBadge, { color: '#111', backgroundColor: textColor }]}>
                  {ampm}
                </Text>
              </View>
              <Text style={[styles.timeText, { color: textColor }]}>{formattedTime}</Text>
              <Text style={[styles.dateText, { color: softTextColor }]}>{formattedDate}</Text>
            </View>

            <View style={styles.leftBottomRow}>
              <View
                style={[
                  styles.mascotCard,
                  { backgroundColor: cardColor, borderColor, marginRight: 12 },
                ]}
              >
                <Text style={[styles.mascotPlaceholder, { color: softTextColor }]}>
                  吉祥物占位
                </Text>
              </View>

              <View style={[styles.timerCard, { backgroundColor: cardColor, borderColor }]}>
                <View style={styles.timerContent}>
                  <View style={styles.timerHeader}>
                    <Text style={[styles.timerLabel, { color: softTextColor }]}>专注倒计时</Text>
                    <Text style={[styles.timerMinutes, { color: textColor }]}>{timer.display}</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressThumb,
                        { width: `${timer.progress * 100}%`, backgroundColor: accentColor },
                      ]}
                    />
                  </View>
                  <Text
                  style={[styles.timerHint, { color: softTextColor }]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {timer.progress < 1 ? '保持呼吸，继续前进' : '本轮结束，准备下一次专注'}
                </Text>
                </View>

              </View>
            </View>
          </View>

          <View style={styles.rightColumn}>
            <View
              style={[
                styles.quoteCard,
                { backgroundColor: cardColor, borderColor, marginBottom: 10 },
              ]}
            >
              <View style={styles.quoteGlow} />
              <Text style={[styles.quoteText, { color: textColor }]}>{slogan}</Text>
              <Text style={[styles.quoteSubText, { color: softTextColor }]}>
                每一次专注，都是对未来的投资
              </Text>
            </View>

            <View style={styles.rightLower}>
              <View
                style={[
                  styles.infoCard,
                  { backgroundColor: cardColor, borderColor, marginBottom: 10 },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: textColor }]}>今日课程</Text>
                {courses.length === 0 ? (
                  <Text style={[styles.emptyText, { color: softTextColor }]}>
                    今天没有安排课程
                  </Text>
                ) : (
                  courses.slice(0, 3).map((course) => (
                    <View key={course.id} style={styles.listItem}>
                      <View style={styles.listDot} />
                      <View style={styles.listBody}>
                        <Text style={[styles.listTitle, { color: textColor }]}>{course.title}</Text>
                        <Text style={[styles.listSub, { color: softTextColor }]}>
                          {course.time} · {course.location}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>

              <View style={[styles.infoCard, { backgroundColor: cardColor, borderColor }]}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>今日待办</Text>
                {todos.length === 0 ? (
                  <Text style={[styles.emptyText, { color: softTextColor }]}>
                    去添加一个小目标吧
                  </Text>
                ) : (
                  todos.slice(0, 3).map((todo) => (
                    <View key={todo.id} style={styles.listItem}>
                      <View style={[styles.todoBadge, { borderColor: accentColor }]}>
                        <Text style={[styles.todoBadgeText, { color: accentColor }]}>·</Text>
                      </View>
                      <View style={styles.listBody}>
                        <Text style={[styles.listTitle, { color: textColor }]}>{todo.title}</Text>
                        {!!todo.subtitle && (
                          <Text style={[styles.listSub, { color: softTextColor }]}>
                            {todo.subtitle} · {todo.dueDate ?? '今日完成'}
                          </Text>
                        )}
                        {!todo.subtitle && todo.dueDate && (
                          <Text style={[styles.listSub, { color: softTextColor }]}>
                            {todo.dueDate}
                          </Text>
                        )}
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          </View>
        </View>
      </BlurView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  blurOverlay: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 5, 10, 0.65)',
  },
  grid: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  leftColumn: {
    flex: 1.05,
    marginRight: 12,
    flexDirection: 'column',
  },
  rightColumn: {
    flex: 0.95,
  },
  timePanel: {
    flex: 1.1,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  timeHeader: {
    alignItems: 'flex-start',
  },
  ampmBadge: {
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  timeText: {
    fontSize: 72,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '500',
  },
  leftBottomRow: {
    flexDirection: 'row',
    flex: 1.05,
    alignItems: 'stretch',
  },
  mascotCard: {
    flex: 0.35,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  mascotPlaceholder: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  timerCard: {
    flex: 0.65,
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    justifyContent: 'space-between',
    minHeight: 150,
    alignItems: 'stretch',
  },
  timerContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  timerHeader: {
    gap: 6,
  },
  timerLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  timerMinutes: {
    fontSize: 45,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    height: 10,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    marginVertical: 12,
  },
  progressThumb: {
    height: '100%',
    borderRadius: 99,
  },
  timerHint: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  quoteCard: {
    flex: 0.4,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  quoteGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  quoteText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 30,
  },
  quoteSubText: {
    fontSize: 15,
    fontWeight: '500',
  },
  rightLower: {
    flex: 0.6,
    justifyContent: 'space-between',
  },
  infoCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  listDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginTop: 8,
  },
  listBody: {
    flex: 1,
    gap: 2,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  listSub: {
    fontSize: 13,
    fontWeight: '500',
  },
  todoBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  todoBadgeText: {
    fontSize: 20,
    lineHeight: 22,
  },
});


