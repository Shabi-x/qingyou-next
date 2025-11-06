import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Tabs, usePathname } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TAB_COUNT = 4;
const TAB_WIDTH = SCREEN_WIDTH / TAB_COUNT;
const CONTENT_HEIGHT = 80; // 内容区域高度（不包括 SafeArea）

// Icon 容器的尺寸（用于计算高亮块）
const ICON_CONTAINER_WIDTH = 70; // paddingHorizontal(20*2) + icon(26)
const ICON_CONTAINER_HEIGHT = 50; // paddingVertical(8*2) + icon(26)

function CustomTabBarButton({ children, onPress }: BottomTabBarButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.tabButton}>
      {children}
    </Pressable>
  );
}

function TabIcon({ 
  focused, 
  iconName, 
  size = 26 
}: { 
  focused: boolean; 
  iconName: any; 
  size?: number;
}) {
  const iconSelectedColor = useThemeColor({}, 'tabIconSelected');
  const iconDefaultColor = useThemeColor({}, 'tabIconDefault');

  return (
    <View style={styles.iconContainer}>
      <IconSymbol
        size={size}
        name={iconName}
        color={focused ? iconSelectedColor : iconDefaultColor}
      />
    </View>
  );
}

// 滑动高亮块组件
function SlidingBackground() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const translateX = useSharedValue(0);
  
  // 获取当前 tab 索引
  const getTabIndex = (path: string) => {
    if (path.includes('calendar')) return 0;
    if (path.includes('schedule')) return 1;
    if (path.includes('clock')) return 2;
    if (path.includes('mine')) return 3;
    return 0;
  };

  useEffect(() => {
    const currentIndex = getTabIndex(pathname);
    
    // 计算高亮块的目标位置：使其与 icon 共享几何中心
    // 每个 tab 的中心 = tabIndex * TAB_WIDTH + TAB_WIDTH / 2
    // 高亮块左边距 = tab 中心 - 高亮块宽度 / 2
    const tabCenterX = currentIndex * TAB_WIDTH + TAB_WIDTH / 2;
    const targetX = tabCenterX - ICON_CONTAINER_WIDTH / 2;
    
    const currentX = translateX.value;
    const distance = Math.abs(targetX - currentX);
    const shouldUseFastTransition = distance > TAB_WIDTH * 2;
    
    // 根据距离选择动画配置
    if (shouldUseFastTransition) {
      // 快速过渡（跨多个 tab）
      translateX.value = withTiming(targetX, {
        duration: 300,
      });
    } else {
      // 正常弹性过渡
      translateX.value = withSpring(targetX, {
        damping: 22,
        stiffness: 120,
        mass: 1,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const bgColor = colorScheme === 'dark'
    ? 'rgba(255, 255, 255, 0.15)'
    : 'rgba(0, 0, 0, 0.08)';

  return (
    <Animated.View
      style={[
        styles.slidingBackground,
        { backgroundColor: bgColor },
        animatedStyle,
      ]}
    />
  );
}

// Tab Bar 背景组件（带滑动高亮块）
function TabBarBackground() {
  const colorScheme = useColorScheme();
  
  return (
    <View style={StyleSheet.absoluteFill}>
      <BlurView
        intensity={80}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
        experimentalBlurMethod="dimezisBlurView"
      />
      <SlidingBackground />
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  // Tab 栏总高度 = 内容高度 + 底部安全区域
  const tabBarHeight = CONTENT_HEIGHT + insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: CustomTabBarButton,
        tabBarStyle: {
          position: 'absolute',
          height: tabBarHeight,
          paddingBottom: insets.bottom, // SafeArea 在底部撑起
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
            <TabIcon focused={focused} iconName="note.text" />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: '课程表',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="calendar" />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="clock"
        options={{
          title: '时钟',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="alarm.fill" />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="mine"
        options={{
          title: '我的',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="person.crop.circle" />
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
  // Tab 按钮：占据 1/4 宽度，内容垂直水平居中
  tabButton: {
    flex: 1,
    height: CONTENT_HEIGHT,
    justifyContent: 'center', // 垂直居中（主轴）
    alignItems: 'center',     // 水平居中（副轴）
  },
  
  // Icon 容器：固定 padding，定义了 icon 的可视区域
  iconContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // 滑动高亮块：绝对定位，与 icon 容器尺寸一致
  slidingBackground: {
    position: 'absolute',
    width: ICON_CONTAINER_WIDTH,
    height: ICON_CONTAINER_HEIGHT,
    borderRadius: 50,
    // 垂直居中：(CONTENT_HEIGHT - ICON_CONTAINER_HEIGHT) / 2
    top: (CONTENT_HEIGHT - ICON_CONTAINER_HEIGHT) / 2,
  },
});
