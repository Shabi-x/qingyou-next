import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const BUTTON_SIZE = 56;
const EDGE_MARGIN = 20; // 距离边缘的距离
const TOP_MARGIN = 100; // 距离顶部的最小距离
const BOTTOM_RESERVED = 130; // 底部预留空间（tab 栏高度 + 额外间距）

// 默认位置
const DEFAULT_X = SCREEN_WIDTH - BUTTON_SIZE - EDGE_MARGIN; // 右边
const DEFAULT_Y = 0; // 通过外部 style 的 bottom 控制垂直位置

interface UseDraggableButtonOptions {
  onPress?: () => void;
}

/**
 * 可拖动按钮的 Hook
 * 提供拖动、自动贴边、点击等功能
 */
export function useDraggableButton({ onPress }: UseDraggableButtonOptions = {}) {
  // 拖动状态
  const translateX = useSharedValue(DEFAULT_X);
  const translateY = useSharedValue(DEFAULT_Y);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  // 每次组件渲染时，重置到默认位置
  useEffect(() => {
    translateX.value = DEFAULT_X;
    translateY.value = DEFAULT_Y;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 拖动手势
  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      // 更新 X 坐标（无限制，贴边时会处理）
      translateX.value = startX.value + event.translationX;
      
      // 更新 Y 坐标，添加上下边界限制
      const newY = startY.value + event.translationY;
      // minY: 向上移动的最大距离（负值），确保不会移出顶部
      const minY = -(SCREEN_HEIGHT - BOTTOM_RESERVED - TOP_MARGIN - BUTTON_SIZE);
      // maxY: 向下移动的最大距离（正值），0 表示不能向下移动
      const maxY = 0;
      
      // 限制在合理范围内
      translateY.value = Math.max(minY, Math.min(maxY, newY));
    })
    .onEnd(() => {
      isDragging.value = false;
      
      // 判断靠近哪一边，自动贴边
      const centerX = translateX.value + BUTTON_SIZE / 2;
      const shouldSnapToLeft = centerX < SCREEN_WIDTH / 2;
      
      if (shouldSnapToLeft) {
        // 贴左边
        translateX.value = withTiming(EDGE_MARGIN, {
          duration: 200,
        });
      } else {
        // 贴右边
        translateX.value = withTiming(SCREEN_WIDTH - BUTTON_SIZE - EDGE_MARGIN, {
          duration: 200,
        });
      }
    });

  // 点击手势
  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      if (!isDragging.value && onPress) {
        runOnJS(onPress)();
      }
    });

  // 组合手势：同时识别拖动和点击
  const composedGesture = Gesture.Exclusive(panGesture, tapGesture);

  // 按钮动画样式
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return {
    gesture: composedGesture,
    animatedStyle: animatedButtonStyle,
  };
}

