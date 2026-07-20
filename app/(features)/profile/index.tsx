import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/src/shared/hooks/useThemeColor';
import { ParallaxScrollView } from '@/src/shared/components/ui/ParallaxScrollView';
import { DataViewState } from '@/src/shared/components/ui/DataViewState';
import { useUser } from '@/src/shared/api/auth';
import { PreferenceItem } from '@/src/features/profile/_components/PreferenceItem';
import { LogoutButton } from '@/src/features/profile/_components/LogoutButton';
import { getProfileDisplayData } from '@/src/features/profile/_components/utils';
import { ProfileSkeleton } from '@/src/features/profile/_components/ProfileSkeleton';
import {
    Building2,
    Bell,
    Lock,
    Palette,
    Hospital
} from 'lucide-react-native';
import { Verify } from 'iconsax-react-native';

interface ProfileScreenProps {
    styles: any | {};
}

const ProfileScreen = ({ styles }: ProfileScreenProps) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { data: currentEmployee, isLoading, isError, error, refetch } = useUser();

    //console.log('currentEmployee', currentEmployee?.facilityId);
    //const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const textSecondaryColor = useThemeColor({}, 'textSecondary');
    const borderColor = useThemeColor({}, 'border');
    //const primaryColor = useThemeColor({}, 'primary');

    return (
        <DataViewState
            isLoading={isLoading}
            isError={isError}
            error={error}
            data={currentEmployee}
            onRetry={refetch}
            loadingMessage="Loading profile..."
            loadingComponent={<ProfileSkeleton styles={styles} />}

            render={(userData) => {
                const {
                    displayName,
                    userRole,
                    userId,
                    facilityName,
                    imageURL,
                    facilityStatus,
                    facilityBranch
                } = getProfileDisplayData(userData);

                return (
                    <ParallaxScrollView
                        headerImage={
                            <Image
                                source={{ uri: userData?.coverPhoto || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop' }}
                                style={{ flex: 1, width: '100%', height: '100%' }}
                                resizeMode="cover"
                            />
                        }
                        headerBackgroundColor={{ light: '#E6F0F9', dark: '#0D47A1' }}
                    >
                        <View style={{ paddingBottom: insets.bottom + moderateScale(20) }}>
                            {/* Profile Avatar section */}
                            <View style={styles.profileHeader}>
                                <View style={styles.avatarContainer}>
                                    <Image
                                        source={{ uri: imageURL }}
                                        style={styles.avatar}
                                    />
                                    <View style={styles.verifiedBadge}>
                                        <View style={styles.verifiedBg} />
                                        <Verify size={moderateScale(24)} color="#0059B2" variant="Bold" />
                                    </View>
                                </View>

                                <Text style={[styles.name, { color: textColor }]}>{displayName}</Text>
                                <Text style={[styles.role, { color: textSecondaryColor }]}>{userRole}</Text>

                                <View style={styles.staffIdPill}>
                                    <Text style={styles.staffIdText}>STAFF ID: {userId}</Text>
                                </View>
                            </View>

                            {/* Facility Overview Card */}
                            <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
                                <View style={styles.cardHeaderRow}>
                                    <Text style={[styles.cardTitle, { color: textColor }]}>Facility Overview</Text>
                                    <Building2 size={moderateScale(20)} color="#0059B2" />
                                </View>

                                <View style={styles.facilityContent}>
                                    <View style={[styles.facilityIconBox, { backgroundColor: borderColor }]}>
                                        <Hospital size={moderateScale(22)} color={textSecondaryColor} />
                                    </View>
                                    <View style={styles.facilityInfo}>
                                        <Text style={[styles.activeSiteLabel, { color: textSecondaryColor }]}>{facilityStatus ? 'ACTIVE SITE' : 'INACTIVE SITE'}</Text>
                                        <Text style={[styles.facilityName, { color: textColor }]}>{facilityName}</Text>
                                        <Text style={[styles.facilityDesc, { color: textSecondaryColor }]}>{facilityBranch}</Text>

                                    </View>
                                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                        <Text style={styles.changeLink}>Change</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Preferences Section */}
                            <Text style={[styles.sectionTitle, { color: textSecondaryColor }]}>PREFERENCES</Text>

                            <View style={[styles.cardAlt, { backgroundColor: cardColor, borderColor }]}>
                                <PreferenceItem
                                    title="Notifications"
                                    subtitle="Alerts, updates & health reports"
                                    icon={<Bell size={moderateScale(20)} color={textSecondaryColor} />}
                                    iconBgColor="rgba(37, 99, 235, 0.1)"
                                    onPress={() => router.push('/(features)/notifications')}
                                    styles={styles}
                                    textColor={textColor}
                                    textSecondaryColor={textSecondaryColor}
                                    borderColor={borderColor}
                                />
                                <PreferenceItem
                                    title="Privacy & Security"
                                    subtitle="HIPAA compliance & data access"
                                    icon={<Lock size={moderateScale(20)} color={textSecondaryColor} />}
                                    iconBgColor="rgba(5, 150, 105, 0.1)"
                                    styles={styles}
                                    textColor={textColor}
                                    textSecondaryColor={textSecondaryColor}
                                    borderColor={borderColor}
                                />
                                <PreferenceItem
                                    title="Appearance"
                                    subtitle="Theme settings & accessibility"
                                    icon={<Palette size={moderateScale(20)} color={textSecondaryColor} />}
                                    iconBgColor="rgba(124, 58, 237, 0.1)"
                                    onPress={() => router.push('/(features)/profile/appearance')}
                                    styles={styles}
                                    textColor={textColor}
                                    textSecondaryColor={textSecondaryColor}
                                    showDivider={false}
                                />
                            </View>

                            {/* Logout Button */}
                            <LogoutButton styles={styles} />

                            <Text style={[styles.versionText, { color: textSecondaryColor }]}>VERSION 4.2.0-CLINICAL • HEALTSTACK AFRICA</Text>
                        </View>
                    </ParallaxScrollView>
                );
            }}
        />
    );
};

export default ProfileScreen;
