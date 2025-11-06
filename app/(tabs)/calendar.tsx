import { AddTodosButton, CalendarTodos, CalendarView, DateHeader } from '@/components/calendar';
import { CourseDetailPanel } from '@/components/calendar/course-detail-panel';
import { useThemeColor } from '@/hooks/use-theme-color';
import { fetchDayData } from '@/utils/mock-data';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const [displayMonth, setDisplayMonth] = useState(new Date().getMonth());
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Todos 完成状态（临时存储）
  const [todosState, setTodosState] = useState<Record<string, boolean>>({});
  
  // 课程详情面板状态
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(undefined);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  const cardBackgroundColor = useThemeColor({}, 'card');
  const pageBackgroundColor = useThemeColor({}, 'background'); // 页面背景
  const handleBackgroundColor = useThemeColor({}, 'background'); // 手柄背景色（与页面背景相同）
  const accentColor = useThemeColor({}, 'accent');

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

  // 获取当前选中日期的数据
  const currentData = useMemo(() => {
    const dateToUse = selectedDate || new Date();
    
    // 调用 Mock API 获取数据
    const data = fetchDayData(dateToUse);
    
    // 应用完成状态
    return {
      courses: data.courses,
      todos: data.todos.map(todo => ({
        ...todo,
        completed: todosState[todo.id] ?? todo.completed,
      })),
    };
  }, [selectedDate, todosState]);

  const handleTodoToggle = (id: string) => {
    setTodosState(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCoursePress = (id: string) => {
    setSelectedCourseId(id);
    setIsPanelVisible(true);
  };

  const handlePanelClose = () => {
    setIsPanelVisible(false);
    setSelectedCourseId(undefined);
  };

  // 拖动手势处理
  const DRAG_THRESHOLD = 50; // 拖动距离阈值（像素）
  const VELOCITY_THRESHOLD = 500; // 速度阈值（像素/秒）
  const MAX_DRAG_DISTANCE = 80; // 最大拖动距离限制（像素）
  const indicatorScale = useSharedValue(1);
  const dragOffset = useSharedValue(0); // 拖动偏移量
  const isCollapsedShared = useSharedValue(isCollapsed ? 1 : 0); // 用于手势中访问最新状态
  
  // 同步折叠状态到 shared value
  isCollapsedShared.value = isCollapsed ? 1 : 0;
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      // 拖动开始时放大指示器（轻微的弹簧效果）
      indicatorScale.value = withSpring(1.08, { damping: 30, stiffness: 300 });
    })
    .onUpdate((event) => {
      // 实时更新拖动偏移，添加阻尼效果
      // 折叠状态：只能向下拖（展开）
      // 展开状态：只能向上拖（折叠）
      const collapsed = isCollapsedShared.value === 1;
      
      if (collapsed) {
        // 折叠状态，只响应向下拖动，限制最大距离
        const rawOffset = event.translationY * 0.6;
        dragOffset.value = Math.max(0, Math.min(rawOffset, MAX_DRAG_DISTANCE));
      } else {
        // 展开状态，只响应向上拖动，限制最大距离
        const rawOffset = event.translationY * 0.6;
        dragOffset.value = Math.min(0, Math.max(rawOffset, -MAX_DRAG_DISTANCE));
      }
    })
    .onEnd((event) => {
      // 恢复指示器大小
      indicatorScale.value = withSpring(1, { damping: 30, stiffness: 300 });
      
      const collapsed = isCollapsedShared.value === 1;
      
      // 判断是否应该切换状态
      const shouldToggle = 
        Math.abs(event.translationY) > DRAG_THRESHOLD || 
        Math.abs(event.velocityY) > VELOCITY_THRESHOLD;
      
      if (shouldToggle) {
        // 向上拖动（translationY < 0）-> 折叠
        // 向下拖动（translationY > 0）-> 展开
        if ((event.translationY < 0 && !collapsed) || (event.translationY > 0 && collapsed)) {
          runOnJS(toggleCollapse)();
        }
      }
      
      // 回弹到原位，使用与日历卡片一致的参数
      dragOffset.value = withSpring(0, { 
        damping: 30, 
        stiffness: 150,
        mass: 0.8,
      });
    });
  
  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: indicatorScale.value }],
  }));
  
  const calendarCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dragOffset.value }],
  }));

  return (
    <View style={[styles.wrapper, { backgroundColor: pageBackgroundColor }]}>
      {/* 日历卡片（包含顶部区域和日历视图，可拖动） */}
      <Animated.View style={[styles.calendarCard, { backgroundColor: cardBackgroundColor }, calendarCardAnimatedStyle]}>
        {/* 预留区域（用于拖拽时填充，避免露出背景色） */}
        <View style={[styles.dragBuffer, { backgroundColor: cardBackgroundColor }]} />
        
        {/* 顶部区域（包含 Safe Area 和 Header） */}
        <View style={styles.topArea}>
          <DateHeader 
            selectedDate={selectedDate}
            displayYear={displayYear}
            displayMonth={displayMonth}
            isCollapsed={isCollapsed}
          />
        </View>
        
        {/* 日历视图 */}
        <CalendarView 
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onMonthChange={handleMonthChange}
          onCollapseChange={handleCollapseChange}
          isCollapsed={isCollapsed}
        />
      </Animated.View>
      
      {/* 折叠提示指示器（在卡片外部，紧贴卡片，支持拖动） */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[
          styles.indicatorContainer, 
          { backgroundColor: handleBackgroundColor },
          calendarCardAnimatedStyle
        ]}>
          <Animated.View style={[styles.indicator, { backgroundColor: accentColor }, indicatorAnimatedStyle]} />
        </Animated.View>
      </GestureDetector>
      
      {/* 课程和待办事项 */}
      <View style={[styles.todosContainer, { backgroundColor: cardBackgroundColor }]}>
        <CalendarTodos 
          courses={currentData.courses}
          todos={currentData.todos}
          onTodoToggle={handleTodoToggle}
          onCoursePress={handleCoursePress}
        />
      </View>

      {/* 课程详情面板 */}
      <CourseDetailPanel 
        visible={isPanelVisible}
        onClose={handlePanelClose}
        courseId={selectedCourseId}
      />

      {/* 添加待办按钮（可拖动，自动贴边） */}
      <AddTodosButton 
        selectedDate={selectedDate || new Date()}
        style={{
          position: 'absolute',
          bottom: 130,
          zIndex: 999,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    overflow: 'hidden', // 隐藏超出部分
  },
  calendarCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    marginTop: -80, // 隐藏预留区域
  },
  dragBuffer: {
    height: 80, // 预留区域高度
  },
  topArea: {
    paddingTop: 60,
  },
  indicatorContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todosContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  indicator: {
    width: 48,
    height: 6,
    borderRadius: 4,
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

