# 🌐 国际化 (i18n) 使用指南

本项目使用 **i18next + react-i18next** 实现国际化功能。

## 📁 目录结构

```
locales/
├── index.ts              # i18n 配置入口
├── types.ts              # TypeScript 类型定义
├── zh-CN/                # 简体中文翻译
│   ├── common.json       # 通用翻译
│   ├── calendar.json     # 日历模块
│   ├── schedule.json     # 课程表模块
│   ├── clock.json        # 时钟模块
│   └── mine.json         # 我的模块
└── en-US/                # 英文翻译
    ├── common.json
    ├── calendar.json
    ├── schedule.json
    ├── clock.json
    └── mine.json
```

## 🎯 核心特性

- ✅ **按模块组织** - 每个功能模块独立的翻译文件
- ✅ **类型安全** - 完整的 TypeScript 类型支持
- ✅ **自动检测** - 根据设备语言自动切换
- ✅ **命名空间** - 使用命名空间隔离不同模块
- ✅ **插值支持** - 支持变量插值 `{{variable}}`
- ✅ **易于扩展** - 添加新语言只需新增文件夹

## 📖 使用方法

### 1. 基本使用

```typescript
import { useI18n } from '@/hooks/use-i18n';

export default function MyComponent() {
  // 使用指定命名空间
  const { t } = useI18n('calendar');
  
  return <Text>{t('title')}</Text>;  // "日历" 或 "Calendar"
}
```

### 2. 插值变量

在翻译文件中定义：

```json
{
  "month_day": "{{month}}月{{day}}日"
}
```

在组件中使用：

```typescript
const { t } = useI18n('calendar');
t('month_day', { month: 3, day: 25 });  // "3月25日"
```

### 3. 嵌套键值

在翻译文件中定义：

```json
{
  "weekdays": {
    "monday": "周一",
    "tuesday": "周二"
  }
}
```

在组件中使用：

```typescript
const { t } = useI18n('calendar');
t('weekdays.monday');  // "周一"
```

### 4. 切换语言

```typescript
import { useI18n } from '@/hooks/use-i18n';

const { changeLanguage, currentLanguage } = useI18n();

// 切换到英文
await changeLanguage('en-US');

// 切换到中文
await changeLanguage('zh-CN');

// 获取当前语言
console.log(currentLanguage);  // 'zh-CN' 或 'en-US'
```

## ➕ 添加新语言

### 1. 创建语言文件夹

```bash
mkdir locales/ja-JP  # 日语
mkdir locales/ko-KR  # 韩语
```

### 2. 复制翻译文件

```bash
cp -r locales/zh-CN/* locales/ja-JP/
cp -r locales/zh-CN/* locales/ko-KR/
```

### 3. 翻译内容

编辑 `locales/ja-JP/*.json` 文件，将内容翻译为日语。

### 4. 更新配置

在 `locales/index.ts` 中添加：

```typescript
// 导入新语言
import commonJa from './ja-JP/common.json';
// ... 其他文件

// 添加到支持列表
export const supportedLanguages = {
  'zh-CN': '简体中文',
  'en-US': 'English',
  'ja-JP': '日本語',  // ← 新增
} as const;

// 添加到资源
const resources = {
  'zh-CN': { /* ... */ },
  'en-US': { /* ... */ },
  'ja-JP': {            // ← 新增
    common: commonJa,
    // ... 其他模块
  },
};

// 更新语言检测逻辑
const getDeviceLanguage = (): SupportedLanguage => {
  const deviceLocale = Localization.getLocales()[0]?.languageTag || 'zh-CN';
  
  if (deviceLocale.startsWith('zh')) return 'zh-CN';
  if (deviceLocale.startsWith('en')) return 'en-US';
  if (deviceLocale.startsWith('ja')) return 'ja-JP';  // ← 新增
  
  return 'zh-CN';
};
```

## 📦 添加新模块

### 1. 创建翻译文件

```bash
# 创建新模块的翻译文件
touch locales/zh-CN/settings.json
touch locales/en-US/settings.json
```

### 2. 编写翻译内容

`locales/zh-CN/settings.json`:

```json
{
  "title": "设置",
  "language": "语言",
  "theme": "主题"
}
```

`locales/en-US/settings.json`:

```json
{
  "title": "Settings",
  "language": "Language",
  "theme": "Theme"
}
```

### 3. 导入到配置

在 `locales/index.ts` 中：

```typescript
// 导入
import settingsZh from './zh-CN/settings.json';
import settingsEn from './en-US/settings.json';

// 添加到资源
const resources = {
  'zh-CN': {
    common: commonZh,
    // ... 其他模块
    settings: settingsZh,  // ← 新增
  },
  'en-US': {
    common: commonEn,
    // ... 其他模块
    settings: settingsEn,  // ← 新增
  },
};
```

### 4. 更新 TypeScript 类型

在 `hooks/use-i18n.ts` 中更新类型：

```typescript
export function useI18n(
  namespace?: 'common' | 'calendar' | 'schedule' | 'clock' | 'mine' | 'settings'  // ← 添加
) {
  // ...
}
```

### 5. 在组件中使用

```typescript
import { useI18n } from '@/hooks/use-i18n';

export default function SettingsScreen() {
  const { t } = useI18n('settings');
  
  return <Text>{t('title')}</Text>;  // "设置" 或 "Settings"
}
```

## 💡 最佳实践

### 1. 命名规范

- **文件名**: 小写字母 + 连字符，如 `user-profile.json`
- **键名**: 小写字母 + 下划线，如 `user_name`
- **嵌套**: 最多 2-3 层，避免过深

### 2. 组织原则

- **通用内容** → `common.json`
- **模块特定** → 对应模块的 JSON 文件
- **共享组件** → 在 `common.json` 中定义

### 3. 插值变量

使用有意义的变量名：

```json
// ✅ 好
{ "greeting": "你好，{{username}}！" }

// ❌ 不好
{ "greeting": "你好，{{name}}！" }
```

### 4. 复数处理

对于需要复数形式的文本：

```json
{
  "items_count": "{{count}} 个项目",
  "items_count_plural": "{{count}} items"
}
```

## 🛠️ 开发工具

### 查看当前语言

在任何页面的"我的"标签页，可以看到**语言切换按钮** 🌐，点击可以在中英文之间切换。

### 调试翻译

在开发模式下，如果翻译键不存在，会显示键名本身，方便排查问题。

## 📚 参考资源

- [i18next 官方文档](https://www.i18next.com/)
- [react-i18next 文档](https://react.i18next.com/)
- [expo-localization](https://docs.expo.dev/versions/latest/sdk/localization/)
