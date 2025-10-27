import { ThemedText, ThemedView } from '@/components/common';
import { ThemeDebugButton } from '@/components/theme';
import { StyleSheet } from 'react-native';

export default function MineScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">我的</ThemedText>
        <ThemedText style={styles.description}>
          这是个人中心页面
        </ThemedText>
        
        <ThemedView style={styles.debugSection}>
          <ThemedText style={styles.sectionTitle}>开发调试</ThemedText>
          <ThemeDebugButton />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  debugSection: {
    marginTop: 32,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
});

