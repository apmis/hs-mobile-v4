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
    color: Colors.text,
  } as TextStyle,
  h2: {
    fontSize: moderateScale(22),
    fontWeight: '600' as const,
    color: Colors.text,
  } as TextStyle,
  subtitle: {
    fontSize: moderateScale(16),
    color: Colors.textSecondary,
    fontWeight: '400' as const,
  } as TextStyle,
  body: {
    fontSize: moderateScale(14),
    color: Colors.text,
  } as TextStyle,
  caption: {
    fontSize: moderateScale(12),
    color: Colors.textSecondary,
  } as TextStyle,
};
