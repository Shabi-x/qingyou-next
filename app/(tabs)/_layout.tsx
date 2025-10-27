import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Tabs, usePathname } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TAB_COUNT = 4;
const TAB_WIDTH = SCREEN_WIDTH / TAB_COUNT;

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

// Tab 图标（不带背景，背景由滑动块提供）
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

// 滑动背景块组件
function SlidingBackground() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  
  // 当前位置
  const translateX = useSharedValue(0);
  
  // Tab 索引映射
  const getTabIndex = (path: string) => {
    if (path.includes('calendar')) return 0;
    if (path.includes('schedule')) return 1;
    if (path.includes('clock')) return 2;
    if (path.includes('mine')) return 3;
    return 0;
  };

  useEffect(() => {
    const currentIndex = getTabIndex(pathname);
    const targetX = currentIndex * TAB_WIDTH;
    const currentX = translateX.value;
    
    // 计算最短路径（从第4个到第1个时，判断是否需要快速切换）
    const distance = Math.abs(targetX - currentX);
    const shouldUseFastTransition = distance > TAB_WIDTH * 2;
    
    // 根据距离选择动画配置
    if (shouldUseFastTransition) {
      // 快速过渡（第4个到第1个，或相反）- 略微放慢
      translateX.value = withTiming(targetX, {
        duration: 300,
      });
    } else {
      // 正常弹性过渡 - 调整弹性参数，略微放慢
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

// Tab Bar 背景组件（带滑动背景块）
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
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  iconContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slidingBackground: {
    position: 'absolute',
    width: TAB_WIDTH * 0.7,  // 缩小宽度（减少左右padding）
    height: 42,              // 缩小高度（减少上下padding）
    borderRadius: 21,        // 对应的圆角
    top: 19,                 // 垂直居中调整
    left: TAB_WIDTH * 0.15,  // 水平居中偏移
  },
});
