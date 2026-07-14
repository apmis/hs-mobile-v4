import { Text, type TextProps } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { Typography, Colors } from '../../constants/Theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'h1' | 'h2' | 'subtitle' | 'caption' | 'error' | 'success' | 'warning' | 'primary';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  let colorName: keyof typeof Colors = 'text';
  
  if (type === 'subtitle' || type === 'caption') {
    colorName = 'textSecondary';
  } else if (type === 'error') {
    colorName = 'errorText';
  } else if (type === 'success') {
    colorName = 'successText';
  } else if (type === 'warning') {
    colorName = 'warningText';
  } else if (type === 'primary') {
    colorName = 'primary';
  }

  const color = useThemeColor({ light: lightColor, dark: darkColor }, colorName);

  return (
    <Text
      style={[
        { color },
        type === 'default' ? Typography.body : undefined,
        type === 'h1' ? Typography.h1 : undefined,
        type === 'h2' ? Typography.h2 : undefined,
        type === 'subtitle' ? Typography.subtitle : undefined,
        type === 'caption' ? Typography.caption : undefined,
        style,
      ]}
      {...rest}
    />
  );
}
