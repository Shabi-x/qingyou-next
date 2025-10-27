import { ThemedText } from '@/components/common';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export function DateHeader() {
  const secondaryColor = useThemeColor({}, 'icon');
  const { t } = useI18n('calendar');
  
  // 组件挂载时从操作系统获取当前日期
  const [currentDate] = useState(() => new Date());

  // 获取星期
  const weekdayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const weekdayKey = weekdayKeys[currentDate.getDay()];
  const weekday = t(`weekdays.${weekdayKey}` as any);

  // 获取年月日
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  return (
    <View style={styles.container}>
      {/* 左侧：星期 */}
      <ThemedText style={styles.weekday}>{weekday}</ThemedText>
      
      {/* 右侧：年月日 */}
      <View style={styles.dateContainer}>
        <ThemedText style={[styles.dateText, { color: secondaryColor }]}>
          {year}
        </ThemedText>
        <ThemedText style={[styles.dateTextDay, { color: secondaryColor }]}>
          {t('month_day', { month, day })}
        </ThemedText>
      </View>
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

