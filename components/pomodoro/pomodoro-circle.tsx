import { useThemeColor } from '@/hooks/use-theme-color';
import { getAngleFromPoint, getPointOnCircle } from '@/utils/pomodoro';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

interface PomodoroCircleProps {
  size: number;
  angle: number;
  onAngleChange: (angle: number) => void;
  strokeWidth?: number;
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
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const [currentAngle, setCurrentAngle] = React.useState(angle);
  const gestureAngle = useSharedValue(angle);
  const lastRawAngle = useSharedValue(0);

  React.useEffect(() => {
    setCurrentAngle(angle);
    gestureAngle.value = angle;
  }, [angle]);

  const createArcPath = (sweepAngle: number): string => {
    const MIN_DISPLAY_ANGLE = 10;
    const displayAngle = Math.max(MIN_DISPLAY_ANGLE, sweepAngle);
    if (displayAngle >= 360) {
      const startPoint = getPointOnCircle(center, center, radius, 0);
      const midPoint = getPointOnCircle(center, center, radius, 180);
      return `
        M ${startPoint.x} ${startPoint.y}
        A ${radius} ${radius} 0 1 1 ${midPoint.x} ${midPoint.y}
        A ${radius} ${radius} 0 1 1 ${startPoint.x} ${startPoint.y}
      `;
    }
    const startPoint = getPointOnCircle(center, center, radius, 0);
    const endPoint = getPointOnCircle(center, center, radius, displayAngle);
    const largeArcFlag = displayAngle > 180 ? 1 : 0;
    return `
      M ${startPoint.x} ${startPoint.y}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}
    `;
  };

  const handleAngleUpdate = React.useCallback((newAngle: number) => {
    setCurrentAngle(newAngle);
    onAngleChange(newAngle);
  }, [onAngleChange]);

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onBegin((event) => {
      'worklet';
      gestureAngle.value = currentAngle;
      const touchX = event.x;
      const touchY = event.y;
      lastRawAngle.value = getAngleFromPoint(center, center, touchX, touchY);
    })
    .onUpdate((event) => {
      'worklet';
      const touchX = event.x;
      const touchY = event.y;
      const rawAngle = getAngleFromPoint(center, center, touchX, touchY);
      const prevRawAngle = lastRawAngle.value;
      let delta = rawAngle - prevRawAngle;
      if (delta > 180) delta = delta - 360;
      else if (delta < -180) delta = delta + 360;
      delta = delta * 0.75;
      let newAngle = gestureAngle.value + delta;
      newAngle = Math.max(0, Math.min(360, newAngle));
      gestureAngle.value = newAngle;
      lastRawAngle.value = rawAngle;
      runOnJS(handleAngleUpdate)(newAngle);
    });

  const arcPath = createArcPath(currentAngle);

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#DAE2B9"
            strokeWidth={strokeWidth}
            fill="none"
          />
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


