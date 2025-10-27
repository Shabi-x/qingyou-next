import { useTheme } from '@/contexts/theme-context';

export function useColorScheme() {
  const { colorScheme } = useTheme();
  return colorScheme;
}
