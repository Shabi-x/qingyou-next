// Fallback for using MaterialIcons on web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.left': 'chevron-left',
  'chevron.right': 'chevron-right',
  // Tab bar icons
  'note.text': 'description',
  'calendar': 'today',
  'calendar.badge.clock': 'event',
  'list.bullet.clipboard': 'assignment',
  'alarm.fill': 'alarm',
  'person.crop.circle': 'account-circle',
  // Calendar icons
  'mappin.circle.fill': 'place',
  'arrow.triangle.2.circlepath': 'sync',
  // Auth icons
  'lock.fill': 'lock',
  'eye.fill': 'visibility',
  'eye.slash.fill': 'visibility-off',
} as IconMapping;

/**
 * An icon component that uses MaterialIcons on web, matching iOS/Android interface.
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
