import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useDraggableButton } from '@/utils/use-draggable-button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, FadeIn, FadeOut, SlideInDown, SlideInLeft, SlideInRight, SlideOutDown, SlideOutLeft, SlideOutRight, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface AddTodosButtonProps {
  onAdd?: (type: 'todo' | 'course', date: Date) => void;
  style?: ViewStyle;
  selectedDate?: Date; // 选中的日期
}

export function AddTodosButton({ onAdd, style, selectedDate }: AddTodosButtonProps) {
  const { t } = useI18n('calendar');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<'todo' | 'course'>('todo');
  const previousType = useRef<'todo' | 'course'>('todo');
  
  // 待办表单状态
  const [todoTitle, setTodoTitle] = useState('');
  const [todoSubtitle, setTodoSubtitle] = useState('');
  const [todoDueTime, setTodoDueTime] = useState('');
  
  // 课程表单状态
  const [courseName, setCourseName] = useState('');
  const [courseLocation, setCourseLocation] = useState('');
  const [courseStartTime, setCourseStartTime] = useState('');
  const [courseEndTime, setCourseEndTime] = useState('');
  
  // 使用传入的日期，如果没有则使用当前日期
  const currentDate = selectedDate || new Date();
  
  const accentColor = useThemeColor({}, 'accent');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const cardBackgroundColor = useThemeColor({}, 'card');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({ light: '#E8E8ED', dark: '#333' }, 'cardBorder');
  const switchBgColor = useThemeColor({ light: '#F5F5F7', dark: '#1C1C1E' }, 'backgroundSecondary');

  // 白色滑块动画
  const slidePosition = useSharedValue(selectedType === 'todo' ? 0 : 1);

  useEffect(() => {
    slidePosition.value = withTiming(selectedType === 'todo' ? 0 : 1, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [selectedType, slidePosition]);

  const slideAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: slidePosition.value * 34,
        },
      ],
    };
  });

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  // 使用拖拽 hook
  const { gesture, animatedStyle } = useDraggableButton({
    onPress: handleOpenModal,
  });

  const handleCloseModal = () => {
    setIsModalVisible(false);
    // 清空表单
    resetForm();
  };

  const resetForm = () => {
    setTodoTitle('');
    setTodoSubtitle('');
    setTodoDueTime('');
    setCourseName('');
    setCourseLocation('');
    setCourseStartTime('');
    setCourseEndTime('');
  };

  const handleConfirm = () => {
    // 暂时不实现功能，只关闭模态框
    onAdd?.(selectedType, currentDate);
    handleCloseModal();
  };

  const formatDate = () => {
    return t('add_todo.date_format', {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate(),
    });
  };

  const handleTypeChange = (type: 'todo' | 'course') => {
    previousType.current = selectedType;
    setSelectedType(type);
  };

  // 根据切换方向决定动画
  const getEnteringAnimation = () => {
    if (selectedType === 'course') {
      return SlideInLeft.duration(200);
    } else {
      return SlideInRight.duration(200);
    }
  };

  const getExitingAnimation = () => {
    if (previousType.current === 'todo' && selectedType === 'course') {
      return SlideOutLeft.duration(200);
    } else {
      return SlideOutRight.duration(200);
    }
  };

  return (
    <>
      {/* 圆形按钮 */}
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.button,
            { backgroundColor: accentColor },
            style,
            animatedStyle,
          ]}
        >
          <MaterialIcons name="add" size={32} color="#FFFFFF" />
        </Animated.View>
      </GestureDetector>

      {/* 半屏模态框 */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        {/* 遮罩层 */}
        <Pressable
          style={styles.overlay}
          onPress={handleCloseModal}
        >
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={[styles.overlayBackground, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
          />
        </Pressable>

        {/* 半屏内容 */}
        <Animated.View
          entering={SlideInDown.duration(300).springify()}
          exiting={SlideOutDown.duration(250)}
          style={[styles.modalContent, { backgroundColor: cardBackgroundColor }]}
        >
          {/* 顶部区域 */}
          <View style={styles.header}>
            {/* 日期选择器 */}
            <TouchableOpacity style={styles.dateSelector} activeOpacity={0.7}>
              <Text style={[styles.dateText, { color: textColor }]}>
                {formatDate()}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color={accentColor} />
            </TouchableOpacity>

            {/* 关闭按钮 */}
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor }]}
              onPress={handleCloseModal}
              activeOpacity={0.7}
            >
              <MaterialIcons name="close" size={24} color={textSecondaryColor} />
            </TouchableOpacity>
          </View>

          {/* 内容区域 */}
          <View style={styles.content}>
            {selectedType === 'todo' ? (
              // 待办表单
              <Animated.ScrollView
                key="todo-form"
                entering={getEnteringAnimation()}
                exiting={getExitingAnimation()}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.formContainer}>
                {/* 标题 */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: textColor }]}>
                    {t('add_todo.todo_form.title')}
                  </Text>
                  <View style={[styles.inputWrapper, { backgroundColor, borderColor }]}>
                    <MaterialIcons
                      name="title"
                      size={22}
                      color={textSecondaryColor}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: textColor }]}
                      placeholder={t('add_todo.todo_form.title_placeholder')}
                      placeholderTextColor={textSecondaryColor}
                      value={todoTitle}
                      onChangeText={setTodoTitle}
                    />
                  </View>
                </View>

                {/* 备注 */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: textColor }]}>
                    {t('add_todo.todo_form.subtitle')}
                  </Text>
                  <View style={[styles.inputWrapper, styles.textAreaWrapper, { backgroundColor, borderColor }]}>
                    <MaterialIcons
                      name="notes"
                      size={22}
                      color={textSecondaryColor}
                      style={[styles.inputIcon, styles.textAreaIcon]}
                    />
                    <TextInput
                      style={[styles.input, styles.textArea, { color: textColor }]}
                      placeholder={t('add_todo.todo_form.subtitle_placeholder')}
                      placeholderTextColor={textSecondaryColor}
                      value={todoSubtitle}
                      onChangeText={setTodoSubtitle}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                {/* 截止时间 */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: textColor }]}>
                    {t('add_todo.todo_form.due_time')}
                  </Text>
                  <View style={[styles.inputWrapper, { backgroundColor, borderColor }]}>
                    <MaterialIcons
                      name="access-time"
                      size={22}
                      color={textSecondaryColor}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: textColor }]}
                      placeholder={t('add_todo.todo_form.due_time_placeholder')}
                      placeholderTextColor={textSecondaryColor}
                      value={todoDueTime}
                      onChangeText={setTodoDueTime}
                    />
                  </View>
                </View>
              </View>
              </Animated.ScrollView>
            ) : (
              // 课程表单
              <Animated.ScrollView
                key="course-form"
                entering={getEnteringAnimation()}
                exiting={getExitingAnimation()}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.formContainer}>
                {/* 课程名称 */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: textColor }]}>
                    {t('add_todo.course_form.name')}
                  </Text>
                  <View style={[styles.inputWrapper, { backgroundColor, borderColor }]}>
                    <MaterialIcons
                      name="school"
                      size={22}
                      color={textSecondaryColor}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: textColor }]}
                      placeholder={t('add_todo.course_form.name_placeholder')}
                      placeholderTextColor={textSecondaryColor}
                      value={courseName}
                      onChangeText={setCourseName}
                    />
                  </View>
                </View>

                {/* 教室 */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: textColor }]}>
                    {t('add_todo.course_form.location')}
                  </Text>
                  <View style={[styles.inputWrapper, { backgroundColor, borderColor }]}>
                    <MaterialIcons
                      name="location-on"
                      size={22}
                      color={textSecondaryColor}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: textColor }]}
                      placeholder={t('add_todo.course_form.location_placeholder')}
                      placeholderTextColor={textSecondaryColor}
                      value={courseLocation}
                      onChangeText={setCourseLocation}
                    />
                  </View>
                </View>

                {/* 时间段 */}
                <View style={styles.timeRow}>
                  <View style={[styles.inputGroup, styles.timeInputGroup]}>
                    <Text style={[styles.label, { color: textColor }]}>
                      {t('add_todo.course_form.start_time')}
                    </Text>
                    <View style={[styles.inputWrapper, { backgroundColor, borderColor }]}>
                      <MaterialIcons
                        name="schedule"
                        size={22}
                        color={textSecondaryColor}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[styles.input, { color: textColor }]}
                        placeholder={t('add_todo.course_form.start_time_placeholder')}
                        placeholderTextColor={textSecondaryColor}
                        value={courseStartTime}
                        onChangeText={setCourseStartTime}
                        keyboardType="numbers-and-punctuation"
                      />
                    </View>
                  </View>

                  <View style={[styles.inputGroup, styles.timeInputGroup]}>
                    <Text style={[styles.label, { color: textColor }]}>
                      {t('add_todo.course_form.end_time')}
                    </Text>
                    <View style={[styles.inputWrapper, { backgroundColor, borderColor }]}>
              <MaterialIcons
                        name="schedule"
                        size={22}
                        color={textSecondaryColor}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[styles.input, { color: textColor }]}
                        placeholder={t('add_todo.course_form.end_time_placeholder')}
                        placeholderTextColor={textSecondaryColor}
                        value={courseEndTime}
                        onChangeText={setCourseEndTime}
                        keyboardType="numbers-and-punctuation"
                      />
                    </View>
                  </View>
                </View>
              </View>
              </Animated.ScrollView>
            )}
          </View>

          {/* 底部：选项卡 + 确定按钮 */}
          <View style={styles.bottomBar}>
            <TouchableOpacity 
              style={[styles.switchContainer, { backgroundColor: switchBgColor }]}
              onPress={() => handleTypeChange(selectedType === 'todo' ? 'course' : 'todo')}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.switchSlider,
                  { backgroundColor: cardBackgroundColor },
                  slideAnimatedStyle,
                ]}
              />

              <MaterialIcons
                name="check-circle-outline"
                size={22}
                color={selectedType === 'todo' ? textColor : textSecondaryColor}
                style={styles.iconLeft}
              />

              <View style={styles.switchTextContainer}>
                {selectedType === 'todo' ? (
                  <Animated.Text
                    key="todo-text"
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(200)}
                    style={[styles.switchText, { color: textColor }]}
                  >
                    {t('add_todo.todo')}
                  </Animated.Text>
                ) : (
                  <Animated.Text
                    key="course-text"
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(200)}
                    style={[styles.switchText, { color: textColor }]}
                  >
                    {t('add_todo.course')}
                  </Animated.Text>
                )}
              </View>

              <MaterialIcons
                name="school"
                size={22}
                color={selectedType === 'course' ? textColor : textSecondaryColor}
                style={styles.iconRight}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: accentColor }]}
              onPress={handleConfirm}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmButtonText}>{t('add_todo.confirm')}</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  // 模态框
  overlay: {
    flex: 1,
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // 顶部区域
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    paddingBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  textAreaWrapper: {
    height: 100,
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  inputIcon: {
    marginRight: 12,
  },
  textAreaIcon: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  textArea: {
    paddingVertical: 0,
    minHeight: 70,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInputGroup: {
    flex: 1,
  },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 112,
    height: 44,
    borderRadius: 22,
    padding: 4,
    position: 'relative',
    gap: 4,
  },
  switchSlider: {
    position: 'absolute',
    left: 4,
    top: 4,
    width: 70,
    height: 36,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconLeft: {
    zIndex: 2,
    paddingLeft: 6,
  },
  iconRight: {
    zIndex: 2,
    paddingRight: 6,
  },
  switchTextContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  switchText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.3,
  },

  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: 114,
    height: 44,
    borderRadius: 22,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});

