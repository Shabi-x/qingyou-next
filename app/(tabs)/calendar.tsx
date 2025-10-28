import { CalendarView, DateHeader } from '@/components/calendar';
import { ThemedView } from '@/components/common';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function CalendarScreen() {
  // 初始状态不选中任何日期，Header显示当前月份"年/月"
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const [displayMonth, setDisplayMonth] = useState(new Date().getMonth());

  const handleMonthChange = (year: number, month: number) => {
    setDisplayYear(year);
    setDisplayMonth(month);
    // 切换月份时清除选中状态，header显示"年/月"
    setSelectedDate(undefined);
  };

  const handleCollapseChange = (isCollapsed: boolean) => {
    if (isCollapsed) {
      // 折叠时自动选中今天，header显示"星期X"
      const today = new Date();
      setSelectedDate(today);
      setDisplayYear(today.getFullYear());
      setDisplayMonth(today.getMonth());
    } else {
      // 展开时清除选中状态，header显示"年/月"
      setSelectedDate(undefined);
    }
  };

  // 根据选中日期或当前显示月份创建displayDate
  const displayDate = selectedDate || new Date(displayYear, displayMonth, 1);

  return (
    <ThemedView style={styles.container}>
      <DateHeader displayDate={displayDate} />
      <CalendarView 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        onMonthChange={handleMonthChange}
        onCollapseChange={handleCollapseChange}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.5,
  },
});

