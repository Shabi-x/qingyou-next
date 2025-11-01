import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', // 从右向左的翻页动画
      }}>
      <Stack.Screen 
        name="index" 
        options={{
          title: '欢迎',
        }} 
      />
      <Stack.Screen 
        name="login" 
        options={{
          title: '登录',
        }} 
      />
      <Stack.Screen 
        name="user-agreement" 
        options={{
          title: '用户协议',
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="privacy-policy" 
        options={{
          title: '隐私政策',
          presentation: 'card',
        }} 
      />
    </Stack>
  );
}
