import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/app/shared/hooks/useThemeColor';
import { ParallaxScrollView } from '@/app/shared/components/ui/ParallaxScrollView';
import {
    Building2,
    ChevronRight,
    Bell,
    Lock,
    Palette,
    LogOut,
    Hospital
} from 'lucide-react-native';
import { Verify } from 'iconsax-react-native';

interface ProfileScreenProps {
    styles: any | {};
}

const ProfileScreen = ({ styles }: ProfileScreenProps) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    //const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const textSecondaryColor = useThemeColor({}, 'textSecondary');
    const borderColor = useThemeColor({}, 'border');
    //const primaryColor = useThemeColor({}, 'primary');

    return (
        <ParallaxScrollView
            headerImage={
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop' }}
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
                            source={{ uri: 'https://images.unsplash.com/photo-1594824432433-2ba7d4c9d5ec?q=80&w=200&auto=format&fit=crop' }}
                            style={styles.avatar}
                        />
                        <View style={styles.verifiedBadge}>
                            <View style={styles.verifiedBg} />
                            <Verify size={moderateScale(24)} color="#0059B2" variant="Bold" />
                        </View>
                    </View>

                    <Text style={[styles.name, { color: textColor }]}>Alex Rivera</Text>
                    <Text style={[styles.role, { color: textSecondaryColor }]}>Senior Care Coordinator</Text>

                    <View style={styles.staffIdPill}>
                        <Text style={styles.staffIdText}>STAFF ID: 8820</Text>
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
                            <Text style={[styles.activeSiteLabel, { color: textSecondaryColor }]}>ACTIVE SITE</Text>
                            <Text style={[styles.facilityName, { color: textColor }]}>Test Facility</Text>
                            <Text style={[styles.facilityDesc, { color: textSecondaryColor }]}>North Wing - Specialized{'\n'}Diagnostics</Text>
                        </View>
                        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Text style={styles.changeLink}>Change</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Preferences Section */}
                <Text style={[styles.sectionTitle, { color: textSecondaryColor }]}>PREFERENCES</Text>

                <View style={[styles.cardAlt, { backgroundColor: cardColor, borderColor }]}>
                    {/* Notifications */}
                    <TouchableOpacity
                        style={styles.preferenceRow}
                        onPress={() => router.push('/(features)/notifications')}
                    >
                        <View style={[styles.prefIconBox, { backgroundColor: 'rgba(37, 99, 235, 0.1)' }]}>
                            <Bell size={moderateScale(20)} color="#2563EB" />
                        </View>
                        <View style={styles.prefTextCol}>
                            <Text style={[styles.prefTitle, { color: textColor }]}>Notifications</Text>
                            <Text style={[styles.prefSub, { color: textSecondaryColor }]}>Alerts, updates & health reports</Text>
                        </View>
                        <ChevronRight size={moderateScale(20)} color={textSecondaryColor} />
                    </TouchableOpacity>

                    <View style={[styles.divider, { backgroundColor: borderColor }]} />

                    {/* Privacy & Security */}
                    <TouchableOpacity style={styles.preferenceRow}>
                        <View style={[styles.prefIconBox, { backgroundColor: 'rgba(5, 150, 105, 0.1)' }]}>
                            <Lock size={moderateScale(20)} color="#059669" />
                        </View>
                        <View style={styles.prefTextCol}>
                            <Text style={[styles.prefTitle, { color: textColor }]}>Privacy & Security</Text>
                            <Text style={[styles.prefSub, { color: textSecondaryColor }]}>HIPAA compliance & data access</Text>
                        </View>
                        <ChevronRight size={moderateScale(20)} color={textSecondaryColor} />
                    </TouchableOpacity>

                    <View style={[styles.divider, { backgroundColor: borderColor }]} />

                    {/* Appearance */}
                    <TouchableOpacity
                        style={styles.preferenceRow}
                        onPress={() => router.push('/(features)/profile/appearance')}
                    >
                        <View style={[styles.prefIconBox, { backgroundColor: 'rgba(124, 58, 237, 0.1)' }]}>
                            <Palette size={moderateScale(20)} color="#7C3AED" />
                        </View>
                        <View style={styles.prefTextCol}>
                            <Text style={[styles.prefTitle, { color: textColor }]}>Appearance</Text>
                            <Text style={[styles.prefSub, { color: textSecondaryColor }]}>Theme settings & accessibility</Text>
                        </View>
                        <ChevronRight size={moderateScale(20)} color={textSecondaryColor} />
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton}>
                    <LogOut size={moderateScale(20)} color="#DC2626" />
                    <Text style={styles.logoutText}>Logout from System</Text>
                </TouchableOpacity>

                <Text style={[styles.versionText, { color: textSecondaryColor }]}>VERSION 4.2.0-CLINICAL • BUILD 902</Text>
            </View>
        </ParallaxScrollView>
    );
};

export default ProfileScreen;
