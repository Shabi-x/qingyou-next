import { PomodoroHorizontalDashboard } from '@/components/pomodoro/pomodoro-horizontal/dashboard';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useNavigation } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import React, { useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';

// 青柚时钟全屏模式-横屏
export default function PomodoroHorizontal() {
  const background = useThemeColor({}, 'background');
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
    // 组件卸载时恢复竖屏
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, [background]);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <StatusBar hidden />
      <PomodoroHorizontalDashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


