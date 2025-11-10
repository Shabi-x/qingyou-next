import { PomodoroContainer } from '@/components/pomodoro';
import { ThemedView } from '@/components/common';
import { StyleSheet } from 'react-native';

export default function PomodoroScreen() {
  return (
    <ThemedView style={styles.container}>
      <PomodoroContainer />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


