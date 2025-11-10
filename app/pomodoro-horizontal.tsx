import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function PomodoroHorizontal() {
  const textColor = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const background = useThemeColor({}, 'background');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text style={[styles.title, { color: textColor }]}>横屏专注模式</Text>
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
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});


