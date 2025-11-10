/**
 * 番茄钟类型定义
 */

/** 计时模式 */
export type TimerMode = 'countdown' | 'countup';  // 倒计时 | 正计时

/** 专注状态 */
export type FocusState = 
  | 'idle'        // 空闲（设置页面）
  | 'canceling'   // 可取消阶段（前10秒）
  | 'focusing'    // 专注中
  | 'paused'      // 暂停
  | 'completed'   // 已完成（正常完成）
  | 'abandoned';  // 半途而废（放弃/提前结束）

/** 番茄钟配置 */
export interface PomodoroConfig {
  mode: TimerMode;
  minutes: number;
}

/** 番茄钟状态 */
export interface PomodoroState {
  config: PomodoroConfig;
  focusState: FocusState;
  elapsedSeconds: number;  // 已经过的秒数
  cancelCountdown: number; // 取消倒计时（秒）
}
