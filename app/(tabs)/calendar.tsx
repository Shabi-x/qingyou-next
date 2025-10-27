import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function CalendarScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">日历</ThemedText>
        <ThemedText style={styles.description}>
          Hello World - 日历页面
        </ThemedText>
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
});

