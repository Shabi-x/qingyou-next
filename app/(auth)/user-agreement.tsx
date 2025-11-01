import { router } from 'expo-router';
import React from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function UserAgreementScreen() {
  const { t } = useI18n('auth');
  const insets = useSafeAreaInsets();
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* 头部 */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={28} color={textColor} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          {t('user_agreement')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* 内容 */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={[styles.updateDate, { color: textSecondaryColor }]}>
          更新日期：2025年10月31日
        </Text>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          欢迎使用南邮日程表
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          在使用我们的服务之前，请您仔细阅读并充分理解本协议的全部内容。您使用或继续使用我们的服务，即表示您同意并接受本协议的所有条款和条件。
        </Text>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          1. 服务说明
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          南邮日程表是一款专为南京邮电大学师生设计的日程管理应用，提供课程表管理、待办事项提醒、校历查询等功能。我们致力于为用户提供便捷、高效的学习生活管理工具。
        </Text>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          2. 用户账号
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          您需要使用学校统一身份认证系统登录本应用。您应当妥善保管您的账号信息和密码，对您账号下的所有行为负责。如发现账号被他人使用，请立即通知我们。
        </Text>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          3. 用户行为规范
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          您在使用本服务时，应遵守国家法律法规，不得利用本服务从事违法违规活动。您不得干扰或试图干扰本服务的正常运行，不得恶意攻击服务器或网络。
        </Text>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          4. 知识产权
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          本应用的所有内容，包括但不限于文字、图片、图标、音频、视频、软件等，均受著作权法、商标法和其他法律法规的保护。未经我们书面许可，您不得将这些内容用于任何商业用途。
        </Text>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          5. 免责声明
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          我们会尽力确保服务的稳定性和准确性，但不对服务的及时性、准确性、完整性或可靠性作任何承诺或保证。因使用本服务产生的任何直接或间接损失，我们不承担责任。
        </Text>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          6. 协议的修改
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          我们有权根据需要随时修改本协议。修改后的协议一经发布即生效。如您继续使用本服务，即视为您已接受修改后的协议。
        </Text>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          7. 联系我们
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          如您对本协议有任何疑问或建议，请通过应用内的反馈功能或发送邮件至我们的客服邮箱与我们联系。
        </Text>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: textSecondaryColor }]}>
            本协议的解释权归南邮日程表团队所有
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8ED',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  updateDate: {
    fontSize: 13,
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
  },
});

