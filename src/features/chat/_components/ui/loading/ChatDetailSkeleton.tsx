import React, { useEffect, useRef } from 'react';
import { View, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Colors, Spacing } from '@/src/shared/constants/Theme';
import { useThemeColor } from '@/src/shared/hooks/useThemeColor';
import { ArrowLeft } from 'lucide-react-native';

export default function ChatDetailSkeleton() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header Skeleton */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + moderateScale(10), backgroundColor: cardColor, borderBottomColor: borderColor }]}>
        <View style={styles.backButton}>
          <ArrowLeft size={moderateScale(24)} color={textSecondaryColor} opacity={0.5} />
        </View>

        <Animated.View style={[styles.headerAvatar, { opacity: fadeAnim }]} />

        <View style={styles.headerTitleContainer}>
          <Animated.View style={[styles.titleLine, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.subtitleLine, { opacity: fadeAnim }]} />
        </View>
      </View>

      {/* Chat Area Skeleton */}
      <View style={styles.chatArea}>
        {[1, 2, 3, 4].map((item, index) => {
          const isMe = index % 2 !== 0;
          return (
            <View key={index} style={[styles.bubbleWrapper, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
              {!isMe && <Animated.View style={[styles.messageAvatar, { opacity: fadeAnim }]} />}
              <Animated.View 
                style={[
                  styles.messageBubble, 
                  isMe ? { backgroundColor: '#E0E7FF' } : { backgroundColor: cardColor },
                  { opacity: fadeAnim, width: isMe ? '60%' : '75%' }
                ]} 
              />
            </View>
          );
        })}
      </View>

      {/* Input Area Skeleton */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom || moderateScale(20), backgroundColor }]}>
        <View style={[styles.inputWrapper, { backgroundColor: borderColor }]}>
           <Animated.View style={[styles.inputLine, { opacity: fadeAnim }]} />
        </View>
      </View>
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  backButton: {
    marginRight: Spacing.sm,
    padding: Spacing.xs,
  },
  headerAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#E5E7EB',
    marginRight: Spacing.sm,
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleLine: {
    width: '40%',
    height: moderateScale(14),
    backgroundColor: '#E5E7EB',
    borderRadius: moderateScale(4),
    marginBottom: moderateScale(6),
  },
  subtitleLine: {
    width: '25%',
    height: moderateScale(10),
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(4),
  },
  chatArea: {
    flex: 1,
    padding: Spacing.md,
    paddingTop: Spacing.lg,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: moderateScale(20),
  },
  bubbleLeft: {
    justifyContent: 'flex-start',
  },
  bubbleRight: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: '#E5E7EB',
    marginRight: moderateScale(8),
  },
  messageBubble: {
    height: moderateScale(60),
    borderRadius: moderateScale(16),
  },
  inputContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(24),
    height: moderateScale(48),
    paddingHorizontal: moderateScale(16),
  },
  inputLine: {
    width: '60%',
    height: moderateScale(14),
    backgroundColor: '#E5E7EB',
    borderRadius: moderateScale(4),
    marginLeft: moderateScale(8),
  }
});
