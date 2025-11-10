import { useThemeColor } from '@/hooks/use-theme-color';
import {
  angleToMinutes,
  formatTime,
  minutesToAngle,
  POMODORO_CONFIG,
} from '@/utils/pomodoro';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PomodoroCircle } from './pomodoro-circle';

interface PomodoroTimerProps {
  /** 圆的大小 */
  size?: number;
  /** 圆弧宽度 */
  strokeWidth?: number;
}

export function PomodoroTimer({
  size = 260,
  strokeWidth = 24,
}: PomodoroTimerProps) {
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const accentColor = useThemeColor({}, 'accent');
  
  // 状态管理
  const [minutes, setMinutes] = React.useState(POMODORO_CONFIG.DEFAULT_MINUTES);
  const [seconds, setSeconds] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [angle, setAngle] = React.useState(
    minutesToAngle(POMODORO_CONFIG.DEFAULT_MINUTES)
  );
  
  // 定时器引用
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  
  // 处理角度变化
  const handleAngleChange = React.useCallback((newAngle: number) => {
    if (isRunning) return; // 运行时不允许调整
    
    // 圆弧直接使用原始角度（丝滑）
    setAngle(newAngle);
    
    // 时间显示按步长取整（跳跃）
    const newMinutes = angleToMinutes(newAngle);
    setMinutes(newMinutes);
    setSeconds(0);
  }, [isRunning]);
  
  // 倒计时逻辑
  React.useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    
    timerRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        } else if (minutes > 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          return 59;
        } else {
          // 倒计时结束
          setIsRunning(false);
          return 0;
        }
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, minutes]);
  
  // 更新圆弧角度（根据剩余时间）
  React.useEffect(() => {
    if (isRunning) {
      const totalSeconds = minutes * 60 + seconds;
      const totalMinutes = totalSeconds / 60;
      setAngle(minutesToAngle(totalMinutes));
    }
  }, [minutes, seconds, isRunning]);
  
  // 开始/暂停
  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };
  
  // 计算总秒数用于显示
  const totalSeconds = minutes * 60 + seconds;
  
  return (
    <View style={styles.container}>
      {/* 圆形计时器 */}
      <View style={styles.circleContainer}>
        <PomodoroCircle
          size={size}
          angle={angle}
          onAngleChange={handleAngleChange}
          strokeWidth={strokeWidth}
          disabled={isRunning}
        />
      </View>
      
      {/* 时间显示 */}
      <Text style={[styles.timeText, { color: textColor }]}>
        {formatTime(totalSeconds)}
      </Text>
      
      {/* 提示文字 */}
      {!isRunning && (
        <Text style={[styles.hintText, { color: textSecondaryColor }]}>
          拖动圆弧调整时间
        </Text>
      )}
      
      {/* 控制按钮 */}
      <View style={styles.controls}>
        <Pressable
          style={[styles.button, { backgroundColor: accentColor }]}
          onPress={toggleTimer}
        >
          <Text style={styles.buttonText}>
            {isRunning ? '暂停' : '开始'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  timeText: {
    fontSize: 64,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    marginBottom: 24,
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  button: {
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 28,
    minWidth: 160,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
