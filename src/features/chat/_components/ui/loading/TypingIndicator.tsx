import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';

interface TypingIndicatorProps {
  dotColor?: string;
}

export function TypingIndicator({ dotColor = '#6B7280' }: TypingIndicatorProps) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, { backgroundColor: dotColor, transform: [{ translateY: dot1.interpolate({ inputRange: [0, 1], outputRange: [0, -moderateScale(4)] }) }] }]} />
      <Animated.View style={[styles.dot, { backgroundColor: dotColor, transform: [{ translateY: dot2.interpolate({ inputRange: [0, 1], outputRange: [0, -moderateScale(4)] }) }] }]} />
      <Animated.View style={[styles.dot, { backgroundColor: dotColor, transform: [{ translateY: dot3.interpolate({ inputRange: [0, 1], outputRange: [0, -moderateScale(4)] }) }] }]} />
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32@ms',
    height: '16@ms',
  },
  dot: {
    width: '6@ms',
    height: '6@ms',
    borderRadius: '3@ms',
    marginHorizontal: '2@ms',
  },
});
