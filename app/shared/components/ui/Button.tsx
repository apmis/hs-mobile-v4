import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp
} from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Colors } from '@/app/shared/constants/Theme';
import { useThemeColor } from '../../hooks/useThemeColor';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'outline' | 'ghost' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle
}) => {
  const primaryColor = useThemeColor({}, 'primary');
  const primaryLightColor = useThemeColor({}, 'primaryLight');
  const borderColor = useThemeColor({}, 'border');
  const whiteColor = useThemeColor({}, 'white');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');

  const getButtonStyle = () => {
    switch (type) {
      case 'outline':
        return [styles.outlineButton, { borderColor }];
      case 'ghost':
        return styles.ghostButton;
      case 'secondary':
        return [styles.secondaryButton, { backgroundColor: primaryLightColor }];
      default:
        return [styles.primaryButton, { backgroundColor: primaryColor }];
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'outline':
        return [styles.outlineText, { color: primaryColor }];
      case 'ghost':
        return [styles.ghostText, { color: textSecondaryColor }];
      case 'secondary':
        return [styles.secondaryText, { color: primaryColor }];
      default:
        return [styles.primaryText, { color: whiteColor }];
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.baseButton, getButtonStyle(), style, (disabled || loading) && styles.disabledButton]}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={type === 'primary' ? whiteColor : primaryColor} />
      ) : (
        <>
          <Text style={[styles.baseText, getTextStyle(), textStyle]}>{title}</Text>
          {icon && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles: any = ScaledSheet.create({
  baseButton: {
    height: '44@vs',
    borderRadius: '40@ms',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '8@vs',
    paddingHorizontal: '20@s',
    gap: '8@s',
  },
  primaryButton: {
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  secondaryButton: {
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  disabledButton: {
    opacity: 0.5,
  },
  baseText: {
    fontSize: '16@ms',
    fontWeight: '600',
  },
  primaryText: {
  },
  outlineText: {
  },
  secondaryText: {
  },
  ghostText: {
  },
});

export default Button;
