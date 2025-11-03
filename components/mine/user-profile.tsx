import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export interface UserProfileProps {
  name: string;
  studentId: string;
  major: string;
}

/**
 * 用户信息展示组件
 */
export function UserProfile({ name, studentId, major }: UserProfileProps) {
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'cardBorder');
  
  return (
    <View style={styles.container}>
      {/* 头像 */}
      <View style={styles.avatarContainer}>
        <View style={[styles.avatarBorder, { borderColor }]}>
          <Image 
            source={require('@/assets/images/avatar.png')} 
            style={styles.avatar}
            resizeMode="contain"
          />
        </View>
      </View>
      
      {/* 用户信息 */}
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: textColor }]}>
          {name}
        </Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: textSecondaryColor }]}>学号</Text>
            <Text style={[styles.value, { color: textColor }]}>{studentId}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: textSecondaryColor }]}>专业</Text>
            <Text style={[styles.value, { color: textColor }]}>{major}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarBorder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 98,
    height: 98,
    borderRadius: 49,
  },
  infoContainer: {
    flex: 1,
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailsContainer: {
    gap: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    width: 48,
  },
  value: {
    fontSize: 14,
    flex: 1,
  },
});

