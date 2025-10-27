// Android-specific implementation using MaterialIcons

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;

/**
 * Add your SF Symbols to Material Icons mappings here.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  // Tab bar icons
  'note.text': 'description',
  'calendar': 'today',
  'calendar.badge.clock': 'event',
  'list.bullet.clipboard': 'assignment',
  'alarm.fill': 'alarm',
  'person.crop.circle': 'account-circle',
} as IconMapping;

type IconSymbolName = keyof typeof MAPPING;

/**
 * Android implementation using MaterialIcons wrapped in a View to match iOS interface
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <MaterialIcons 
        name={MAPPING[name]} 
        size={size} 
        color={color}
      />
    </View>
  );
}

