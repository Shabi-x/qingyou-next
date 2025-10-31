import auth from './zh-CN/auth.json';
import calendar from './zh-CN/calendar.json';
import common from './zh-CN/common.json';
import mine from './zh-CN/mine.json';

export const resources = {
  auth,
  common,
  calendar,
  mine,
} as const;

export type Resources = typeof resources;

// 扩展 i18next 类型
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: Resources;
  }
}

