import { ThemedText, ThemedView } from '@/components/common';
import { LanguageSwitcher, ThemeDebugButton } from '@/components/theme';
import { useI18n } from '@/hooks/use-i18n';
import { StyleSheet } from 'react-native';

export default function MineScreen() {
  const { t } = useI18n('mine');

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">{t('title')}</ThemedText>
        <ThemedText style={styles.description}>
          {t('description')}
        </ThemedText>
        
        <ThemedView style={styles.debugSection}>
          <ThemedText style={styles.sectionTitle}>{t('debug_section')}</ThemedText>
          <ThemedView style={styles.buttonGroup}>
            <LanguageSwitcher />
            <ThemeDebugButton />
          </ThemedView>
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
  buttonGroup: {
    gap: 8,
  },
});

