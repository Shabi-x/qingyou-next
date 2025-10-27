import { DateHeader } from '@/components/calendar';
import { ThemedText, ThemedView } from '@/components/common';
import { StyleSheet } from 'react-native';

export default function CalendarScreen() {
  return (
    <ThemedView style={styles.container}>
      <DateHeader />
      <ThemedView style={styles.content}>
        <ThemedText style={styles.description}>
          日历内容区域
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
    opacity: 0.5,
  },
});

