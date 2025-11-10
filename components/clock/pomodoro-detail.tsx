/**
 * 半屏详情面板（80% 高度）
 */
import { useThemeColor } from '@/hooks/use-theme-color';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface PomodoroDetailProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  onShare?: () => void;
  children?: React.ReactNode;
}

export function PomodoroDetail({ visible, onClose, title, onShare, children }: PomodoroDetailProps) {
  const cardBackgroundColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');

  const overlayOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(400);

  React.useEffect(() => {
    if (visible) {
      overlayOpacity.value = withTiming(1, { duration: 220, easing: Easing.out(Easing.ease) });
      sheetTranslateY.value = withTiming(0, { duration: 320, easing: Easing.out(Easing.cubic) });
    } else {
      sheetTranslateY.value = withTiming(400, { duration: 240, easing: Easing.in(Easing.cubic) });
      overlayOpacity.value = withTiming(0, { duration: 180, easing: Easing.in(Easing.ease) });
    }
  }, [visible, overlayOpacity, sheetTranslateY]);

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, animatedOverlayStyle]}>
        <Pressable style={styles.overlayTouchable} onPress={onClose} />

        <Animated.View
          style={[styles.sheet, { backgroundColor: cardBackgroundColor }, animatedSheetStyle]}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerIconLeft} onPress={onClose} activeOpacity={0.8}>
              <MaterialIcons name="close" size={22} color={textSecondaryColor} />
            </TouchableOpacity>
            {!!title && (
              <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
                {title}
              </Text>
            )}
            <TouchableOpacity
              style={styles.headerIconRight}
              onPress={onShare}
              activeOpacity={0.8}
              disabled={!onShare}
            >
              <MaterialCommunityIcons
                name="arrow-right-bold-circle-outline"
                size={22}
                color={onShare ? textSecondaryColor : 'transparent'}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    height: '80%', // 80% 高度
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  header: {
    position: 'relative',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerIconLeft: {
    position: 'absolute',
    left: -6,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconRight: {
    position: 'absolute',
    right: -6,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
});

export default PomodoroDetail;


