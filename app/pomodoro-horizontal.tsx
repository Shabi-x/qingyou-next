import { useThemeColor } from '@/hooks/use-theme-color';
import { useNavigation } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

// 青柚时钟全屏模式-横屏
export default function PomodoroHorizontal() {
  const textColor = useThemeColor({}, 'text');
  const background = useThemeColor({}, 'background');
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();

  // 隐藏导航栏
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    // 锁定为横屏
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    // 沉浸式：设置系统 UI 背景色
    SystemUI.setBackgroundColorAsync(background);
    // 监听屏幕尺寸变化（横竖屏切换）
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    // 组件卸载时恢复竖屏
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      subscription?.remove();
    };
  }, [background]);

  const { width, height } = dimensions;

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <StatusBar hidden />
      <Text style={[styles.title, { color: textColor }]}>横屏专注模式</Text>
      <Text style={[styles.subtitle, { color: textColor }]}>
        屏幕尺寸: {width} × {height}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});


