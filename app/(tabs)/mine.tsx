import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { ThemedText, ThemedView } from '@/components/common';
import { LanguageSwitcher, ThemeDebugButton } from '@/components/theme';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function MineScreen() {
  const { t } = useI18n('mine');
  const accentColor = useThemeColor({}, 'accent');

  const handleLogout = () => {
    // 退出登录，跳转到欢迎页
    router.replace('/(auth)');
  };

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

        {/* 退出登录按钮 */}
        <ThemedView style={styles.logoutSection}>
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              { 
                backgroundColor: '#A3D65C',
                opacity: pressed ? 0.8 : 1,
              }
            ]}
          >
            <Text style={styles.logoutButtonText}>
              {t('logout')}
            </Text>
          </Pressable>
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
  logoutSection: {
    marginTop: 48,
  },
  logoutButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A3D65C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

