import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { ThemedText, ThemedView } from '@/components/common';
import { UserActiveCalendar, UserProfile } from '@/components/mine';
import { LanguageSwitcher, ThemeDebugButton } from '@/components/theme';
import { useI18n } from '@/hooks/use-i18n';
import { generateUserActivityData } from '@/utils/mock-data';

export default function MineScreen() {
  const { t } = useI18n('mine');
  
  // 获取 mock 数据
  const activityData = generateUserActivityData();
  
  // Mock 用户数据
  const userData = {
    name: '梁少峻',
    studentId: 'B22042219',
    department: '计算机学院、软件学院、网络空间安全学院',
    major: '软件工程',
  };

  const handleLogout = () => {
    // 退出登录，跳转到欢迎页
    router.replace('/(auth)');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.content}>
          {/* 用户信息 */}
          <UserProfile 
            name={userData.name}
            studentId={userData.studentId}
            major={userData.major}
          />
          
          {/* 每日任务热力图 */}
          <UserActiveCalendar data={activityData} />
          
          <ThemedView style={styles.debugSection}>
            <ThemedText style={styles.sectionTitle}>{t('debug_section')}</ThemedText>
            <ThemedView style={styles.buttonGroup}>
              <LanguageSwitcher />
              <ThemeDebugButton />
            </ThemedView>
          </ThemedView>

          {/* 退出登录按钮 */}
          <ThemedView style={styles.logoutSection}>
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                styles.logoutButton,
                { 
                  backgroundColor: '#A3D65C',
                  opacity: pressed ? 0.8 : 1,
                }
              ]}
            >
              <Text style={styles.logoutButtonText}>
                {t('logout')}
              </Text>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  debugSection: {
    marginTop: 32,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  buttonGroup: {
    gap: 8,
  },
  logoutSection: {
    marginTop: 48,
  },
  logoutButton: {
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
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

