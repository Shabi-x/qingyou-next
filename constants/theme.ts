/**
 * 清悠 App 配色方案
 * 参考设计稿实现的深色/浅色主题
 */

import { Platform } from 'react-native';

// 主题强调色
const accentColorLight = '#A3D65C';  // 嫩绿色强调色
const accentColorDark = '#A3D65C';   // 保持一致的强调色

export const Colors = {
  light: {
    // 主要颜色（添加 FF 确保完全不透明）
    text: '#000000FF',              // 主文字：纯黑
    textSecondary: '#8E8E93FF',     // 次要文字：中灰
    background: '#F2F2F7FF',        // 背景：浅灰（页面背景）
    backgroundSecondary: '#FFFFFFFF', // 次要背景：纯白（课程/待办卡片背景）
    
    // 卡片和容器
    card: '#FFFFFFFF',              // 卡片背景：纯白（日历容器背景）
    cardBorder: '#E8E8EDFF',        // 卡片边框：浅灰
    
    // 品牌色
    tint: accentColorLight,       // 主题色
    accent: accentColorLight,     // 强调色（绿色）
    
    // 图标
    icon: '#8E8E93FF',              // 图标颜色
    tabIconDefault: '#8E8E93FF',    // Tab 默认图标
    tabIconSelected: '#000000FF',   // Tab 选中图标
  },
  dark: {
    // 主要颜色（添加 FF 确保完全不透明）
    text: '#FFFFFFFF',              // 主文字：纯白
    textSecondary: '#8E8E93FF',     // 次要文字：中灰（与浅色模式一致）
    background: '#262A31FF',        // 背景：深灰（页面背景）
    backgroundSecondary: '#1C2128FF', // 次要背景：深蓝灰（课程/待办卡片背景）
    
    // 卡片和容器
    card: '#1C2128FF',              // 卡片背景：深蓝灰（日历容器背景）
    cardBorder: '#1C2128FF',        // 卡片边框：深色（与卡片同色）
    
    // 品牌色
    tint: accentColorDark,        // 主题色
    accent: accentColorDark,      // 强调色（绿色）
    
    // 图标
    icon: '#8E8E93FF',              // 图标颜色
    tabIconDefault: '#8E8E93FF',    // Tab 默认图标
    tabIconSelected: '#FFFFFFFF',   // Tab 选中图标
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
