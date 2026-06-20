import React from 'react';
import { View, TextInput, Text, TextInputProps, ViewStyle, StyleProp } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
//import { Colors } from '@/app/shared/constants/Theme';
import { useThemeColor } from '../../hooks/useThemeColor';

interface InputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, icon, containerStyle, error, ...props }) => {
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'border'); // Using border or a dedicated lighter background
  const errorColor = useThemeColor({}, 'errorText');

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: textSecondaryColor }]}>{label}</Text>}
      <View 
        style={[
          styles.inputWrapper, 
          { backgroundColor },
          error ? { borderWidth: 1, borderColor: errorColor } : null
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholderTextColor={textSecondaryColor}
          {...props}
        />
      </View>
      {error ? <Text style={[styles.errorText, { color: errorColor }]}>{error}</Text> : null}
    </View>
  );
};

const styles: any = ScaledSheet.create({
  container: {
    marginVertical: '10@vs',
  },
  label: {
    fontSize: '12@ms',
    fontWeight: '700',
    marginBottom: '8@vs',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: '12@ms',
    paddingHorizontal: '12@ms',
    height: '45@vs',
  },
  iconContainer: {
    marginRight: '8@s',
  },
  input: {
    flex: 1,
    fontSize: '15@ms',
  },
  errorText: {
    fontSize: '11@ms',
    marginTop: '4@vs',
    marginLeft: '4@s',
  }
});

export default Input;
