import { useColorScheme } from 'react-native';
import { Colors, DarkColors } from '../constants/Theme';
import { useThemeStore } from '../store/useThemeStore';

export function useActiveTheme() {
  const systemTheme = useColorScheme() ?? 'light';
  const themePreference = useThemeStore((state) => state.themePreference);

  if (themePreference === 'system') {
    return systemTheme;
  }
  return themePreference;
}

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors
) {
  const theme = useActiveTheme();
  const colorFromProps = props[theme as keyof typeof props];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return theme === 'light' ? Colors[colorName] : DarkColors[colorName];
  }
}
