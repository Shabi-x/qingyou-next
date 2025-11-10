import { useThemeColor } from '@/hooks/use-theme-color';
import { FocusState, TimerMode } from '@/types/pomodoro';
import { StyleSheet, Text } from 'react-native';

interface InspiringSloganProps {
  focusState: FocusState;
  mode: TimerMode;
}

export function InspiringSlogan({ focusState, mode }: InspiringSloganProps) {
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const accentColor = useThemeColor({}, 'accent');
  
  const getSloganConfig = () => {
    switch (focusState) {
      case 'canceling':
        return { text: '正在专注中，请不要分心哦～', color: textSecondaryColor };
      case 'focusing':
        return { text: '正在专注中，请不要分心哦～', color: textSecondaryColor };
      case 'paused':
        return { text: '专注暂停！先休息一下吧', color: textSecondaryColor };
      case 'abandoned':
        return { text: '这次的放弃或许是因为有更重要的事情去做！', color: textSecondaryColor };
      case 'completed':
        return { text: '太棒了！完成专注～距离你的梦想更近了一步！', color: accentColor };
      default:
        return null;
    }
  };
  
  const config = getSloganConfig();
  if (!config) return null;
  
  return (
    <Text style={[styles.slogan, { color: config.color }]}>{config.text}</Text>
  );
}

const styles = StyleSheet.create({
  slogan: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 32,
  },
});


