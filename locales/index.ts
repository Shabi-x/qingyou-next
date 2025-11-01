import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入翻译文件
import authZh from './zh-CN/auth.json';
import calendarZh from './zh-CN/calendar.json';
import commonZh from './zh-CN/common.json';
import mineZh from './zh-CN/mine.json';

import authEn from './en-US/auth.json';
import calendarEn from './en-US/calendar.json';
import commonEn from './en-US/common.json';
import mineEn from './en-US/mine.json';

// 支持的语言列表
export const supportedLanguages = {
  'zh-CN': '简体中文',
  'en-US': 'English',
} as const;

export type SupportedLanguage = keyof typeof supportedLanguages;

// 翻译资源
const resources = {
  'zh-CN': {
    auth: authZh,
    common: commonZh,
    calendar: calendarZh,
    mine: mineZh,
  },
  'en-US': {
    auth: authEn,
    common: commonEn,
    calendar: calendarEn,
    mine: mineEn,
  },
};

// 获取设备语言
const getDeviceLanguage = (): SupportedLanguage => {
  const deviceLocale = Localization.getLocales()[0]?.languageTag || 'zh-CN';
  
  // 映射设备语言到支持的语言
  if (deviceLocale.startsWith('zh')) return 'zh-CN';
  if (deviceLocale.startsWith('en')) return 'en-US';
  
  return 'zh-CN'; // 默认中文
};

// 初始化 i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: 'zh-CN',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React 已经处理了 XSS
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

