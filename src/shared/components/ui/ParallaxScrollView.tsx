import React, { useRef } from 'react';
import { StyleSheet, Animated, ViewProps } from 'react-native';
import { useThemeColor } from '@/src/shared/hooks/useThemeColor';
import { ThemedView } from './ThemedView';

const HEADER_HEIGHT = 250;

export interface ParallaxScrollViewProps extends ViewProps {
  headerImage: React.ReactElement;
  headerBackgroundColor?: { light: string; dark: string };
  children: React.ReactNode;
}

export function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  style,
  ...otherProps
}: ParallaxScrollViewProps) {
  // Respects your robust semantic theme hook!
  const backgroundColor = useThemeColor(headerBackgroundColor || {}, 'background');
  
  // High-performance React Native Animated value
  const scrollY = useRef(new Animated.Value(0)).current;

  // Header translates down at 75% speed to create the classic parallax float
  const headerTranslateY = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
    outputRange: [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
    extrapolate: 'clamp',
  });

  // Overscroll elasticity: Image zooms in gracefully if user pulls down past the top boundary
  const headerScale = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT, 0, 1],
    outputRange: [2, 1, 1],
    extrapolate: 'clamp',
  });

  return (
    <ThemedView style={[styles.container, style]} {...otherProps}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true } // Crucial for buttery 60fps animations!
        )}
      >
        <Animated.View
          style={[
            styles.header,
            { backgroundColor },
            {
              transform: [
                { translateY: headerTranslateY },
                { scale: headerScale },
              ],
            },
          ]}
        >
          {headerImage}
        </Animated.View>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    // Adds a nice rounded overlap over the parallax header
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24, 
    padding: 16,
  },
});
