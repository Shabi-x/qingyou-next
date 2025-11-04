import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { CourseCard, type CourseItem } from './course-card';

export interface TodoItem {
  id: string;
  title: string;
  subtitle?: string;
  dueDate?: string;
  completed: boolean;
}

export { type CourseItem };

interface CalendarTodosProps {
  courses?: CourseItem[];
  todos?: TodoItem[];
  onTodoToggle?: (id: string) => void;
  onCoursePress?: (id: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(View);

export function CalendarTodos({ 
  courses = [], 
  todos = [],
  onTodoToggle,
  onCoursePress
}: CalendarTodosProps) {
  const { t } = useI18n('calendar');
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const accentColor = useThemeColor({}, 'accent');
  const itemBackgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'cardBorder');
  
  // 暗夜模式：有背景色（较浅的灰色），无边框
  // 白天模式：无背景色，有边框
  const isDark = colorScheme === 'dark';
  
  const titleMarginLeft = 20;

  const renderEmptyState = (type: 'course' | 'todo') => {
    const icon = type === 'course' ? 'school' : 'check-circle-outline';
    const text = type === 'course' ? t('no_courses') : t('no_todos');
    
    return (
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        style={[
          styles.emptyState, 
          { 
            backgroundColor: isDark ? itemBackgroundColor : 'transparent',
            borderColor: isDark ? 'transparent' : borderColor,
          }
        ]}
      >
        <MaterialIcons 
          name={icon as any} 
          size={48} 
          color={textSecondaryColor}
          style={styles.emptyIcon}
        />
        <Text style={[styles.emptyText, { color: textSecondaryColor }]}>
          {text}
        </Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 今日课程 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor, marginLeft: titleMarginLeft }]}>
            {t('today_courses')}
          </Text>
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <Animated.View
                key={course.id}
                entering={FadeInDown.delay(index * 50).springify()}
                layout={Layout.springify()}
              >
                <CourseCard 
                  course={course} 
                  onPress={onCoursePress}
                />
              </Animated.View>
            ))
          ) : (
            renderEmptyState('course')
          )}
        </View>

        {/* 今日待办 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor, marginLeft: titleMarginLeft }]}>
            {t('today_todos')}
          </Text>
          {todos.length > 0 ? (
            todos.map((todo, index) => (
              <AnimatedPressable
                key={todo.id}
                entering={FadeInDown.delay((courses.length + index) * 50).springify()}
                layout={Layout.springify()}
                style={[
                  styles.todoItem,
                  {
                    backgroundColor: isDark ? itemBackgroundColor : 'transparent',
                    borderColor: isDark ? 'transparent' : borderColor,
                  }
                ]}
              >
                <Animated.View
                  style={[
                    styles.checkbox,
                    { borderColor: textSecondaryColor },
                    todo.completed && { 
                      backgroundColor: accentColor,
                      borderColor: accentColor,
                      borderStyle: 'solid',
                    }
                  ]}
                  onTouchEnd={() => onTodoToggle?.(todo.id)}
                >
                  {todo.completed && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </Animated.View>
                <View style={styles.todoContent}>
                  <Text 
                    style={[
                      styles.todoTitle, 
                      { color: textColor },
                      todo.completed && styles.completedText
                    ]}
                  >
                    {todo.title}
                  </Text>
                  {todo.subtitle && (
                    <View style={styles.subtitleRow}>
                      <MaterialIcons 
                        name="sync" 
                        size={14} 
                        color={textSecondaryColor}
                      />
                      <Text style={[styles.todoSubtitle, { color: textSecondaryColor }]}>
                        {todo.subtitle}
                      </Text>
                    </View>
                  )}
                </View>
                {todo.dueDate && (
                  <Text style={[styles.todoDueDate, { color: textSecondaryColor }]}>
                    {todo.dueDate}
                  </Text>
                )}
              </AnimatedPressable>
            ))
          ) : (
            renderEmptyState('todo')
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 70,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.4,
    opacity: 0.5,
  },
  // 待办样式
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    gap: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  todoContent: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  todoSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  todoDueDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  // 空状态样式
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    borderWidth: 1,
  },
  emptyIcon: {
    opacity: 0.3,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.5,
  },
});
