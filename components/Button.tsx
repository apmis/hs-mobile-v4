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
import { Colors } from '../constants/Theme';

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
  const getButtonStyle = () => {
    switch (type) {
      case 'outline':
        return styles.outlineButton;
      case 'ghost':
        return styles.ghostButton;
      case 'secondary':
        return styles.secondaryButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      case 'secondary':
        return styles.secondaryText;
      default:
        return styles.primaryText;
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
        <ActivityIndicator color={type === 'primary' ? 'white' : Colors.primary} />
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
    height: '48@vs',
    borderRadius: '24@ms',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '8@vs',
    paddingHorizontal: '20@s',
    gap: '8@s',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    // Subtle shadow for premium feel
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  secondaryButton: {
    backgroundColor: Colors.primaryLight,
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
    color: Colors.white,
  },
  outlineText: {
    color: Colors.primary,
  },
  secondaryText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.textSecondary,
  },
});

export default Button;
