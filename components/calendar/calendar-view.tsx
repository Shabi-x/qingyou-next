import { useThemeColor } from '@/hooks/use-theme-color';
import { generateCalendarDays, getWeekContainingDate, isSameDay, type CalendarDay } from '@/utils/calendar';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CALENDAR_WIDTH = SCREEN_WIDTH - 32; // 减去容器padding
const SWIPE_THRESHOLD = 80; // 滑动距离阈值（像素）
const SWIPE_VELOCITY_THRESHOLD = 500; // 滑动速度阈值（像素/秒）
const VERTICAL_SWIPE_THRESHOLD = 30;
const DAY_CELL_HEIGHT = 52;
const WEEK_HEIGHT = 70; // 折叠状态增加上下padding
const MONTH_HEIGHT = DAY_CELL_HEIGHT * 6;
interface CalendarViewProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onMonthChange?: (year: number, month: number) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

export function CalendarView({ selectedDate, onDateSelect, onMonthChange, onCollapseChange }: CalendarViewProps) {
  const [year, setYear] = useState(() => (selectedDate || new Date()).getFullYear());
  const [month, setMonth] = useState(() => (selectedDate || new Date()).getMonth());
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const accentColor = useThemeColor({}, 'accent');
  
  // 始终定位在中间月（索引1）
  const translateX = useSharedValue(-CALENDAR_WIDTH);
  const calendarHeight = useSharedValue(MONTH_HEIGHT);
  
  // 标记是否正在切换月份（防止重复触发）
  const isSwitching = useRef(false);
  
  // 标记当前手势是否已触发预加载（防止同一手势多次触发）
  const hasPreloaded = useRef<'next' | 'prev' | null>(null);
  
  // 生成三个月的数据
  const prevMonthYear = month === 0 ? year - 1 : year;
  const prevMonth = month === 0 ? 11 : month - 1;
  const nextMonthYear = month === 11 ? year + 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  
  const prevMonthDays = generateCalendarDays(prevMonthYear, prevMonth, selectedDate);
  const currentMonthDays = generateCalendarDays(year, month, selectedDate);
  const nextMonthDays = generateCalendarDays(nextMonthYear, nextMonth, selectedDate);
  
  // 获取当前选中日期所在的那一周
  const currentWeekDays = selectedDate 
    ? getWeekContainingDate(currentMonthDays, selectedDate)
    : getWeekContainingDate(currentMonthDays, new Date());
  
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // 获取今天是星期几（0=Mon, 1=Tue, ..., 6=Sun）
  const today = new Date();
  const todayWeekdayIndex = (today.getDay() + 6) % 7; // 转换JS的周日=0 为 周一=0
  
  // 切换到上一个月
  const gotoPrevMonth = () => {
    if (isSwitching.current) return;
    isSwitching.current = true;
    
    let newYear = year;
    let newMonth = month;
    
    if (month === 0) {
      newYear = year - 1;
      newMonth = 11;
    } else {
      newMonth = month - 1;
    }
    
    setYear(newYear);
    setMonth(newMonth);
    onMonthChange?.(newYear, newMonth);
    
    // 快速重置标记，允许连续滑动
    setTimeout(() => {
      isSwitching.current = false;
    }, 50);
  };
  
  // 切换到下一个月
  const gotoNextMonth = () => {
    if (isSwitching.current) return;
    isSwitching.current = true;
    
    let newYear = year;
    let newMonth = month;
    
    if (month === 11) {
      newYear = year + 1;
      newMonth = 0;
    } else {
      newMonth = month + 1;
    }
    
    setYear(newYear);
    setMonth(newMonth);
    onMonthChange?.(newYear, newMonth);
    
    // 快速重置标记，允许连续滑动
    setTimeout(() => {
      isSwitching.current = false;
    }, 50);
  };
  
  // 切换折叠状态
  const toggleCollapse = (shouldCollapse?: boolean) => {
    const newState = shouldCollapse !== undefined ? shouldCollapse : !isCollapsed;
    setIsCollapsed(newState);
    
    // 使用 withSpring，调整参数避免过度过冲
    calendarHeight.value = withSpring(
      newState ? WEEK_HEIGHT : MONTH_HEIGHT,
      { 
        damping: 30,      // 增加阻尼，减少震荡
        stiffness: 150,   // 降低弹性系数，更柔和
        mass: 0.8,        // 降低质量，响应更快
      }
    );
    
    onCollapseChange?.(newState);
    
    if (newState) {
      // 折叠时自动定位到今天
      const today = new Date();
      const todayYear = today.getFullYear();
      const todayMonth = today.getMonth();
      
      // 自动选中今天
      onDateSelect?.(today);
      
      // 如果不在当前月，切换到当前月
      if (year !== todayYear || month !== todayMonth) {
        setYear(todayYear);
        setMonth(todayMonth);
        onMonthChange?.(todayYear, todayMonth);
      }
    }
  };
  
  // 月份变化后重置位置（关键：瞬间重置，无动画）
  useEffect(() => {
    translateX.value = -CALENDAR_WIDTH; // 直接设置，不用动画
  }, [year, month, translateX]);
  
  // 手势处理
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      // 每次手势开始时重置预加载标记
      hasPreloaded.current = null;
    })
    .onUpdate((event) => {
      const isHorizontal = Math.abs(event.translationX) > Math.abs(event.translationY);
      
      if (isHorizontal && !isCollapsed) {
        // 横向滑动 - 从中间位置(-CALENDAR_WIDTH)开始，添加0.5倍阻尼（更跟手）
        translateX.value = -CALENDAR_WIDTH + event.translationX * 0.5;
        
        // 【预加载策略】当滑动超过70%时，提前触发数据更新
        // 这样在手势结束时，新的缓冲区已经准备好了
        const preloadThreshold = CALENDAR_WIDTH * 0.7;
        
        if (event.translationX < -preloadThreshold && 
            !isSwitching.current && 
            hasPreloaded.current !== 'next') {
          // 向左滑动超过阈值，提前加载下一个月（仅触发一次）
          hasPreloaded.current = 'next';
          runOnJS(gotoNextMonth)();
        } else if (event.translationX > preloadThreshold && 
                   !isSwitching.current && 
                   hasPreloaded.current !== 'prev') {
          // 向右滑动超过阈值，提前加载上一个月（仅触发一次）
          hasPreloaded.current = 'prev';
          runOnJS(gotoPrevMonth)();
        }
      }
    })
    .onEnd((event) => {
      const isHorizontal = Math.abs(event.translationX) > Math.abs(event.translationY);
      
      if (isHorizontal && !isCollapsed) {
        // 横向滑动结束 - 判断是否需要切换月份
        // 判断条件：滑动距离 或 滑动速度
        const shouldGoNext = (
          event.translationX < -SWIPE_THRESHOLD || 
          event.velocityX < -SWIPE_VELOCITY_THRESHOLD
        );
        const shouldGoPrev = (
          event.translationX > SWIPE_THRESHOLD || 
          event.velocityX > SWIPE_VELOCITY_THRESHOLD
        );
        
        if (shouldGoNext) {
          // 向左滑 - 切换到下一个月
          // 数据可能已在onUpdate中更新，这里只需确保切换完成并播放过渡动画
          if (!isSwitching.current) {
            runOnJS(gotoNextMonth)();
          }
          // 快速平滑回弹到中间位置（useEffect会同步重置）
          translateX.value = withTiming(-CALENDAR_WIDTH, { 
            duration: 150,
          });
        } else if (shouldGoPrev) {
          // 向右滑 - 切换到上一个月
          if (!isSwitching.current) {
            runOnJS(gotoPrevMonth)();
          }
          translateX.value = withTiming(-CALENDAR_WIDTH, { 
            duration: 150,
          });
        } else {
          // 回弹到当前月（未达到切换阈值）
          translateX.value = withSpring(-CALENDAR_WIDTH, { 
            damping: 25, 
            stiffness: 180 
          });
        }
      } else {
        // 纵向滑动 - 折叠/展开
        if (event.translationY < -VERTICAL_SWIPE_THRESHOLD && !isCollapsed) {
          runOnJS(toggleCollapse)(true);
        } else if (event.translationY > VERTICAL_SWIPE_THRESHOLD && isCollapsed) {
          runOnJS(toggleCollapse)(false);
        }
        translateX.value = withSpring(-CALENDAR_WIDTH, { damping: 25, stiffness: 180 });
      }
      
      // 手势结束后重置预加载标记
      hasPreloaded.current = null;
    });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  
  const heightAnimatedStyle = useAnimatedStyle(() => ({
    height: calendarHeight.value,
    overflow: 'hidden',
  }));
  
  const handleDayPress = (day: CalendarDay) => {
    onDateSelect?.(day.date);
  };
  
  // 渲染单个日期
  const renderDay = (day: CalendarDay, index: number, showWeekday: boolean = false) => {
    const isToday = day.isToday;
    const isSelected = selectedDate ? isSameDay(day.date, selectedDate) : false;
    
    return (
      <Pressable
        key={`${day.date.toISOString()}-${index}`}
        onPress={() => handleDayPress(day)}
        style={({ pressed }) => [
          styles.dayCell,
          showWeekday && styles.dayCellCollapsed,
          pressed && { opacity: 0.5 },
        ]}
      >
        {/* 折叠态：选中日期的高亮背景 */}
        {isCollapsed && isSelected && (
          <View 
            style={[
              styles.selectedBackgroundWithWeekday,
              { 
                backgroundColor: `${accentColor}15`,
                borderColor: accentColor,
              }
            ]} 
          />
        )}
        
        {/* 展开态：今天的圆形背景 */}
        {!isCollapsed && isToday && (
          <View 
            style={[
              styles.todayBackground,
              { backgroundColor: accentColor }
            ]} 
          />
        )}
        
        {/* 展开态：选中日期的圆形边框 */}
        {!isCollapsed && isSelected && !isToday && (
          <View 
            style={[
              styles.selectedBorder,
              { borderColor: accentColor }
            ]} 
          />
        )}
        
        {/* 周几标签（仅在折叠态显示） */}
        {showWeekday && (
          <Text
            style={[
              styles.weekdayInCell,
              { color: textSecondaryColor },
              day.weekday === todayWeekdayIndex && { color: accentColor },
            ]}
          >
            {weekdays[day.weekday]}
          </Text>
        )}
        
        {/* 日期数字 */}
        <Text
          style={[
            styles.dayText,
            showWeekday && { marginTop: 22 },
            day.isCurrentMonth && { color: textColor },
            !day.isCurrentMonth && { color: textSecondaryColor, opacity: 0.5 },
            isToday && !isCollapsed && { color: '#FFFFFF', fontWeight: '600' },
          ]}
        >
          {day.day}
        </Text>
      </Pressable>
    );
  };
  
  // 渲染月视图
  const renderMonthView = (days: CalendarDay[], key: string) => (
    <View key={key} style={styles.monthView}>
      <View style={styles.daysGrid}>
        {days.map((day, index) => renderDay(day, index, false))}
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {/* 周标题行（仅在展开态显示） */}
      {!isCollapsed && (
        <View style={styles.weekdayRow}>
          {weekdays.map((weekday, index) => (
            <View key={weekday} style={styles.weekdayCell}>
              <Text 
                style={[
                  styles.weekdayText, 
                  { color: textSecondaryColor },
                  index === todayWeekdayIndex && { color: accentColor }
                ]}
              >
                {weekday}
              </Text>
            </View>
          ))}
        </View>
      )}
      
      {/* 日期网格（可滑动、可折叠） */}
      <GestureDetector gesture={panGesture}>
        <View style={styles.calendarWrapper}>
          <Animated.View style={heightAnimatedStyle}>
            {isCollapsed ? (
              // 折叠态：只显示当前周
              <View style={styles.daysGrid}>
                {currentWeekDays.map((day, index) => renderDay(day, index, true))}
              </View>
            ) : (
              // 展开态：显示三个月视图（无限轮播）
              <Animated.View style={[styles.monthsContainer, animatedStyle]}>
                {renderMonthView(prevMonthDays, 'prev')}
                {renderMonthView(currentMonthDays, 'current')}
                {renderMonthView(nextMonthDays, 'next')}
              </Animated.View>
            )}
          </Animated.View>
        </View>
      </GestureDetector>
      
      {/* 折叠提示指示器（可点击） */}
      <Pressable 
        style={styles.indicatorContainer}
        onPress={() => toggleCollapse()}
      >
        <View style={[styles.indicator, { backgroundColor: accentColor }]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  weekdayText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  calendarWrapper: {
    width: '100%',
    overflow: 'hidden',
  },
  monthsContainer: {
    width: CALENDAR_WIDTH * 3,
    flexDirection: 'row',
  },
  monthView: {
    width: CALENDAR_WIDTH,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: DAY_CELL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayCellCollapsed: {
    height: WEEK_HEIGHT,
    paddingTop: 10,
    paddingBottom: 10,
  },
  todayBackground: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedBorder: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  selectedBackgroundWithWeekday: {
    position: 'absolute',
    top: 4,
    right: 4,
    bottom: 4,
    left: 4,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  weekdayInCell: {
    position: 'absolute',
    top: 13,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dayText: {
    fontSize: 19,
    textAlign: 'center',
    fontWeight: '600',
  },
  indicatorContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  indicator: {
    width: 48,
    height: 5,
    borderRadius: 2.5,
  },
});
