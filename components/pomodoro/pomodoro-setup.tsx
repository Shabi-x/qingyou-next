/**
 * 番茄钟设置页面（已迁移到 pomodoro 文件夹）
 */
import { useThemeColor } from '@/hooks/use-theme-color';
import { PomodoroConfig, TimerMode } from '@/types/pomodoro';
import { angleToMinutes, minutesToAngle, POMODORO_CONFIG } from '@/utils/pomodoro';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChartPieIcon } from './chart-pie-icon';
import { PomodoroCircle } from './pomodoro-circle';
import { PomodoroDetail } from './pomodoro-detail';

interface PomodoroSetupProps {
  onStart: (config: PomodoroConfig) => void;
}

export function PomodoroSetup({ onStart }: PomodoroSetupProps) {
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const accentColor = useThemeColor({}, 'accent');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#2F2F33' }, 'card');
  const switchBgColor = useThemeColor({ light: '#ECECF0', dark: '#38383A' }, 'backgroundSecondary');
  const sliderBorderColor = useThemeColor({ light: '#DADAE0', dark: '#6A6A70' }, 'cardBorder');
  
  const [mode, setMode] = React.useState<TimerMode>('countdown');
  const [minutes, setMinutes] = React.useState(POMODORO_CONFIG.DEFAULT_MINUTES);
  const [angle, setAngle] = React.useState(
    minutesToAngle(POMODORO_CONFIG.DEFAULT_MINUTES)
  );
  const slidePosition = React.useRef(new Animated.Value(0)).current;
  const [showDetail, setShowDetail] = React.useState(false);
  const insets = useSafeAreaInsets();
  
  const handleAngleChange = React.useCallback((newAngle: number) => {
    setAngle(newAngle);
    const newMinutes = angleToMinutes(newAngle);
    setMinutes(newMinutes);
  }, []);
  
  const handleStart = () => {
    const startMinutes = mode === 'countup' ? 0 : minutes;
    onStart({ mode, minutes: startMinutes });
  };
  
  React.useEffect(() => {
    Animated.timing(slidePosition, {
      toValue: mode === 'countdown' ? 0 : 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [mode, slidePosition]);
  
  const sliderTranslateStyle = {
    transform: [
      {
        translateX: slidePosition.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 32],
        }),
      },
    ],
  } as const;
  
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.topRow,
          {
            paddingTop: insets.top + 8,
            paddingLeft: 12 + insets.left,
            paddingRight: 12 + insets.right,
          },
        ]}
      >
        <TouchableOpacity onPress={() => setShowDetail(true)} activeOpacity={0.8} style={styles.iconButton}>
          <ChartPieIcon size={24} color={textColor} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <TouchableOpacity
            style={[
              styles.switchContainer,
              { backgroundColor: switchBgColor }
            ]}
            activeOpacity={0.8}
            onPress={() => setMode((prev) => (prev === 'countdown' ? 'countup' : 'countdown'))}
          >
            <Animated.View
              style={[
                styles.switchSlider,
                { backgroundColor: cardBackgroundColor, borderColor: sliderBorderColor, borderWidth: 1 },
                sliderTranslateStyle,
              ]}
            />
            <MaterialIcons
              name="rotate-left"
              size={22}
              color={mode === 'countdown' ? accentColor : textSecondaryColor}
              style={styles.iconLeft}
            />
            <View style={styles.switchTextContainer}>
              <Text style={[styles.switchText, { color: textColor }]}>
                {mode === 'countdown' ? '倒计时' : '正计时'}
              </Text>
            </View>
            <MaterialIcons
              name="rotate-right"
              size={22}
              color={mode === 'countup' ? accentColor : textSecondaryColor}
              style={styles.iconRight}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.8}
          onPress={() => router.push('/pomodoro-horizontal')}
        >
          <MaterialCommunityIcons name="phone-rotate-landscape" size={24} color={textColor} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {mode === 'countdown' && (
          <>
            <View style={styles.circleContainer}>
              <PomodoroCircle
                size={260}
                angle={angle}
                onAngleChange={handleAngleChange}
                strokeWidth={24}
              />
            </View>
            <View style={styles.timeDisplayContainer}>
              <Text style={[styles.timeText, { color: textColor }]}>
                {String(minutes).padStart(2, '0')}:00
              </Text>
            </View>
            <Text style={[styles.hintText, { color: textSecondaryColor }]}>
              拖动圆弧调整时间
            </Text>
          </>
        )}
        {mode === 'countup' && (
          <>
            <View style={styles.circleContainer} />
            <View style={styles.timeDisplayContainer}>
              <Text style={[styles.timeText, { color: textColor }]}>
                00:00
              </Text>
            </View>
            <Text style={[styles.hintText, { color: textSecondaryColor }]}>
              从零开始正向计时
            </Text>
          </>
        )}
      </View>
      
      <View style={styles.buttonArea}>
        <Pressable
          style={[styles.startButton, { backgroundColor: accentColor }]}
          onPress={handleStart}
        >
          <Text style={styles.startButtonText}>开始专注</Text>
        </Pressable>
      </View>
      
      <PomodoroDetail visible={showDetail} onClose={() => setShowDetail(false)} title="专注详情">
        <View style={styles.detailPlaceholder}>
          <Text style={{ color: textSecondaryColor }}>这里展示专注的统计或说明内容。</Text>
        </View>
      </PomodoroDetail>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 12,
    marginBottom: 16,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  buttonArea: {
    paddingHorizontal: 32,
    paddingBottom: 148,
    alignItems: 'center',
  },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 32 },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 130,
    height: 48,
    borderRadius: 24,
    padding: 4,
    position: 'relative',
    gap: 4,
    marginBottom: 0,
  },
  switchSlider: {
    position: 'absolute',
    left: 4,
    width: 90,
    height: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  iconLeft: { zIndex: 2, paddingLeft: 6 },
  iconRight: { zIndex: 2, paddingRight: 6 },
  switchTextContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    paddingHorizontal: 8,
  },
  switchText: { fontSize: 15, fontWeight: '600', letterSpacing: -0.3 },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    minHeight: 260,
  },
  timeDisplayContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  timeText: { fontSize: 72, fontWeight: '700', fontVariant: ['tabular-nums'] },
  hintText: { fontSize: 14, marginBottom: 32 },
  startButton: {
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 20,
    minWidth: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
  detailPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});



