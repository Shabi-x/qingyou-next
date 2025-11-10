/**
 * 番茄钟工具函数
 */

// 常量定义
export const POMODORO_CONFIG = {
  MIN_MINUTES: 5,      // 最小时间（分钟）
  MAX_MINUTES: 180,    // 最大时间（分钟）
  STEP_MINUTES: 5,     // 时间步长（分钟）
  DEFAULT_MINUTES: 15, // 默认时间（分钟）
};

/**
 * 将角度转换为分钟数
 * @param angle 角度（0-360）
 * @returns 分钟数
 */
export function angleToMinutes(angle: number): number {
  const { MIN_MINUTES, MAX_MINUTES, STEP_MINUTES } = POMODORO_CONFIG;
  
  // 限制角度在 0-360 范围内（不使用循环标准化）
  const clampedAngle = Math.max(0, Math.min(360, angle));
  
  // 总共有多少个步长（5, 10, 15, ..., 180 共 36 个值，35 个步长）
  const totalSteps = (MAX_MINUTES - MIN_MINUTES) / STEP_MINUTES;
  
  // 每个步长对应的角度
  const anglePerStep = 360 / (totalSteps + 1); // +1 因为包含起始值
  
  // 计算步数（向下取整）
  const step = Math.floor(clampedAngle / anglePerStep);
  
  // 计算分钟数
  let minutes = MIN_MINUTES + step * STEP_MINUTES;
  
  // 确保在有效范围内
  minutes = Math.max(MIN_MINUTES, Math.min(MAX_MINUTES, minutes));
  
  return minutes;
}

/**
 * 将分钟数转换为角度
 * @param minutes 分钟数
 * @returns 角度（0-360）
 */
export function minutesToAngle(minutes: number): number {
  const { MIN_MINUTES, MAX_MINUTES } = POMODORO_CONFIG;
  
  // 确保分钟数在有效范围内
  const clampedMinutes = Math.max(MIN_MINUTES, Math.min(MAX_MINUTES, minutes));
  
  // 将分钟数映射到角度（5分钟 = 0度，180分钟 = 360度）
  const ratio = (clampedMinutes - MIN_MINUTES) / (MAX_MINUTES - MIN_MINUTES);
  
  return ratio * 360;
}

/**
 * 格式化时间显示
 * @param totalSeconds 总秒数
 * @returns 格式化的时间字符串（MM:SS）
 */
export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * 计算圆上某个角度对应的坐标点
 * @param centerX 圆心 X 坐标
 * @param centerY 圆心 Y 坐标
 * @param radius 半径
 * @param angle 角度（度数，0度在正上方，顺时针）
 * @returns 坐标点 {x, y}
 */
export function getPointOnCircle(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number
): { x: number; y: number } {
  'worklet';
  // 转换为弧度，并调整起始位置（-90度使0度在正上方）
  const radian = ((angle - 90) * Math.PI) / 180;
  
  return {
    x: centerX + radius * Math.cos(radian),
    y: centerY + radius * Math.sin(radian),
  };
}

/**
 * 计算两点之间的角度
 * @param centerX 圆心 X 坐标
 * @param centerY 圆心 Y 坐标
 * @param pointX 点 X 坐标
 * @param pointY 点 Y 坐标
 * @returns 角度（度数，0度在正上方，顺时针）
 */
export function getAngleFromPoint(
  centerX: number,
  centerY: number,
  pointX: number,
  pointY: number
): number {
  'worklet';
  const dx = pointX - centerX;
  const dy = pointY - centerY;
  
  // 计算弧度
  let radian = Math.atan2(dy, dx);
  
  // 转换为度数，并调整起始位置（+90度使0度在正上方）
  let angle = (radian * 180) / Math.PI + 90;
  
  // 确保角度在 0-360 范围内
  angle = ((angle % 360) + 360) % 360;
  
  return angle;
}
