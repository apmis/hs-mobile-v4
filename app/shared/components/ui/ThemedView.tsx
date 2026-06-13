import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { Colors } from '../../constants/Theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: keyof typeof Colors;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = 'background',
  ...rest
}: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, variant);

  return <View style={[{ backgroundColor }, style]} {...rest} />;
}
