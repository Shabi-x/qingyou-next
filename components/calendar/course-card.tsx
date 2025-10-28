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
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const itemBackgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'background');

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { 
          backgroundColor: itemBackgroundColor,
          borderColor: borderColor,
        },
        pressed && { opacity: 0.6 }
      ]}
      onPress={() => onPress?.(course.id)}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>
          {course.title}
        </Text>
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
      </View>
      <View style={styles.right}>
        <Text style={[styles.time, { color: textSecondaryColor }]}>
          {course.time}
        </Text>
        <Text style={[styles.chevron, { color: textSecondaryColor }]}>
          ›
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 15,
    fontWeight: '500',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 12,
  },
  time: {
    fontSize: 15,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 24,
    fontWeight: '300',
  },
});

