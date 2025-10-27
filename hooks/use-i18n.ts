import type { SupportedLanguage } from '@/locales';
import { useTranslation } from 'react-i18next';

/**
 * 自定义 i18n hook，提供类型安全的翻译功能
 * 
 * @example
 * const { t, changeLanguage, currentLanguage } = useI18n('calendar');
 * t('title'); // 日历
 * t('month_day', { month: 3, day: 25 }); // 3月25日
 */
export function useI18n(namespace?: 'common' | 'calendar' | 'mine') {
  const { t, i18n } = useTranslation(namespace);

  const changeLanguage = async (lang: SupportedLanguage) => {
    await i18n.changeLanguage(lang);
  };

  const currentLanguage = i18n.language as SupportedLanguage;

  return {
    t,
    changeLanguage,
    currentLanguage,
    i18n,
  };
}

