/**
 * 番茄钟设置页面
 */

import { useThemeColor } from '@/hooks/use-theme-color';
import { PomodoroConfig, TimerMode } from '@/types/pomodoro';
import { angleToMinutes, minutesToAngle, POMODORO_CONFIG } from '@/utils/pomodoro';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
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
  // 提高与页面背景的对比度
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
  
  // 处理角度变化
  const handleAngleChange = React.useCallback((newAngle: number) => {
    setAngle(newAngle);
    const newMinutes = angleToMinutes(newAngle);
    setMinutes(newMinutes);
  }, []);
  
  // 开始专注
  const handleStart = () => {
    // 正计时模式固定从 0 分钟开始
    const startMinutes = mode === 'countup' ? 0 : minutes;
    onStart({ mode, minutes: startMinutes });
  };
  
  // 切换动画
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
          outputRange: [0, 32], // 容器 130、滑块 90、内边距 4 => 130 - 90 - 8 = 32
        }),
      },
    ],
  } as const;
  
  return (
    <View style={styles.container}>
      {/* 顶部行：图标 + 开关 垂直对齐 */}
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
          <ChartPieIcon size={28} color={textColor} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          {/* 模式选择（开关） */}
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
            
            {/* 左侧：倒计时（逆时针） */}
            <MaterialIcons
              name="rotate-left"
              size={22}
              color={mode === 'countdown' ? accentColor : textSecondaryColor}
              style={styles.iconLeft}
            />
            {/* 文案 */}
            <View style={styles.switchTextContainer}>
              <Text style={[styles.switchText, { color: textColor }]}>
                {mode === 'countdown' ? '倒计时' : '正计时'}
              </Text>
            </View>
            {/* 右侧：正计时（顺时针） */}
            <MaterialIcons
              name="rotate-right"
              size={22}
              color={mode === 'countup' ? accentColor : textSecondaryColor}
              style={styles.iconRight}
            />
          </TouchableOpacity>
        </View>
        {/* 占位使居中真实居中 */}
        <View style={styles.iconPlaceholder} />
      </View>
      
      {/* 内容区域 */}
      <View style={styles.content}>
        
      
      {/* 倒计时模式：圆形时间选择器 */}
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
          
          {/* 时间显示 */}
          <View style={styles.timeDisplayContainer}>
            <Text style={[styles.timeText, { color: textColor }]}>
              {String(minutes).padStart(2, '0')}:00
            </Text>
          </View>
          
          {/* 提示文字 */}
          <Text style={[styles.hintText, { color: textSecondaryColor }]}>
            拖动圆弧调整时间
          </Text>
        </>
      )}
      
      {/* 正计时模式：显示起始时间 */}
      {mode === 'countup' && (
        <>
          <View style={styles.circleContainer}>
            {/* 占位，保持布局一致 */}
          </View>
          
          {/* 时间显示 */}
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
      
      {/* 按钮区域 */}
      <View style={styles.buttonArea}>
        <Pressable
          style={[styles.startButton, { backgroundColor: accentColor }]}
          onPress={handleStart}
        >
          <Text style={styles.startButtonText}>开始专注</Text>
        </Pressable>
      </View>
      
      {/* 详情半屏 */}
      <PomodoroDetail visible={showDetail} onClose={() => setShowDetail(false)} title="专注详情">
        {/* 这里先放占位内容，后续可以填充统计、说明等 */}
        <View style={styles.detailPlaceholder}>
          <Text style={{ color: textSecondaryColor }}>这里展示专注的统计或说明内容。</Text>
        </View>
      </PomodoroDetail>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 36,
    height: 36,
  },
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
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 32,
  },
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
  iconLeft: {
    zIndex: 2,
    paddingLeft: 6,
  },
  iconRight: {
    zIndex: 2,
    paddingRight: 6,
  },
  switchTextContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    paddingHorizontal: 8,
  },
  switchText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    minHeight: 260,
  },
  timeDisplayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  timeText: {
    fontSize: 72,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  timeUnit: {
    fontSize: 18,
    marginTop: 4,
  },
  hintText: {
    fontSize: 14,
    marginBottom: 32,
  },
  startButton: {
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 20,
    minWidth: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  detailPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
