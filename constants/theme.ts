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
    // 主要颜色
    text: '#000000',              // 主文字：纯黑
    textSecondary: '#8E8E93',     // 次要文字：中灰
    background: '#FFFFFF',        // 背景：纯白
    backgroundSecondary: '#F8F8F8', // 次要背景：浅灰
    
    // 卡片和容器
    card: '#FFFFFF',              // 卡片背景
    cardBorder: '#E5E5EA',        // 卡片边框
    
    // 品牌色
    tint: accentColorLight,       // 主题色
    accent: accentColorLight,     // 强调色（绿色）
    
    // 图标
    icon: '#8E8E93',              // 图标颜色
    tabIconDefault: '#8E8E93',    // Tab 默认图标
    tabIconSelected: '#000000',   // Tab 选中图标
  },
  dark: {
    // 主要颜色
    text: '#FFFFFF',              // 主文字：纯白
    textSecondary: '#8E8E93',     // 次要文字：中灰（与浅色模式一致）
    background: '#1C2128',        // 背景：深蓝灰
    backgroundSecondary: '#262A31', // 次要背景：略浅的深色
    
    // 卡片和容器
    card: '#2C2C2E',              // 卡片背景：深灰
    cardBorder: '#3A3A3C',        // 卡片边框：更浅的灰
    
    // 品牌色
    tint: accentColorDark,        // 主题色
    accent: accentColorDark,      // 强调色（绿色）
    
    // 图标
    icon: '#8E8E93',              // 图标颜色
    tabIconDefault: '#8E8E93',    // Tab 默认图标
    tabIconSelected: '#FFFFFF',   // Tab 选中图标
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
