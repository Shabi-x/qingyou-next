/**
 * 番茄钟设置页面
 */

import { useThemeColor } from '@/hooks/use-theme-color';
import { PomodoroConfig, TimerMode } from '@/types/pomodoro';
import { angleToMinutes, minutesToAngle, POMODORO_CONFIG } from '@/utils/pomodoro';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PomodoroCircle } from './pomodoro-circle';

interface PomodoroSetupProps {
  onStart: (config: PomodoroConfig) => void;
}

export function PomodoroSetup({ onStart }: PomodoroSetupProps) {
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const accentColor = useThemeColor({}, 'accent');
  const backgroundColor = useThemeColor({}, 'background');
  
  const [mode, setMode] = React.useState<TimerMode>('countdown');
  const [minutes, setMinutes] = React.useState(POMODORO_CONFIG.DEFAULT_MINUTES);
  const [angle, setAngle] = React.useState(
    minutesToAngle(POMODORO_CONFIG.DEFAULT_MINUTES)
  );
  
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
  
  return (
    <View style={styles.container}>
      {/* 内容区域 */}
      <View style={styles.content}>
        {/* 模式选择 */}
        <View style={styles.modeSelector}>
        <Pressable
          style={[
            styles.modeButton,
            mode === 'countdown' && { backgroundColor: accentColor },
            mode !== 'countdown' && { 
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: textSecondaryColor 
            }
          ]}
          onPress={() => setMode('countdown')}
        >
          <Text
            style={[
              styles.modeButtonText,
              { color: mode === 'countdown' ? '#fff' : textColor }
            ]}
          >
            倒计时
          </Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.modeButton,
            mode === 'countup' && { backgroundColor: accentColor },
            mode !== 'countup' && { 
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: textSecondaryColor 
            }
          ]}
          onPress={() => setMode('countup')}
        >
          <Text
            style={[
              styles.modeButtonText,
              { color: mode === 'countup' ? '#fff' : textColor }
            ]}
          >
            正计时
          </Text>
        </Pressable>
      </View>
      
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  modeSelector: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 48,
  },
  modeButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    minWidth: 120,
    alignItems: 'center',
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
});
