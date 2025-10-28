import { ThemedText } from '@/components/common';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import { isSameDay } from '@/utils/calendar';
import { StyleSheet, View } from 'react-native';

interface DateHeaderProps {
  selectedDate?: Date; // 用户选中的日期
  displayYear: number; // 当前显示的年份
  displayMonth: number; // 当前显示的月份（0-11）
  isCollapsed: boolean; // 是否折叠状态
}

export function DateHeader({ selectedDate, displayYear, displayMonth, isCollapsed }: DateHeaderProps) {
  const secondaryColor = useThemeColor({}, 'textSecondary');
  const { t } = useI18n('calendar');
  
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  
  // 判断是否在当前月
  const isCurrentMonth = displayYear === todayYear && displayMonth === todayMonth;
  
  // 判断选中日期是否是今天
  const isSelectedToday = selectedDate ? isSameDay(selectedDate, today) : false;
  
  /**
   * 显示逻辑：
   * 1. 折叠状态：始终展示周几（因为自动定位到今日）
   * 2. 展开状态：
   *    - 如果有选中日期且是今天 → 展示周几
   *    - 如果有选中日期但不是今天 → 展示年/月
   *    - 如果没有选中日期：
   *      - 在当前月 → 展示周几（默认就是今天）
   *      - 不在当前月 → 展示年/月
   */
  const shouldShowWeekday = isCollapsed || 
                            isSelectedToday || 
                            (!selectedDate && isCurrentMonth);
  
  // 用于显示的日期
  const displayDate = selectedDate || new Date(displayYear, displayMonth, today.getDate());
  
  // 获取星期
  const weekdayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const weekdayKey = weekdayKeys[displayDate.getDay()];
  const weekday = t(`weekdays.${weekdayKey}` as any);

  // 获取年月日
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth() + 1;
  const day = displayDate.getDate();

  return (
    <View style={styles.container}>
      {/* 左侧：根据逻辑显示"星期X"或"YYYY/MM" */}
      <ThemedText style={styles.weekday}>
        {shouldShowWeekday ? weekday : `${displayYear}/${(displayMonth + 1).toString().padStart(2, '0')}`}
      </ThemedText>
      
      {/* 右侧：年月日（仅显示周几时展示） */}
      {shouldShowWeekday && (
        <View style={styles.dateContainer}>
          <ThemedText style={[styles.dateText, { color: secondaryColor }]}>
            {year}
          </ThemedText>
          <ThemedText style={[styles.dateTextDay, { color: secondaryColor }]}>
            {t('month_day', { month, day })}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  weekday: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: 0,
  },
  dateContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
  },
  dateTextDay:{
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: 0,
  }
});

