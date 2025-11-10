import { PomodoroContainer } from '@/components/clock';
import { ThemedView } from '@/components/common';
import { StyleSheet } from 'react-native';

export default function ClockScreen() {
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

