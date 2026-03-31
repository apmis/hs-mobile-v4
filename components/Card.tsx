import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Colors } from '../constants/Theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles: any = ScaledSheet.create({
  card: {
    backgroundColor: Colors.card,
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
    borderColor: Colors.border,
  },
});

export default Card;
