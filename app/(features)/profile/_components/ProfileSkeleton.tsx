import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { ParallaxScrollView } from '@/app/shared/components/ui/ParallaxScrollView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/app/shared/hooks/useThemeColor';

export const ProfileSkeleton = ({ styles }: { styles: any }) => {
    const insets = useSafeAreaInsets();
    const cardColor = useThemeColor({}, 'card');
    const borderColor = useThemeColor({}, 'border');

    // Simple pulsing animation
    const fadeAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.5,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, [fadeAnim]);

    const SkeletonBox = ({ width, height, borderRadius = 4, style }: any) => (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: '#E5E7EB', // Gray 200
                    opacity: fadeAnim,
                },
                style
            ]}
        />
    );

    return (
        <ParallaxScrollView
            headerImage={<View style={{ flex: 1, backgroundColor: '#E5E7EB' }} />}
            headerBackgroundColor={{ light: '#E6F0F9', dark: '#0D47A1' }}
        >
            <View style={{ paddingBottom: insets.bottom + moderateScale(20) }}>
                {/* Avatar Section */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <SkeletonBox width={moderateScale(96)} height={moderateScale(96)} borderRadius={moderateScale(48)} />
                    </View>
                    <SkeletonBox width={150} height={24} borderRadius={4} style={{ marginBottom: 8 }} />
                    <SkeletonBox width={100} height={16} borderRadius={4} style={{ marginBottom: 12 }} />
                    <SkeletonBox width={80} height={24} borderRadius={12} />
                </View>

                {/* Facility Card */}
                <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
                    <View style={styles.cardHeaderRow}>
                        <SkeletonBox width={120} height={20} borderRadius={4} />
                    </View>
                    <View style={styles.facilityContent}>
                        <SkeletonBox width={moderateScale(48)} height={moderateScale(48)} borderRadius={moderateScale(12)} style={{ marginRight: moderateScale(16) }} />
                        <View style={styles.facilityInfo}>
                            <SkeletonBox width={60} height={12} borderRadius={4} style={{ marginBottom: 8 }} />
                            <SkeletonBox width={140} height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                            <SkeletonBox width={100} height={14} borderRadius={4} />
                        </View>
                    </View>
                </View>

                {/* Preferences Section */}
                <SkeletonBox width={100} height={14} borderRadius={4} style={{ marginBottom: 12, marginLeft: 6 }} />

                <View style={[styles.cardAlt, { backgroundColor: cardColor, borderColor }]}>
                    {[1, 2, 3].map((item, index) => (
                        <View key={item}>
                            <View style={styles.preferenceRow}>
                                <SkeletonBox width={moderateScale(44)} height={moderateScale(44)} borderRadius={moderateScale(22)} style={{ marginRight: moderateScale(16) }} />
                                <View style={styles.prefTextCol}>
                                    <SkeletonBox width={120} height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                                    <SkeletonBox width={160} height={12} borderRadius={4} />
                                </View>
                            </View>
                            {index !== 2 && <View style={[styles.divider, { backgroundColor: borderColor }]} />}
                        </View>
                    ))}
                </View>

                {/* Logout Button Skeleton */}
                <View style={{ alignItems: 'center', marginTop: 16 }}>
                    <SkeletonBox width={'100%'} height={moderateScale(50)} borderRadius={moderateScale(24)} />
                </View>
            </View>
        </ParallaxScrollView>
    );
};
