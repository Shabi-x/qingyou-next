import { useTheme } from '@/contexts/theme-context';
import { useI18n } from '@/hooks/use-i18n';
import { supportedLanguages, type SupportedLanguage } from '@/locales';
import { Pressable, StyleSheet, Text } from 'react-native';

export function LanguageSwitcher() {
  const { colorScheme } = useTheme();
  const { currentLanguage, changeLanguage } = useI18n();

  const toggleLanguage = () => {
    const newLang: SupportedLanguage = 
      currentLanguage === 'zh-CN' ? 'en-US' : 'zh-CN';
    changeLanguage(newLang);
  };

  const getLanguageLabel = () => {
    return supportedLanguages[currentLanguage as SupportedLanguage];
  };

  return (
    <Pressable
      onPress={toggleLanguage}
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
        🌐 {getLanguageLabel()}
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

