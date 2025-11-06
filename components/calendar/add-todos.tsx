import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useDraggableButton } from '@/utils/use-draggable-button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

interface AddTodosButtonProps {
  onAdd?: (type: 'todo' | 'course', date: Date) => void;
  style?: ViewStyle;
  selectedDate?: Date; // 选中的日期，与日历联动
}

export function AddTodosButton({ onAdd, style, selectedDate }: AddTodosButtonProps) {
  const { t } = useI18n('calendar');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<'todo' | 'course'>('todo');
  
  // 使用传入的日期，如果没有则使用当前日期
  const currentDate = selectedDate || new Date();
  
  const accentColor = useThemeColor({}, 'accent');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const cardBackgroundColor = useThemeColor({}, 'card');
  const backgroundColor = useThemeColor({}, 'background');

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  // 使用拖拽 hook
  const { gesture, animatedStyle } = useDraggableButton({
    onPress: handleOpenModal,
  });

  const handleCloseModal = () => {
    setIsModalVisible(false);
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

          {/* 选项卡 */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedType === 'todo' && [styles.tabActive, { backgroundColor }],
              ]}
              onPress={() => setSelectedType('todo')}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="check-circle-outline"
                size={24}
                color={selectedType === 'todo' ? textColor : textSecondaryColor}
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    color: selectedType === 'todo' ? textColor : textSecondaryColor,
                  },
                ]}
              >
                {t('add_todo.todo')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                selectedType === 'course' && [styles.tabActive, { backgroundColor }],
              ]}
              onPress={() => setSelectedType('course')}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="school"
                size={24}
                color={selectedType === 'course' ? textColor : textSecondaryColor}
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    color: selectedType === 'course' ? textColor : textSecondaryColor,
                  },
                ]}
              >
                {t('add_todo.course')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 内容区域（待实现） */}
          <View style={styles.content}>
            {/* 这里后续填充表单内容 */}
          </View>

          {/* 底部确定按钮 */}
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: accentColor }]}
            onPress={handleConfirm}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmButtonText}>{t('add_todo.confirm')}</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
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
    height: '65%',
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

  // 选项卡
  tabs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  tabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },

  // 内容区域
  content: {
    flex: 1,
  },

  // 确定按钮
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: 16,
    marginTop: 'auto',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});

