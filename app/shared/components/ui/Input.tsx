import React from 'react';
import { View, TextInput, Text, TextInputProps, ViewStyle, StyleProp } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { Colors } from '@/app/shared/constants/Theme';

interface InputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

const Input: React.FC<InputProps> = ({ label, icon, containerStyle, ...props }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.textSecondary}
          {...props}
        />
      </View>
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
    color: Colors.textSecondary,
    marginBottom: '8@vs',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF', // Matches the design's light gray background for inputs
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
    color: Colors.text,
  },
});

export default Input;
