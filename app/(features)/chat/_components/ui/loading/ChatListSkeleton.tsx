import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Spacing } from '@/app/shared/constants/Theme';
import { useThemeColor } from '@/app/shared/hooks/useThemeColor';

export default function ChatListSkeleton() {
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

  const borderColor = useThemeColor({}, 'border');
  
  return (
    <View style={{ paddingHorizontal: Spacing.md }}>
      {[...Array(6)].map((_, i) => (
        <View 
          key={i} 
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            paddingVertical: moderateScale(16), 
            borderBottomWidth: 1, 
            borderBottomColor: borderColor 
          }}
        >
          {/* Avatar Skeleton */}
          <Animated.View style={{ 
            width: moderateScale(50), 
            height: moderateScale(50), 
            borderRadius: moderateScale(25), 
            backgroundColor: '#E5E7EB', 
            marginRight: moderateScale(14),
            opacity: fadeAnim 
          }} />
          
          {/* Content Skeleton */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: moderateScale(8) }}>
              <Animated.View style={{ width: '50%', height: moderateScale(14), backgroundColor: '#E5E7EB', borderRadius: moderateScale(4), opacity: fadeAnim }} />
              <Animated.View style={{ width: '15%', height: moderateScale(10), backgroundColor: '#E5E7EB', borderRadius: moderateScale(4), opacity: fadeAnim }} />
            </View>
            <Animated.View style={{ width: '80%', height: moderateScale(12), backgroundColor: '#F3F4F6', borderRadius: moderateScale(4), opacity: fadeAnim }} />
          </View>
        </View>
      ))}
    </View>
  );
}
