import { TextStyle } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export const Colors = {
  primary: '#0059B2', // Main professional blue
  primaryLight: '#E6F0F9',
  secondary: '#666666',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#626262',
  success: '#E8F5E9',
  successText: '#2E7D32',
  warning: '#FFF3E0',
  warningText: '#E65100',
  error: '#FDECEA',
  errorText: '#D32F2F',
  border: '#EEEEEE',
  chatBackground: '#EFEAE2',
  white: '#FFFFFF',
};

export const DarkColors = {
  primary: '#1E88E5',
  primaryLight: '#1C4B82',
  secondary: '#A0A0A0',
  background: '#1a1919ff',
  card: '#1E1E1E',
  text: '#E0E0E0',
  textSecondary: '#A0A0A0',
  success: '#1B5E20',
  successText: '#81C784',
  warning: '#E65100',
  warningText: '#FFB74D',
  error: '#B71C1C',
  errorText: '#E57373',
  border: '#2C2C2C',
  chatBackground: '#0B141A',
  white: '#FFFFFF',
};

export const Spacing = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(16),
  lg: moderateScale(24),
  xl: moderateScale(32),
};

export const Typography = {
  h1: {
    fontSize: moderateScale(28),
    fontWeight: '700' as const,
  } as TextStyle,
  h2: {
    fontSize: moderateScale(22),
    fontWeight: '600' as const,
  } as TextStyle,
  subtitle: {
    fontSize: moderateScale(16),
    fontWeight: '400' as const,
  } as TextStyle,
  body: {
    fontSize: moderateScale(14),
  } as TextStyle,
  caption: {
    fontSize: moderateScale(12),
  } as TextStyle,
};

// Dummy export to prevent Expo Router from complaining about a missing route component
export default function ThemeRoute() {
  return null;
}
