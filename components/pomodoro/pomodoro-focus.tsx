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
import { InspiringSlogan } from './inspiring-slogan';
import { SlideToCancelButton } from './slide-to-cancel-button';

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
  
  const remainingSeconds = config.mode === 'countdown'
    ? config.minutes * 60 - elapsedSeconds
    : elapsedSeconds;
  
  const displaySeconds = config.mode === 'countdown'
    ? Math.max(0, remainingSeconds)
    : elapsedSeconds;
  
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
  
  const handleCancel = () => {
    if (focusState === 'canceling') {
      onCancel();
    }
  };
  
  const handlePauseResume = () => {
    if (focusState === 'focusing') {
      setFocusState('paused');
    } else if (focusState === 'paused') {
      setFocusState('focusing');
    }
  };
  
  const handleEnd = () => {
    setShowConfirmDialog(true);
  };
  
  const confirmEnd = () => {
    setShowConfirmDialog(false);
    setFocusState('abandoned');
  };
  
  const handleGiveUp = () => {
    setFocusState('abandoned');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
        <Text style={styles.imagePlaceholder}>🐱</Text>
      </View>
      <Text style={[styles.timeText, { color: textColor }]}>
        {formatTime(displaySeconds)}
      </Text>
      <InspiringSlogan focusState={focusState} mode={config.mode} />
      </View>
      
      <View style={styles.buttonArea}>
        {focusState === 'canceling' && (
          <>
            <Pressable
              style={[styles.button, styles.cancelButton, { backgroundColor: textSecondaryColor }]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>取消（{cancelCountdown}s）</Text>
            </Pressable>
          </>
        )}
        
        {config.mode === 'countdown' && focusState === 'focusing' && (
          <SlideToCancelButton
            onCancel={handleGiveUp}
            cancelThreshold={1}
            colorThreshold={0.5}
            baseColor="#666666"
            dangerColor="#FF4444"
          />
        )}
        
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
  container: { flex: 1 },
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
  imagePlaceholder: { fontSize: 120 },
  timeText: {
    fontSize: 72,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginBottom: 16,
  },
  summaryText: { fontSize: 16, textAlign: 'center', marginBottom: 12 },
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
  buttonContainer: { width: '100%', alignItems: 'center' },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 20,
    minWidth: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortButton: { minWidth: 60, flex: 1, paddingHorizontal: 16 },
  longButton: { flex: 2.5, paddingHorizontal: 24 },
  cancelButton: { width: 180 },
  cancelHintText: { fontSize: 12, textAlign: 'center', marginTop: 12 },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  pausedButtons: { flexDirection: 'row', gap: 16 },
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
  dialogTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  dialogMessage: { fontSize: 16, lineHeight: 24, marginBottom: 24 },
  dialogButtons: { flexDirection: 'row', gap: 12 },
  dialogButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  dialogButtonText: { fontSize: 16, fontWeight: '600' },
});



