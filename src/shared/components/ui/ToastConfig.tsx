import React from 'react';
import { View, Text, Platform } from 'react-native';
import { ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { useActiveTheme } from '../../hooks/useThemeColor';
import { Colors, DarkColors, Spacing, Typography } from '../../constants/Theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// A helper wrapper to ensure toasts always render with the correct theme colors dynamically
const ThemedToast = ({
  params,
  icon: IconComponent,
  type,
}: {
  params: ToastConfigParams<any>;
  icon: any;
  type: 'success' | 'error' | 'info';
}) => {
  const theme = useActiveTheme();
  const themeColors = theme === 'dark' ? DarkColors : Colors;
  const insets = useSafeAreaInsets();

  let bgColor, textColor, borderColor;

  if (type === 'success') {
    bgColor = themeColors.success;
    textColor = theme === 'dark' ? themeColors.white : themeColors.successText;
    borderColor = theme === 'dark' ? '#2E7D32' : '#C8E6C9';
  } else if (type === 'error') {
    bgColor = themeColors.error;
    textColor = theme === 'dark' ? themeColors.white : themeColors.errorText;
    borderColor = theme === 'dark' ? '#C62828' : '#FFCDD2';
  } else {
    bgColor = themeColors.card;
    textColor = themeColors.text;
    borderColor = themeColors.border;
  }

  return (
    <View
      style={[
        styles.toastContainer,
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
          marginTop: Platform.OS === 'ios' ? insets.top : Spacing.md,
        },
      ]}
    >
      <IconComponent color={textColor} size={moderateScale(20)} />
      <View style={styles.textContainer}>
        {params.text1 ? (
          <Text style={[styles.text1, { color: textColor }]}>{params.text1}</Text>
        ) : null}
        {params.text2 ? (
          <Text style={[styles.text2, { color: textColor }]}>{params.text2}</Text>
        ) : null}
      </View>
    </View>
  );
};

export const toastConfig: ToastConfig = {
  success: (params) => <ThemedToast params={params} type="success" icon={CheckCircle2} />,
  error: (params) => <ThemedToast params={params} type="error" icon={AlertCircle} />,
  info: (params) => <ThemedToast params={params} type="info" icon={Info} />,
};

const styles = ScaledSheet.create({
  toastContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  text1: {
    ...Typography.subtitle,
    fontWeight: '600',
    marginBottom: moderateScale(2),
  },
  text2: {
    ...Typography.body,
    fontSize: moderateScale(13),
  },
});
