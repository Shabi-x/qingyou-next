/**
 * 滑动取消手势逻辑
 */

/**
 * 计算滑动进度（0-1）
 * @param translationX 滑动的X轴距离
 * @param maxDistance 最大滑动距离
 * @returns 进度值，范围0-1
 */
export function calculateSlideProgress(
  translationX: number,
  maxDistance: number
): number {
  // 从右向左滑动，translationX 为负值
  const progress = Math.abs(translationX) / maxDistance;
  return Math.max(0, Math.min(1, progress));
}

/**
 * 判断是否应该触发取消操作
 * @param progress 滑动进度（0-1）
 * @param threshold 触发阈值，默认为1（拉满）
 * @returns 是否应该触发取消
 */
export function shouldTriggerCancel(
  progress: number,
  threshold: number = 1
): boolean {
  return progress >= threshold;
}

/**
 * 根据滑动进度计算手柄的位置
 * @param progress 滑动进度（0-1）
 * @param maxDistance 最大滑动距离
 * @returns 手柄的translateX值（负数）
 */
export function calculateHandlePosition(
  progress: number,
  maxDistance: number
): number {
  return -progress * maxDistance;
}

/**
 * 根据滑动进度计算轨道的宽度百分比
 * @param progress 滑动进度（0-1）
 * @returns 轨道宽度的百分比字符串
 */
export function calculateTrackWidth(progress: number): string {
  return `${progress * 100}%`;
}

/**
 * 根据滑动进度计算轨道颜色
 * @param progress 滑动进度（0-1）
 * @param baseColor 基础颜色（进度<50%时）
 * @param dangerColor 危险颜色（进度>=50%时）
 * @param threshold 颜色切换阈值，默认为0.5
 * @returns 轨道颜色
 */
export function calculateTrackColor(
  progress: number,
  baseColor: string,
  dangerColor: string,
  threshold: number = 0.5
): string {
  if (progress < threshold) {
    return baseColor;
  }
  
  // 渐变插值
  const transitionProgress = (progress - threshold) / (1 - threshold);
  return interpolateColor(baseColor, dangerColor, transitionProgress);
}

/**
 * 颜色插值函数
 * @param color1 起始颜色（hex格式）
 * @param color2 结束颜色（hex格式）
 * @param progress 插值进度（0-1）
 * @returns 插值后的颜色（hex格式）
 */
function interpolateColor(
  color1: string,
  color2: string,
  progress: number
): string {
  // 简单的线性插值，实际使用时可以用更复杂的颜色空间插值
  const c1 = parseColor(color1);
  const c2 = parseColor(color2);
  
  const r = Math.round(c1.r + (c2.r - c1.r) * progress);
  const g = Math.round(c1.g + (c2.g - c1.g) * progress);
  const b = Math.round(c1.b + (c2.b - c1.b) * progress);
  
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * 解析hex或rgb颜色
 */
function parseColor(color: string): { r: number; g: number; b: number } {
  // 处理 hex 颜色
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
  }
  
  // 处理 rgb 颜色
  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
    };
  }
  
  // 默认返回黑色
  return { r: 0, g: 0, b: 0 };
}

/**
 * 根据滑动进度获取提示文字
 * @param progress 滑动进度（0-1）
 * @returns 提示文字
 */
export function getSlideHintText(progress: number): string {
  if (progress === 0) {
    return '向右滑动放弃专注';
  } else if (progress < 0.5) {
    return '滑动放弃专注';
  } else if (progress < 1) {
    return '放弃';
  } else {
    return '放弃';
  }
}
