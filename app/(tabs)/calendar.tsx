import { CalendarView, DateHeader } from '@/components/calendar';
import { ThemedView } from '@/components/common';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const [displayMonth, setDisplayMonth] = useState(new Date().getMonth());
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleMonthChange = (year: number, month: number) => {
    setDisplayYear(year);
    setDisplayMonth(month);
    
    // 切换到非当前月时，清除选中状态，优先展示"年/月"
    const today = new Date();
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
    if (!isCurrentMonth) {
      setSelectedDate(undefined);
    }
  };

  const handleCollapseChange = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <ThemedView style={styles.container}>
      <DateHeader 
        selectedDate={selectedDate}
        displayYear={displayYear}
        displayMonth={displayMonth}
        isCollapsed={isCollapsed}
      />
      <CalendarView 
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
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

