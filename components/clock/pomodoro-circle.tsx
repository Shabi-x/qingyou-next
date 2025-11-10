import { useThemeColor } from '@/hooks/use-theme-color';
import { getAngleFromPoint, getPointOnCircle } from '@/utils/pomodoro';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

interface PomodoroCircleProps {
  /** 圆的大小 */
  size: number;
  /** 当前角度（0-360） */
  angle: number;
  /** 角度变化回调 */
  onAngleChange: (angle: number) => void;
  /** 圆弧宽度 */
  strokeWidth?: number;
  /** 是否禁用拖拽 */
  disabled?: boolean;
}

export function PomodoroCircle({
  size,
  angle,
  onAngleChange,
  strokeWidth = 20,
  disabled = false,
}: PomodoroCircleProps) {
  const accentColor = useThemeColor({}, 'accent');
  
  // 圆的中心点和半径
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  
  // 当前角度状态
  const [currentAngle, setCurrentAngle] = React.useState(angle);
  
  // 用于手势的共享值 - 存储累积角度
  const gestureAngle = useSharedValue(angle);
  // 存储上一次的原始角度（用于计算增量）
  const lastRawAngle = useSharedValue(0);
  
  // 更新角度
  React.useEffect(() => {
    setCurrentAngle(angle);
    gestureAngle.value = angle;
  }, [angle]);
  
  /**
   * 根据角度生成 SVG 路径
   */
  const createArcPath = (sweepAngle: number): string => {
    // 设置最小显示角度为 10 度
    const MIN_DISPLAY_ANGLE = 10;
    const displayAngle = Math.max(MIN_DISPLAY_ANGLE, sweepAngle);
    
    // 如果角度是 360 度，绘制完整的圆
    if (displayAngle >= 360) {
      // 使用两个半圆弧来绘制完整的圆
      const startPoint = getPointOnCircle(center, center, radius, 0);
      const midPoint = getPointOnCircle(center, center, radius, 180);
      
      return `
        M ${startPoint.x} ${startPoint.y}
        A ${radius} ${radius} 0 1 1 ${midPoint.x} ${midPoint.y}
        A ${radius} ${radius} 0 1 1 ${startPoint.x} ${startPoint.y}
      `;
    }
    
    // 起始点（正上方，0度）
    const startPoint = getPointOnCircle(center, center, radius, 0);
    
    // 结束点
    const endPoint = getPointOnCircle(center, center, radius, displayAngle);
    
    // 大弧标志（角度大于180度时为1）
    const largeArcFlag = displayAngle > 180 ? 1 : 0;
    
    // 构建路径
    return `
      M ${startPoint.x} ${startPoint.y}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}
    `;
  };
  
  // 处理角度更新的回调
  const handleAngleUpdate = React.useCallback((newAngle: number) => {
    setCurrentAngle(newAngle);
    onAngleChange(newAngle);
  }, [onAngleChange]);
  
  // 拖拽手势
  const panGesture = Gesture.Pan()
    .enabled(!disabled) // 根据 disabled 状态启用/禁用手势
    .onBegin((event) => {
      'worklet';
      // 记录开始时的累积角度和原始角度
      gestureAngle.value = currentAngle;
      const touchX = event.x;
      const touchY = event.y;
      lastRawAngle.value = getAngleFromPoint(center, center, touchX, touchY);
    })
    .onUpdate((event) => {
      'worklet';
      // 计算触摸点相对于圆心的角度
      const touchX = event.x;
      const touchY = event.y;
      
      const rawAngle = getAngleFromPoint(center, center, touchX, touchY);
      const prevRawAngle = lastRawAngle.value;
      
      // 计算角度增量（考虑跨越 0/360 边界的情况）
      let delta = rawAngle - prevRawAngle;
      
      // 如果增量的绝对值大于 180，说明跨越了边界
      if (delta > 180) {
        delta = delta - 360;
      } else if (delta < -180) {
        delta = delta + 360;
      }
      
      // 降低灵敏度：将增量缩小到 75%
      delta = delta * 0.75;
      
      // 计算新的累积角度
      let newAngle = gestureAngle.value + delta;
      
      // 严格限制在 0-360 范围内
      newAngle = Math.max(0, Math.min(360, newAngle));
      
      // 更新共享值
      gestureAngle.value = newAngle;
      lastRawAngle.value = rawAngle;
      
      // 调用回调
      runOnJS(handleAngleUpdate)(newAngle);
    });
  
  const arcPath = createArcPath(currentAngle);
  
  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          {/* 背景圆环 */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#E8E8ED"
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.3}
          />
          
          {/* 进度圆弧 */}
          {arcPath && (
            <Path
              d={arcPath}
              stroke={accentColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
            />
          )}
        </Svg>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
