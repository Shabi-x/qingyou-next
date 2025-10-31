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

export default function PrivacyPolicyScreen() {
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
          {t('privacy_policy')}
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
          引言
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          南邮日程表（以下简称"我们"）非常重视用户的隐私保护和个人信息安全。本隐私政策将向您说明我们如何收集、使用、存储和保护您的个人信息。请您仔细阅读本政策，充分理解各条款内容。
        </Text>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          1. 我们收集的信息
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          为了向您提供更好的服务，我们可能会收集以下信息：
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          • 账户信息：您的学号、姓名等基本信息{'\n'}
          • 课程信息：您的课程表、上课时间、教室位置等{'\n'}
          • 使用信息：应用使用频率、功能偏好等{'\n'}
          • 设备信息：设备型号、操作系统版本、应用版本等
        </Text>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          2. 信息的使用
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          我们收集您的信息主要用于：
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          • 提供课程表查询和管理服务{'\n'}
          • 发送课程提醒和待办事项通知{'\n'}
          • 改进和优化应用功能{'\n'}
          • 保障应用安全稳定运行{'\n'}
          • 响应您的客服请求
        </Text>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          3. 信息的存储
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          我们会采取合理的安全措施保护您的个人信息。您的课程数据主要存储在您的设备本地，部分数据会加密存储在我们的服务器上以实现云同步功能。我们不会将您的信息出售给第三方。
        </Text>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          4. 信息的共享
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          未经您的同意，我们不会与第三方共享您的个人信息，除非：
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          • 获得您的明确授权{'\n'}
          • 根据法律法规的要求{'\n'}
          • 为维护公共利益{'\n'}
          • 为保护您或他人的生命、财产安全
        </Text>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          5. 您的权利
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          您对自己的个人信息享有以下权利：
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          • 访问权：您可以随时查看您的个人信息{'\n'}
          • 更正权：您可以修改不准确的个人信息{'\n'}
          • 删除权：您可以要求删除您的个人信息{'\n'}
          • 撤回权：您可以撤回之前给予的授权
        </Text>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          6. 信息安全
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          我们采用行业标准的安全措施保护您的个人信息，包括数据加密、访问控制、安全审计等。但请您理解，互联网并非绝对安全的环境，我们建议您妥善保管账号密码。
        </Text>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          7. 未成年人保护
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          我们重视未成年人的个人信息保护。如您为未成年人，请在监护人的指导下使用本应用。如我们发现在未事先获得监护人同意的情况下收集了未成年人的信息，我们会尽快删除相关数据。
        </Text>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          8. 政策的更新
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          我们可能会不定期更新本隐私政策。更新后的政策将在应用内发布，并在发布时生效。我们鼓励您定期查看本政策以了解最新的隐私保护措施。
        </Text>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          9. 联系我们
        </Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          如果您对本隐私政策有任何疑问、意见或建议，或希望行使您的个人信息相关权利，请通过应用内反馈功能或发送邮件至我们的隐私邮箱与我们联系。
        </Text>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: textSecondaryColor }]}>
            感谢您信任并使用南邮日程表
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

