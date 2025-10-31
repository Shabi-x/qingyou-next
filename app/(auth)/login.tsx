import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/contexts/theme-context';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function LoginScreen() {
  const { colorScheme } = useTheme();
  const { t } = useI18n('auth');
  const insets = useSafeAreaInsets();
  
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const isDark = colorScheme === 'dark';
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');

  const handleLogin = async () => {
    // TODO: 实现登录逻辑
    console.log('Login:', { account, password });
    
    // 登录成功后直接跳转到主应用
    router.replace('/(tabs)/calendar');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 10 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* 返回按钮 */}
          <AnimatedPressable 
            onPress={handleBack} 
            style={[
              styles.backButton,
              { 
                backgroundColor: cardBackground,
                shadowColor: isDark ? '#000' : '#999',
              }
            ]}
            entering={FadeInRight.delay(100).duration(400)}
          >
            <IconSymbol
              name="chevron.left"
              size={26}
              color={textColor}
            />
          </AnimatedPressable>

          {/* 标题区域 */}
          <Animated.View 
            entering={FadeInRight.delay(200).duration(500)}
            style={styles.headerContainer}
          >
            <Text style={[styles.title, { color: textColor }]}>
              {t('login_title')}
            </Text>
            <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
              {t('login_subtitle')}
            </Text>
          </Animated.View>

          {/* 表单区域 */}
          <Animated.View 
            entering={FadeInRight.delay(300).duration(500)}
            style={styles.formContainer}
          >
            {/* 统一身份认证账号 */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: textColor }]}>
                {t('unified_account')}
              </Text>
              <View style={[
                styles.inputWrapper,
                { 
                  backgroundColor: cardBackground,
                  borderColor: isDark ? '#333' : '#E8E8ED',
                }
              ]}>
                <IconSymbol
                  name="person.crop.circle"
                  size={22}
                  color={textSecondaryColor}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder={t('account_placeholder')}
                  placeholderTextColor={textSecondaryColor}
                  value={account}
                  onChangeText={setAccount}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* 统一身份认证密码 */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: textColor }]}>
                {t('unified_password')}
              </Text>
              <View style={[
                styles.inputWrapper,
                { 
                  backgroundColor: cardBackground,
                  borderColor: isDark ? '#333' : '#E8E8ED',
                }
              ]}>
                <IconSymbol
                  name="lock.fill"
                  size={22}
                  color={textSecondaryColor}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder={t('password_placeholder')}
                  placeholderTextColor={textSecondaryColor}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <IconSymbol
                    name={showPassword ? 'eye.fill' : 'eye.slash.fill'}
                    size={22}
                    color={textSecondaryColor}
                  />
                </Pressable>
              </View>
            </View>
          </Animated.View>

          {/* 登录按钮 */}
          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.loginButton,
              {
                backgroundColor: '#A3D65C',
                opacity: pressed ? 0.8 : 1,
              }
            ]}
          >
            <Text style={styles.loginButtonText}>
              {t('login')}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'right',
  },
  formContainer: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
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
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 17,
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 4,
    marginLeft: 8,
  },
  loginButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#A3D65C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
