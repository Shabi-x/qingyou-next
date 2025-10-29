/**
 * 日历工具函数
 * 用于生成日历数据和日期计算
 */

export interface CalendarDay {
  date: Date;
  day: number; // 日期数字（1-31）
  isCurrentMonth: boolean; // 是否当前月
  isToday: boolean; // 是否今天
  isSelected: boolean; // 是否选中
  weekday: number; // 星期几（0-6，0是周日）
}

/**
 * 获取某月的第一天是星期几（0-6，0是周一）
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  const firstDay = new Date(year, month, 1).getDay();
  // 转换：周日(0) -> 6, 周一(1) -> 0, ..., 周六(6) -> 5
  return firstDay === 0 ? 6 : firstDay - 1;
}

/**
 * 获取某月有多少天
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 判断两个日期是否是同一天
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 生成月视图的日历数据
 * @param year 年份
 * @param month 月份（0-11）
 * @param selectedDate 选中的日期
 * @returns 日历数据数组（42个元素，6周 * 7天）
 */
export function generateCalendarDays(
  year: number,
  month: number,
  selectedDate?: Date
): CalendarDay[] {
  const today = new Date();
  const firstDayOfWeek = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  
  const days: CalendarDay[] = [];
  
  // 上个月的尾部日期
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(year, month - 1, day);
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
      isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
      weekday: (firstDayOfWeek - 1 - i + 7) % 7,
    });
  }
  
  // 当前月的所有日期
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({
      date,
      day,
      isCurrentMonth: true,
      isToday: isSameDay(date, today),
      isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
      weekday: (firstDayOfWeek + day - 1) % 7,
    });
  }
  
  // 下个月的开头日期（补齐到42个，6周）
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
      isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
      weekday: (days.length % 7),
    });
  }
  
  return days;
}

/**
 * 获取包含指定日期的那一周的数据
 * @param days 完整的月视图数据
 * @param targetDate 目标日期
 * @returns 包含目标日期的那一周（7个元素）
 */
export function getWeekContainingDate(
  days: CalendarDay[],
  targetDate: Date
): CalendarDay[] {
  const index = days.findIndex(day => isSameDay(day.date, targetDate));
  if (index === -1) return days.slice(0, 7);
  
  const weekStart = Math.floor(index / 7) * 7;
  return days.slice(weekStart, weekStart + 7);
}

/**
 * 格式化日期为 YYYY/MM 格式
 */
export function formatYearMonth(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}/${month}`;
}

/**
 * 计算目标日期距离今天多少天
 * @param targetDate 目标日期
 * @returns 天数差值（负数表示过去，正数表示未来，0表示今天）
 */
export function getDaysFromToday(targetDate: Date): number {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const targetStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const diffTime = targetStart.getTime() - todayStart.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * 获取指定日期所在周的起止日期（周一到周日）
 * @param date 指定日期
 * @returns { weekStart: Date, weekEnd: Date }
 */
export function getWeekRange(date: Date): { weekStart: Date; weekEnd: Date } {
  const targetWeekday = date.getDay();
  // 计算本周一的日期（周日算上一周）
  const mondayOffset = targetWeekday === 0 ? -6 : 1 - targetWeekday;
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() + mondayOffset);
  weekStart.setHours(0, 0, 0, 0);
  
  // 计算本周日的日期
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return { weekStart, weekEnd };
}

/**
 * 判断指定日期是否在当前周内（周一到周日）
 * @param date 要判断的日期
 * @returns 是否在当前周内
 */
export function isDateInCurrentWeek(date: Date | null | undefined): boolean {
  if (!date) return false;
  
  const today = new Date();
  const { weekStart, weekEnd } = getWeekRange(today);
  
  const targetTime = new Date(date).setHours(0, 0, 0, 0);
  return targetTime >= weekStart.getTime() && targetTime <= weekEnd.getTime();
}

