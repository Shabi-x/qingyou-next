/**
 * 滑动取消按钮组件
 * 从右向左滑动，手柄移动时右侧轨道延展，超过50%变红色
 */
import { shouldTriggerCancel } from '@/utils/slide-to-cancel';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  interpolateColor,
} from 'react-native-reanimated';

interface SlideToCancelButtonProps {
  /** 取消回调 */
  onCancel: () => void;
  /** 最大滑动距离，默认为300 */
  maxDistance?: number;
  /** 触发取消的阈值，默认为1（拉满） */
  cancelThreshold?: number;
  /** 颜色切换阈值，默认为0.5（50%） */
  colorThreshold?: number;
  /** 基础颜色（进度<50%） */
  baseColor?: string;
  /** 危险颜色（进度>=50%） */
  dangerColor?: string;
}

export function SlideToCancelButton({
  onCancel,
  maxDistance: maxDistanceProp,
  cancelThreshold = 1,
  colorThreshold = 0.5,
  baseColor = '#666666',
  dangerColor = '#FF4444',
}: SlideToCancelButtonProps) {
  const slideProgress = useSharedValue(0);
  const [containerWidth, setContainerWidth] = React.useState(0);

  // 计算实际的最大滑动距离
  // 如果提供了 maxDistanceProp 则使用它，否则根据容器宽度计算
  // 手柄宽度80px + 左右边距各10px = 100px，所以可滑动距离 = 容器宽度 - 100px
  const maxDistance = maxDistanceProp || Math.max(0, containerWidth - 100);
  
  // 将关键值转换为 shared values，确保在 worklet 中可访问
  const maxDistanceShared = useSharedValue(maxDistance);
  const colorThresholdShared = useSharedValue(colorThreshold);
  
  // 当值改变时更新 shared values
  React.useEffect(() => {
    maxDistanceShared.value = maxDistance;
    colorThresholdShared.value = colorThreshold;
  }, [maxDistance, colorThreshold, maxDistanceShared, colorThresholdShared]);

  const resetProgress = React.useCallback(() => {
    slideProgress.value = 0;
  }, [slideProgress]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      // 从右向左滑动，translationX 为负值
      if (maxDistanceShared.value > 0) {
        const progress = Math.max(0, Math.min(1, Math.abs(event.translationX) / maxDistanceShared.value));
        slideProgress.value = progress;
      }
    })
    .onEnd(() => {
      'worklet';
      if (slideProgress.value >= cancelThreshold) {
        runOnJS(onCancel)();
      } else {
        runOnJS(resetProgress)();
      }
    });

  // 手柄位置和背景色动画样式 - 从右向左移动，颜色跟随轨道
  const handleAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const translateX = -slideProgress.value * maxDistanceShared.value;
    
    // 手柄背景色跟随轨道颜色
    let handleBgColor: string;
    if (slideProgress.value < colorThresholdShared.value) {
      handleBgColor = '#666666'; // 与轨道基础色一致
    } else {
      const localProgress = (slideProgress.value - colorThresholdShared.value) / (1 - colorThresholdShared.value);
      handleBgColor = interpolateColor(
        localProgress,
        [0, 1],
        ['#666666', '#FF4444'] // 从灰色渐变到红色
      );
    }
    
    return {
      transform: [{ translateX }],
      backgroundColor: handleBgColor,
    };
  }, []);

  // 轨道宽度和颜色动画样式 - 从右侧延展到手柄位置
  // 轨道宽度 = 手柄移动距离 + 手柄宽度 + 右侧边距
  const trackAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    // 轨道需要覆盖从手柄当前位置到右侧边缘的区域
    const handleOffset = slideProgress.value * maxDistanceShared.value;
    // 手柄宽度80 + 右边距10 = 90，再加上滑动距离
    const widthPx = handleOffset + 90;
    
    // 使用条件判断替代 interpolateColor，避免访问外部变量
    let backgroundColor: string;
    if (slideProgress.value < colorThresholdShared.value) {
      backgroundColor = '#666666'; // baseColor
    } else {
      // 从 colorThreshold 到 1.0 之间进行颜色插值
      const localProgress = (slideProgress.value - colorThresholdShared.value) / (1 - colorThresholdShared.value);
      backgroundColor = interpolateColor(
        localProgress,
        [0, 1],
        ['#666666', '#FF4444'] // baseColor -> dangerColor
      );
    }
    
    return {
      width: widthPx,
      backgroundColor,
    };
  }, []);

  // 底层黑色文案动画样式 - 进度超过50%时消失
  const bottomTextAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: slideProgress.value >= 0.5 ? 0 : 1,
    };
  }, []);

  // 上层白色文案动画样式 - 进度超过50%时出现
  const topTextAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: slideProgress.value >= 0.5 ? 1 : 0,
    };
  }, []);

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
      }}
    >
      {/* 背景轨道 */}
      <View style={styles.track}>
        {/* 底层黑色文案 - 在背景轨道上，居中显示 */}
        <Animated.View style={[styles.bottomTextContainer, bottomTextAnimatedStyle]}>
          <Text style={styles.bottomText}>向左滑动放弃专注</Text>
        </Animated.View>

        {/* 彩色轨道 - 从右侧延展 */}
        <Animated.View
          style={[
            styles.activeTrack,
            trackAnimatedStyle,
          ]}
        >
          {/* 上层白色文案 - 在彩色轨道内居中 */}
          <Animated.View style={[styles.topTextContainer, topTextAnimatedStyle]}>
            <Text style={styles.topText}>放弃</Text>
          </Animated.View>
        </Animated.View>

        {/* 手柄 - 独立定位，随滑动移动，颜色跟随轨道 */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.handle,
              handleAnimatedStyle,
            ]}
          >
            <Text style={styles.handleIcon}>🐟</Text>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    width: '100%',
    height: 60,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
    position: 'relative',
    overflow: 'hidden',
  },
  activeTrack: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 20,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 底层黑色文案容器 - 在灰色背景轨道上居中
  bottomTextContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  bottomText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  // 上层白色文案容器 - 在彩色轨道内居中
  topTextContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  handle: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 80,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3, // 确保手柄在最上层
  },
  handleIcon: {
    fontSize: 24,
  },
});
