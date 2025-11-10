/**
 * 番茄钟专注页面
 */

import { CANCEL_COUNTDOWN_SECONDS } from '@/constants/pomodoro';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FocusState, PomodoroConfig } from '@/types/pomodoro';
import { formatTime } from '@/utils/pomodoro';
import React from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { InspiringSlogan } from './inspiring-slogan';

interface PomodoroFocusProps {
  config: PomodoroConfig;
  onCancel: () => void;
  onComplete: () => void;
  onGiveUp: () => void;
  onRestart: () => void;
}

export function PomodoroFocus({
  config,
  onCancel,
  onComplete,
  onGiveUp,
  onRestart,
}: PomodoroFocusProps) {
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const accentColor = useThemeColor({}, 'accent');
  
  const [focusState, setFocusState] = React.useState<FocusState>('canceling');
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);
  const [cancelCountdown, setCancelCountdown] = React.useState(CANCEL_COUNTDOWN_SECONDS);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const slideProgress = useSharedValue(0);
  const slideAnimation = React.useRef(new Animated.Value(0)).current;
  
  // 计算剩余时间（倒计时模式）
  const remainingSeconds = config.mode === 'countdown'
    ? config.minutes * 60 - elapsedSeconds
    : elapsedSeconds;
  
  // 计算显示的时间
  const displaySeconds = config.mode === 'countdown'
    ? Math.max(0, remainingSeconds)
    : elapsedSeconds;
  
  // 取消倒计时
  React.useEffect(() => {
    if (focusState !== 'canceling') return;
    
    const interval = setInterval(() => {
      setCancelCountdown((prev) => {
        if (prev <= 1) {
          setFocusState('focusing');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [focusState]);
  
  // 主计时器（包括取消倒计时期间）
  React.useEffect(() => {
    if (focusState !== 'focusing' && focusState !== 'canceling') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        
        // 倒计时模式：时间到了自动完成
        if (config.mode === 'countdown' && next >= config.minutes * 60) {
          setFocusState('completed');
          onComplete();
          return prev;
        }
        
        return next;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [focusState, config.mode, config.minutes, onComplete]);
  
  // 处理取消
  const handleCancel = () => {
    if (focusState === 'canceling') {
      onCancel();
    }
  };
  
  // 处理暂停/继续
  const handlePauseResume = () => {
    if (focusState === 'focusing') {
      setFocusState('paused');
    } else if (focusState === 'paused') {
      setFocusState('focusing');
    }
  };
  
  // 处理结束（正计时模式）
  const handleEnd = () => {
    setShowConfirmDialog(true);
  };
  
  // 确认结束
  const confirmEnd = () => {
    setShowConfirmDialog(false);
    setFocusState('abandoned');
  };
  
  // 更新动画值
  const updateAnimation = React.useCallback((progress: number) => {
    Animated.timing(slideAnimation, {
      toValue: progress,
      duration: 0,
      useNativeDriver: false,
    }).start();
  }, [slideAnimation]);
  
  // 回弹动画
  const springBack = React.useCallback(() => {
    Animated.spring(slideAnimation, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  }, [slideAnimation]);
  
  // 处理放弃
  const handleGiveUp = () => {
    setFocusState('abandoned');
  };
  
  // 左滑手势（倒计时模式放弃）
  const panGesture = Gesture.Pan()
    .enabled(config.mode === 'countdown' && focusState === 'focusing')
    .onUpdate((event) => {
      'worklet';
      // 只允许向左滑动
      const progress = Math.max(0, Math.min(1, -event.translationX / 300));
      slideProgress.value = progress;
      runOnJS(updateAnimation)(progress);
    })
    .onEnd(() => {
      'worklet';
      // 滑动超过 80% 才算放弃
      if (slideProgress.value >= 0.8) {
        runOnJS(handleGiveUp)();
      } else {
        // 回弹
        runOnJS(springBack)();
        slideProgress.value = 0;
      }
    });
  
  // 滑动提示的插值
  const slideInterpolate = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -300],
  });
  
  const slideOpacity = slideAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 1],
  });
  
  return (
    <View style={styles.container}>
      {/* 内容区域 */}
      <View style={styles.content}>
        {/* 装饰图片区域 */}
        <View style={styles.imageContainer}>
        <Text style={styles.imagePlaceholder}>🐱</Text>
      </View>
      
      {/* 时间显示 */}
      <Text style={[styles.timeText, { color: textColor }]}>
        {formatTime(displaySeconds)}
      </Text>
      
      {/* 激励标语 */}
      <InspiringSlogan focusState={focusState} mode={config.mode} />
      </View>
      
      {/* 按钮区域 */}
      <View style={styles.buttonArea}>
        {/* 取消按钮（前10秒） */}
        {focusState === 'canceling' && (
          <>
            <Pressable
              style={[styles.button, styles.cancelButton, { backgroundColor: textSecondaryColor }]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>取消（{cancelCountdown}s）</Text>
            </Pressable>
            
            <Text style={[styles.cancelHintText, { color: textSecondaryColor }]}>
              {cancelCountdown} 秒之内可以取消任务
            </Text>
          </>
        )}
        
        {/* 倒计时模式：左滑放弃 */}
        {config.mode === 'countdown' && focusState === 'focusing' && (
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                styles.slideButton,
                {
                  backgroundColor: accentColor,
                  transform: [{ translateX: slideInterpolate }],
                  opacity: slideOpacity,
                },
              ]}
            >
              <Text style={styles.slideButtonText}>向右滑动放弃专注</Text>
              <Text style={styles.slideIcon}>🐟</Text>
            </Animated.View>
          </GestureDetector>
        )}
        
        {/* 正计时模式：暂停/继续/结束 */}
        {config.mode === 'countup' && focusState === 'focusing' && (
          <Pressable
            style={[styles.button, { backgroundColor: accentColor }]}
            onPress={handlePauseResume}
          >
            <Text style={styles.buttonText}>暂停</Text>
          </Pressable>
        )}
        
        {config.mode === 'countup' && focusState === 'paused' && (
          <View style={styles.pausedButtons}>
            <Pressable
              style={[styles.button, styles.shortButton, { backgroundColor: textSecondaryColor }]}
              onPress={handleEnd}
            >
              <Text style={styles.buttonText}>结束</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.longButton, { backgroundColor: accentColor }]}
              onPress={handlePauseResume}
            >
              <Text style={styles.buttonText}>继续</Text>
            </Pressable>
          </View>
        )}
        
        {/* 完成/放弃状态：返回和重新开始按钮 */}
        {(focusState === 'completed' || focusState === 'abandoned') && (
          <View style={styles.pausedButtons}>
            <Pressable
              style={[styles.button, styles.shortButton, { backgroundColor: textSecondaryColor }]}
              onPress={onComplete}
            >
              <Text style={styles.buttonText}>返回</Text>
            </Pressable>
            
            <Pressable
              style={[styles.button, styles.longButton, { backgroundColor: accentColor }]}
              onPress={onRestart}
            >
              <Text style={styles.buttonText}>重新开始</Text>
            </Pressable>
          </View>
        )}
      </View>
      
      {/* 确认对话框 */}
      <Modal
        visible={showConfirmDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmDialog(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.dialog, { backgroundColor: '#fff' }]}>
            <Text style={[styles.dialogTitle, { color: '#000' }]}>
              温馨提示
            </Text>
            
            <Text style={[styles.dialogMessage, { color: '#666' }]}>
              专注时长不足 5 分钟，真的要提前放弃吗？
            </Text>
            
            <View style={styles.dialogButtons}>
              <Pressable
                style={[styles.dialogButton, { backgroundColor: accentColor }]}
                onPress={() => setShowConfirmDialog(false)}
              >
                <Text style={[styles.dialogButtonText, { color: '#fff' }]}>
                  继续坚持
                </Text>
              </Pressable>
              
              <Pressable
                style={[styles.dialogButton, { backgroundColor: textSecondaryColor }]}
                onPress={confirmEnd}
              >
                <Text style={[styles.dialogButtonText, { color: '#fff' }]}>
                  提前结束
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  imageContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  imagePlaceholder: {
    fontSize: 120,
  },
  timeText: {
    fontSize: 72,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  summaryTime: {
    fontSize: 48,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginBottom: 16,
  },
  hintText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 32,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 20,
    minWidth: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortButton: {
    minWidth: 60,
    flex: 1,
    paddingHorizontal: 16,
  },
  longButton: {
    flex: 2.5,
    paddingHorizontal: 24,
  },
  cancelButton: {
    width: 180,
  },
  cancelHintText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  slideButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  slideButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  slideIcon: {
    fontSize: 24,
  },
  pausedButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  dialogMessage: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  dialogButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  dialogButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  dialogButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
