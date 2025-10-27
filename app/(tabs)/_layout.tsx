import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

// 自定义 Tab 按钮组件
function CustomTabBarButton({ children, onPress }: BottomTabBarButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.tabButton}>
      {children}
    </Pressable>
  );
}

// Tab Bar 背景组件
function TabBarBackground() {
  const colorScheme = useColorScheme();
  
  return (
    <BlurView
      intensity={80}
      tint={colorScheme === 'dark' ? 'dark' : 'light'}
      style={StyleSheet.absoluteFill}
      experimentalBlurMethod="dimezisBlurView"
    />
  );
}

export default function TabLayout() {
  const iconSelectedColor = useThemeColor({}, 'tabIconSelected');
  const iconDefaultColor = useThemeColor({}, 'tabIconDefault');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: CustomTabBarButton,
        tabBarStyle: {
          position: 'absolute',
          height: 80,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => <TabBarBackground />,
      }}>
      <Tabs.Screen
        name="calendar"
        options={{
          title: '日历',
          tabBarIcon: ({ focused }) => (
            <IconSymbol 
              size={26} 
              name="note.text" 
              color={focused ? iconSelectedColor : iconDefaultColor} 
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: '课程表',
          tabBarIcon: ({ focused }) => (
            <IconSymbol 
              size={26} 
              name="calendar" 
              color={focused ? iconSelectedColor : iconDefaultColor} 
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="clock"
        options={{
          title: '时钟',
          tabBarIcon: ({ focused }) => (
            <IconSymbol 
              size={26} 
              name="alarm.fill" 
              color={focused ? iconSelectedColor : iconDefaultColor} 
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="mine"
        options={{
          title: '我的',
          tabBarIcon: ({ focused }) => (
            <IconSymbol 
              size={26} 
              name="person.crop.circle" 
              color={focused ? iconSelectedColor : iconDefaultColor} 
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
