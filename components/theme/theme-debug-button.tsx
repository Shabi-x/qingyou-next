import { useTheme } from '@/contexts/theme-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export function ThemeDebugButton() {
  const { colorScheme, toggleTheme } = useTheme();
  const buttonBackgroundColor = useThemeColor({}, 'backgroundSecondary');
  const textColor = useThemeColor({}, 'text');

  return (
    <Pressable
      onPress={toggleTheme}
      style={({ pressed }) => [
        styles.button,
        { 
          backgroundColor: buttonBackgroundColor,
          opacity: pressed ? 0.7 : 1,
        }
      ]}>
      <Text style={[
        styles.text,
        { color: textColor }
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

