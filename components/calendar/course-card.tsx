import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface CourseItem {
  id: string;
  title: string;
  location: string;
  time: string;
}

interface CourseCardProps {
  course: CourseItem;
  onPress?: (id: string) => void;
}

export function CourseCard({ course, onPress }: CourseCardProps) {
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const itemBackgroundColor = useThemeColor({}, 'background'); // 较浅的灰色
  const borderColor = useThemeColor({}, 'cardBorder');
  
  // 暗夜模式：有背景色（较浅的灰色），无边框
  // 白天模式：无背景色，有边框
  const isDark = colorScheme === 'dark';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { 
          backgroundColor: isDark ? itemBackgroundColor : 'transparent',
          borderColor: isDark ? 'transparent' : borderColor,
        },
        pressed && { opacity: 0.6 }
      ]}
      onPress={() => onPress?.(course.id)}
    >
      <View style={styles.content}>
        {/* 第一行：课程名和时间 */}
        <View style={styles.titleRow}>
          <Text 
            style={[styles.title, { color: textColor }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {course.title}
          </Text>
          <Text style={[styles.time, { color: textSecondaryColor }]}>
            {course.time}
          </Text>
        </View>
        {/* 第二行：教室地点和箭头 */}
        <View style={styles.bottomRow}>
          <View style={styles.locationRow}>
            <MaterialIcons 
              name="place" 
              size={16} 
              color={textSecondaryColor}
            />
            <Text style={[styles.location, { color: textSecondaryColor }]}>
              {course.location}
            </Text>
          </View>
          <Text style={[styles.chevron, { color: textSecondaryColor }]}>
            ›
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  content: {
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  time: {
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 18,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 24,
  },
});

