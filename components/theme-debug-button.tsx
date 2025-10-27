import { useTheme } from '@/contexts/theme-context';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export function ThemeDebugButton() {
  const { colorScheme, toggleTheme } = useTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      style={({ pressed }) => [
        styles.button,
        { 
          backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7',
          opacity: pressed ? 0.7 : 1,
        }
      ]}>
      <Text style={[
        styles.text,
        { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }
      ]}>
        {colorScheme === 'light' ? '☀️ Light' : '🌙 Dark'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});

