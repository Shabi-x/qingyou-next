import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/theme-context';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function WelcomeScreen() {
  const { colorScheme } = useTheme();
  const { t } = useI18n('auth');
  const insets = useSafeAreaInsets();
  
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  
  const isDark = colorScheme === 'dark';
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');

  // 动画值
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);

  useEffect(() => {
    // 延迟500ms后显示底部内容，从隐到显向上浮动
    const timer = setTimeout(() => {
      contentOpacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      });
      contentTranslateY.value = withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      });
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const handleGetStarted = () => {
    if (!agreedToTerms) {
      setShowReminderModal(true);
      return;
    }
    router.push('/(auth)/login');
  };

  const handleAgreeAndContinue = () => {
    setAgreedToTerms(true);
    setShowReminderModal(false);
    // 关闭弹窗后跳转到登录页
    setTimeout(() => {
      router.push('/(auth)/login');
    }, 300);
  };

  const openUserAgreement = () => {
    setShowReminderModal(false);
    setTimeout(() => {
      router.push('/(auth)/user-agreement');
    }, 300);
  };

  const openPrivacyPolicy = () => {
    setShowReminderModal(false);
    setTimeout(() => {
      router.push('/(auth)/privacy-policy');
    }, 300);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Logo 区域 */}
      <View style={styles.logoContainer}>
        <View style={[
          styles.logoPlaceholder,
          { backgroundColor: isDark ? '#333' : '#ddd' }
        ]} />
        <Text style={[styles.appTitle, { color: textColor }]}>
          {t('app_title')}
        </Text>
      </View>

      {/* 底部内容 */}
      <Animated.View 
        style={[
          styles.bottomContent,
          { paddingBottom: insets.bottom + 20 },
          animatedContentStyle,
        ]}
      >
        {/* 开始使用按钮 */}
        <Pressable
          onPress={handleGetStarted}
          style={({ pressed }) => [
            styles.startButton,
            { 
              backgroundColor: '#A3D65C',
              opacity: pressed ? 0.8 : 1,
            }
          ]}
        >
          <Text style={styles.startButtonText}>
            {t('get_started')}
          </Text>
        </Pressable>

        {/* 协议确认 */}
        <View style={styles.agreementContainer}>
          <Pressable
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            style={styles.checkboxRow}
          >
            <View style={[
              styles.checkbox,
              { borderColor: textSecondaryColor },
              agreedToTerms && { backgroundColor: '#A3D65C', borderColor: '#A3D65C' }
            ]}>
              {agreedToTerms && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <Text style={[styles.agreementText, { color: textSecondaryColor }]}>
              {t('agreement_prefix')}
              <Text 
                onPress={openUserAgreement}
                style={[styles.linkText, { color: '#A3D65C' }]}
              >
                {t('user_agreement')}
              </Text>
              {t('agreement_and')}
              <Text 
                onPress={openPrivacyPolicy}
                style={[styles.linkText, { color: '#A3D65C' }]}
              >
                {t('privacy_policy')}
              </Text>
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* 协议提醒弹窗 */}
      <Modal
        visible={showReminderModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReminderModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowReminderModal(false)}
        >
          <Pressable 
            style={[
              styles.modalContent,
              { 
                backgroundColor: isDark ? '#1C2128' : '#FFFFFF',
                paddingBottom: insets.bottom + 16,
              }
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />
            
            <Text style={[styles.modalTitle, { color: textColor }]}>
              {t('agreement_reminder')}
            </Text>

            {/* 条款列表 */}
            <View style={styles.termsRow}>
              <Pressable onPress={openUserAgreement}>
                <Text style={[styles.termLink, { color: '#A3D65C' }]}>
                  {t('user_agreement')}
                </Text>
              </Pressable>
              <Text style={[styles.termSeparator, { color: textSecondaryColor }]}> </Text>
              <Pressable onPress={openPrivacyPolicy}>
                <Text style={[styles.termLink, { color: '#A3D65C' }]}>
                  {t('privacy_policy')}
                </Text>
              </Pressable>
            </View>

            {/* 同意按钮 */}
            <Pressable
              onPress={handleAgreeAndContinue}
              style={[
                styles.modalButton,
                { backgroundColor: '#A3D65C' }
              ]}
            >
              <Text style={styles.modalButtonText}>
                {t('agree_and_continue')}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '20%',
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  bottomContent: {
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  agreementContainer: {
    marginTop: 16,
    width: '100%',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  agreementText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  startButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A3D65C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  termsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  termLink: {
    fontSize: 15,
  },
  termSeparator: {
    fontSize: 15,
    marginHorizontal: 4,
  },
  modalButton: {
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A3D65C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
