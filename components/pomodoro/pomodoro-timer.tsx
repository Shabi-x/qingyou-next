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
  size?: number;
  strokeWidth?: number;
}

export function PomodoroTimer({
  size = 260,
  strokeWidth = 24,
}: PomodoroTimerProps) {
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const accentColor = useThemeColor({}, 'accent');
  
  const [minutes, setMinutes] = React.useState(POMODORO_CONFIG.DEFAULT_MINUTES);
  const [seconds, setSeconds] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [angle, setAngle] = React.useState(
    minutesToAngle(POMODORO_CONFIG.DEFAULT_MINUTES)
  );
  
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  
  const handleAngleChange = React.useCallback((newAngle: number) => {
    if (isRunning) return;
    setAngle(newAngle);
    const newMinutes = angleToMinutes(newAngle);
    setMinutes(newMinutes);
    setSeconds(0);
  }, [isRunning]);
  
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
        if (prevSeconds > 0) return prevSeconds - 1;
        else if (minutes > 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          return 59;
        } else {
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
  
  React.useEffect(() => {
    if (isRunning) {
      const totalSeconds = minutes * 60 + seconds;
      const totalMinutes = totalSeconds / 60;
      setAngle(minutesToAngle(totalMinutes));
    }
  }, [minutes, seconds, isRunning]);
  
  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };
  
  const totalSeconds = minutes * 60 + seconds;
  
  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <PomodoroCircle
          size={size}
          angle={angle}
          onAngleChange={handleAngleChange}
          strokeWidth={strokeWidth}
          disabled={isRunning}
        />
      </View>
      <Text style={[styles.timeText, { color: textColor }]}>
        {formatTime(totalSeconds)}
      </Text>
      {!isRunning && (
        <Text style={[styles.hintText, { color: textSecondaryColor }]}>
          拖动圆弧调整时间
        </Text>
      )}
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


