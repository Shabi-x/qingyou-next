import { useThemeColor } from '@/hooks/use-theme-color';
import { generateCalendarDays, getWeekContainingDate, isDateInCurrentWeek, isSameDay, type CalendarDay } from '@/utils/calendar';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
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
  backgroundColor?: string;
  isCollapsed?: boolean; // 支持受控模式
}

export function CalendarView({ selectedDate, onDateSelect, onMonthChange, onCollapseChange, backgroundColor, isCollapsed: externalIsCollapsed }: CalendarViewProps) {
  const [year, setYear] = useState(() => (selectedDate || new Date()).getFullYear());
  const [month, setMonth] = useState(() => (selectedDate || new Date()).getMonth());
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  
  // 使用外部状态（如果提供）或内部状态
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const accentColor = useThemeColor({}, 'accent');
  
  // 始终定位在中间月（索引1）
  const translateX = useSharedValue(-CALENDAR_WIDTH);
  const calendarHeight = useSharedValue(MONTH_HEIGHT);
  
  // 为六行日期创建动画值（透明度和位移）
  const row0Opacity = useSharedValue(1);
  const row0TranslateY = useSharedValue(0);
  const row1Opacity = useSharedValue(1);
  const row1TranslateY = useSharedValue(0);
  const row2Opacity = useSharedValue(1);
  const row2TranslateY = useSharedValue(0);
  const row3Opacity = useSharedValue(1);
  const row3TranslateY = useSharedValue(0);
  const row4Opacity = useSharedValue(1);
  const row4TranslateY = useSharedValue(0);
  const row5Opacity = useSharedValue(1);
  const row5TranslateY = useSharedValue(0);
  
  const rowAnimations = [
    { opacity: row0Opacity, translateY: row0TranslateY },
    { opacity: row1Opacity, translateY: row1TranslateY },
    { opacity: row2Opacity, translateY: row2TranslateY },
    { opacity: row3Opacity, translateY: row3TranslateY },
    { opacity: row4Opacity, translateY: row4TranslateY },
    { opacity: row5Opacity, translateY: row5TranslateY },
  ];
  
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
  
  // 计算当前选中日期所在的行索引（0-5）
  const getSelectedWeekRowIndex = () => {
    if (!selectedDate) return 0;
    const weekIndex = currentMonthDays.findIndex(day => isSameDay(day.date, selectedDate));
    return weekIndex >= 0 ? Math.floor(weekIndex / 7) : 0;
  };
  
  // 切换折叠状态
  const toggleCollapse = (shouldCollapse?: boolean) => {
    const newState = shouldCollapse !== undefined ? shouldCollapse : !isCollapsed;
    const selectedRow = getSelectedWeekRowIndex();
    
    // 如果是受控模式，通知外部；否则更新内部状态
    if (externalIsCollapsed !== undefined) {
      onCollapseChange?.(newState);
    } else {
      setInternalIsCollapsed(newState);
      onCollapseChange?.(newState);
    }
    
    // 使用 withSpring，调整参数避免过度过冲
    calendarHeight.value = withSpring(
      newState ? WEEK_HEIGHT : MONTH_HEIGHT,
      { 
        damping: 30,      // 增加阻尼，减少震荡
        stiffness: 150,   // 降低弹性系数，更柔和
        mass: 0.8,        // 降低质量，响应更快
      }
    );
    
    // 执行行动画
    const animationConfig = {
      damping: 28,
      stiffness: 130,
      mass: 0.9,
    };
    
    rowAnimations.forEach((row, index) => {
      if (newState) {
        // 折叠：非选中行淡出并稍微向上移动
        if (index === selectedRow) {
          row.opacity.value = withSpring(1, animationConfig);
          row.translateY.value = withSpring(0, animationConfig);
        } else {
          row.opacity.value = withSpring(0, { ...animationConfig, damping: 22 });
          // 稍微向上移动一小段距离
          row.translateY.value = withSpring(-15, animationConfig);
        }
      } else {
        // 展开：所有行从稍微向上的位置向下滑入
        // 立即设置初始位置（稍微向上）
        row.translateY.value = -28;
        row.opacity.value = 0;
        
        // 带延迟的向下滑入动画
        const delayTime = index * 30; // 从上到下依次展开
        row.opacity.value = withDelay(
          delayTime,
          withSpring(1, animationConfig)
        );
        row.translateY.value = withDelay(
          delayTime,
          withSpring(0, animationConfig)
        );
      }
    });
    
    onCollapseChange?.(newState);
    
    if (newState) {
      // 折叠时智能处理选中日期
      const today = new Date();
      const todayYear = today.getFullYear();
      const todayMonth = today.getMonth();
      
      // 如果选中的日期不在当前周内，自动选中今天
      if (!isDateInCurrentWeek(selectedDate)) {
        onDateSelect?.(today);
      }
      
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
  
  // 外部折叠状态变化时，同步动画
  useEffect(() => {
    if (externalIsCollapsed !== undefined) {
      const selectedRow = getSelectedWeekRowIndex();
      const animationConfig = {
        damping: 28,
        stiffness: 130,
        mass: 0.9,
      };
      
      // 更新高度动画
      calendarHeight.value = withSpring(
        externalIsCollapsed ? WEEK_HEIGHT : MONTH_HEIGHT,
        { 
          damping: 30,
          stiffness: 150,
          mass: 0.8,
        }
      );
      
      // 更新行动画
      rowAnimations.forEach((row, index) => {
        if (externalIsCollapsed) {
          if (index === selectedRow) {
            row.opacity.value = withSpring(1, animationConfig);
            row.translateY.value = withSpring(0, animationConfig);
          } else {
            row.opacity.value = withSpring(0, { ...animationConfig, damping: 22 });
            row.translateY.value = withSpring(-15, animationConfig);
          }
        } else {
          row.translateY.value = -28;
          row.opacity.value = 0;
          const delayTime = index * 30;
          row.opacity.value = withDelay(delayTime, withSpring(1, animationConfig));
          row.translateY.value = withDelay(delayTime, withSpring(0, animationConfig));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalIsCollapsed]);
  
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
        // 使用与折叠动画一致的参数
        translateX.value = withSpring(-CALENDAR_WIDTH, { 
          damping: 30, 
          stiffness: 150,
          mass: 0.8,
        });
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
  
  // 为每一行创建动画样式
  const row0AnimatedStyle = useAnimatedStyle(() => ({
    opacity: row0Opacity.value,
    transform: [{ translateY: row0TranslateY.value }],
  }));
  const row1AnimatedStyle = useAnimatedStyle(() => ({
    opacity: row1Opacity.value,
    transform: [{ translateY: row1TranslateY.value }],
  }));
  const row2AnimatedStyle = useAnimatedStyle(() => ({
    opacity: row2Opacity.value,
    transform: [{ translateY: row2TranslateY.value }],
  }));
  const row3AnimatedStyle = useAnimatedStyle(() => ({
    opacity: row3Opacity.value,
    transform: [{ translateY: row3TranslateY.value }],
  }));
  const row4AnimatedStyle = useAnimatedStyle(() => ({
    opacity: row4Opacity.value,
    transform: [{ translateY: row4TranslateY.value }],
  }));
  const row5AnimatedStyle = useAnimatedStyle(() => ({
    opacity: row5Opacity.value,
    transform: [{ translateY: row5TranslateY.value }],
  }));
  
  const rowAnimatedStyles = [
    row0AnimatedStyle,
    row1AnimatedStyle,
    row2AnimatedStyle,
    row3AnimatedStyle,
    row4AnimatedStyle,
    row5AnimatedStyle,
  ];
  
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
          <>
            <View 
              style={[
                styles.selectedBackgroundWithWeekday,
                { 
                  backgroundColor: `${accentColor}15`,
                  borderColor: accentColor,
                }
              ]} 
            />
            {/* 底部圆点强调 */}
            <View 
              style={[
                styles.selectedDot,
                { backgroundColor: accentColor }
              ]} 
            />
          </>
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
            showWeekday && styles.dayTextCollapsed,
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
  
  // 渲染月视图（按行渲染，每行应用动画）
  const renderMonthView = (days: CalendarDay[], key: string) => {
    // 将42个日期分成6行，每行7天
    const rows = Array.from({ length: 6 }, (_, rowIndex) => 
      days.slice(rowIndex * 7, (rowIndex + 1) * 7)
    );
    
    return (
      <View key={key} style={styles.monthView}>
        {rows.map((rowDays, rowIndex) => (
          <Animated.View key={`row-${rowIndex}`} style={[styles.weekRow, rowAnimatedStyles[rowIndex]]}>
            {rowDays.map((day, dayIndex) => renderDay(day, rowIndex * 7 + dayIndex, false))}
          </Animated.View>
        ))}
      </View>
    );
  };
  
  return (
    <View style={[styles.container, backgroundColor && { backgroundColor }]}>
      {/* 周标题行（始终占据空间，折叠时隐藏） */}
      <View style={[styles.weekdayRow, isCollapsed && { opacity: 0 }]}>
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
      
      {/* 日期网格（可滑动、可折叠） */}
      <GestureDetector gesture={panGesture}>
        <View style={[
          styles.calendarWrapper,
          isCollapsed && { marginTop: -39 } // 微调对齐
        ]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingTop: 6,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
    lineHeight: 15, // 明确设置行高，确保高度可控
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
  weekRow: {
    flexDirection: 'row',
    width: '100%',
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
    top: 2,
    right: 2,
    bottom: 2,
    left: 2,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  selectedDot: {
    position: 'absolute',
    bottom: 7,
    width: 4,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
  },
  weekdayInCell: {
    position: 'absolute',
    top: 13, // 保持与高亮框 top(4) 的间距(9px)
    width: '100%',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
    lineHeight: 15, // 与 weekdayText 保持一致
    textAlign: 'center',
  },
  dayText: {
    fontSize: 19,
    textAlign: 'center',
    fontWeight: '600',
  },
  dayTextCollapsed: {
    position: 'absolute',
    top: 35, // weekdayInCell(13) + fontSize(15) + gap(7)
    width: '100%',
  },
});
