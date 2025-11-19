import '@/locales'; // 初始化 i18n
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { ThemeProvider, useTheme } from '@/contexts/theme-context';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

function RootLayoutNav() {
  const { colorScheme } = useTheme();

  // 设置系统 UI 背景色（Android 导航栏）
  useEffect(() => {
    const backgroundColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;
    SystemUI.setBackgroundColorAsync(backgroundColor);
  }, [colorScheme]);

  return (
    <>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="pomodoro-horizontal" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
