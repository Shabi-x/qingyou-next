import { useThemeColor } from '@/hooks/use-theme-color';
import { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const PANEL_HEIGHT = SCREEN_HEIGHT * 0.6; // 半屏高度

interface CourseDetailPanelProps {
  visible: boolean;
  onClose: () => void;
  courseId?: string;
}

export function CourseDetailPanel({ visible, onClose, courseId }: CourseDetailPanelProps) {
  const backgroundColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const overlayOpacity = useSharedValue(0);
  const translateY = useSharedValue(PANEL_HEIGHT);

  useEffect(() => {
    if (visible) {
      overlayOpacity.value = withTiming(1, { duration: 250 });
      translateY.value = withSpring(0, {
        damping: 35,
        stiffness: 200,
      });
    } else {
      overlayOpacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(PANEL_HEIGHT, { duration: 250 });
    }
  }, [overlayOpacity, translateY, visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        translateY.value = withTiming(PANEL_HEIGHT, { duration: 250 });
        overlayOpacity.value = withTiming(0, { duration: 200 });
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, {
          damping: 35,
          stiffness: 200,
        });
      }
    });

  if (!visible && overlayOpacity.value === 0) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents={visible ? 'auto' : 'none'}>
      {/* 背景遮罩 */}
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Pressable style={styles.overlayPressable} onPress={onClose} />
      </Animated.View>

      {/* 面板内容 */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.panel, { backgroundColor }, panelStyle]}>
          {/* 拖拽手柄 */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* 内容区域（待填充） */}
          <View style={styles.content}>
            <Text style={[styles.placeholder, { color: textColor }]}>
              课程详情面板 (ID: {courseId})
            </Text>
            <Text style={[styles.placeholderSub, { color: textColor, opacity: 0.5 }]}>
              内容待填充...
            </Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  overlayPressable: {
    flex: 1,
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: PANEL_HEIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#C7C7CC',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  placeholderSub: {
    fontSize: 15,
  },
});

