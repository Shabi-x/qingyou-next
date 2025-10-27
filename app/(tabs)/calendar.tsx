import { DateHeader } from '@/components/calendar';
import { ThemedText, ThemedView } from '@/components/common';
import { useI18n } from '@/hooks/use-i18n';
import { StyleSheet } from 'react-native';

export default function CalendarScreen() {
  const { t } = useI18n('calendar');

  return (
    <ThemedView style={styles.container}>
      <DateHeader />
      <ThemedView style={styles.content}>
        <ThemedText style={styles.description}>
          {t('content_area')}
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

