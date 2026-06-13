import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Colors } from '@/app/shared/constants/Theme';
import { useThemeColor } from '../../hooks/useThemeColor';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Card: React.FC<CardProps> = ({ children, style }) => {
  const backgroundColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  return (
    <View style={[styles.card, { backgroundColor, borderColor }, style]}>
      {children}
    </View>
  );
};

const styles: any = ScaledSheet.create({
  card: {
    borderRadius: '16@ms',
    padding: '16@ms',
    marginVertical: '8@vs',
    // Premium professional shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
  },
});

export default Card;
