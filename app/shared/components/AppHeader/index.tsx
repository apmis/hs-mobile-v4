import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Pressable, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Colors, Spacing } from '@/app/shared/constants/Theme';
import { Bell, Camera, MoreVertical, Search, X, Sparkles } from 'lucide-react-native';
import { ArrowLeft } from 'iconsax-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/app/shared/hooks/useThemeColor';
//import TopSearchBar from './TopSearchBar';
import TopSearchBar from '../TopSearchBar';
import NotificationBell from './NotificationBell';

const LOCATIONS = ['HQ Hospital:Lagos', 'North Wing: Abuja', 'East Wing: Port Harcourt', 'Pediatrics Center: Kano', 'Emergency Bay: Ibadan'];
const DEFAULT_MORE_OPTIONS = ['Create', 'List', 'Find', 'View details', 'Edit', 'Delete'];
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AppHeaderProps {
    title?: string;
    subtitle?: string;
    showBack?: boolean;
    showIcons?: boolean;
    searchQuery?: string;
    setSearchQuery?: (text: string) => void;
    showSearch?: boolean;
    showLocation?: boolean;
    showMoreOptions?: boolean;
    moreOptions?: string[];
    onOptionPress?: (option: string) => void;
}

export default function AppHeader({
    title = "HealthStack",
    subtitle,
    showBack = false,
    showIcons = true,
    searchQuery,
    setSearchQuery,
    showSearch = true,
    showLocation = false,
    showMoreOptions = false,
    moreOptions = DEFAULT_MORE_OPTIONS,
    onOptionPress
}: AppHeaderProps) {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [showLocationSheet, setShowLocationSheet] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);

    const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const textSecondaryColor = useThemeColor({}, 'textSecondary');
    const borderColor = useThemeColor({}, 'border');
    const primaryColor = useThemeColor({}, 'primary');
    const primaryLightColor = useThemeColor({}, 'primaryLight');
    const errorColor = useThemeColor({}, 'errorText');

    return (
        <View style={[styles.mainHeader, { backgroundColor, borderBottomColor: borderColor, zIndex: 9999, elevation: 9999 }]}>
            <View style={styles.headerTitleRow}>
                <View style={styles.leftSection}>
                    {showBack && (
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <ArrowLeft size={moderateScale(24)} color={textColor} variant="Linear" />
                        </TouchableOpacity>
                    )}
                    <View>
                        <Text style={[styles.mainHeaderTitle, { color: textColor }]}>{title}</Text>
                        {subtitle && (
                            <Text style={[styles.locationText, { color: textSecondaryColor, marginTop: 2 }]}>{subtitle}</Text>
                        )}
                        {showLocation && (
                            <Pressable onPress={() => setShowLocationSheet(true)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Text style={[styles.locationText, { color: textSecondaryColor }]}>@{selectedLocation}</Text>
                            </Pressable>
                        )}
                    </View>
                </View>

                {showIcons && (
                    <View style={styles.headerRightIcons}>
                        <NotificationBell color={textColor} />
                        {/* <TouchableOpacity style={styles.iconBtn}>
              <Camera size={moderateScale(24)} color={textColor} />
            </TouchableOpacity> */}
                        <TouchableOpacity style={styles.iconBtn} onPress={() => showMoreOptions ? setShowMoreMenu(true) : null}>
                            <MoreVertical size={moderateScale(24)} color={textColor} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {showSearch && setSearchQuery !== undefined && (
                <TopSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            )}

            {/* Location Bottom Sheet */}
            {showLocationSheet && (
                <View style={{ position: 'absolute', top: -insets.top, left: -Spacing.md, width: SCREEN_WIDTH, height: SCREEN_HEIGHT + 100, zIndex: 9999, elevation: 9999 }}>
                    <TouchableWithoutFeedback onPress={() => setShowLocationSheet(false)}>
                        <View style={styles.modalOverlay}>
                            <TouchableWithoutFeedback>
                                <View style={[styles.bottomSheet, { backgroundColor: cardColor }]}>
                                    <View style={styles.sheetIndicator} />
                                    <Text style={[styles.sheetTitle, { color: textColor }]}>Select Location</Text>

                                    {LOCATIONS.map((loc) => (
                                        <TouchableOpacity
                                            key={loc}
                                            style={[
                                                styles.locationItem,
                                                { backgroundColor: backgroundColor },
                                                selectedLocation === loc && { backgroundColor: primaryLightColor, borderColor: primaryColor }
                                            ]}
                                            onPress={() => {
                                                setSelectedLocation(loc);
                                                setShowLocationSheet(false);
                                            }}
                                        >
                                            <Text style={[
                                                styles.locationItemText,
                                                { color: textColor },
                                                selectedLocation === loc && { color: primaryColor }
                                            ]}>{loc}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )}

            {/* Dropdown Menu Modal */}
            {showMoreMenu && (
                <View style={{ position: 'absolute', top: -insets.top, left: -Spacing.md, width: SCREEN_WIDTH, height: SCREEN_HEIGHT + 100, zIndex: 9999, elevation: 9999 }}>
                    <TouchableWithoutFeedback onPress={() => setShowMoreMenu(false)}>
                        <View style={styles.dropdownOverlay}>
                            <TouchableWithoutFeedback>
                                <View style={[styles.dropdownMenu, { top: insets.top + moderateScale(45), backgroundColor: cardColor, borderColor }]}>
                                    {moreOptions.map((option, index) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[
                                                styles.dropdownItem,
                                                index !== moreOptions.length - 1 && [styles.dropdownItemBorder, { borderBottomColor: borderColor }]
                                            ]}
                                            onPress={() => {
                                                setShowMoreMenu(false);
                                                if (onOptionPress) onOptionPress(option);
                                            }}
                                        >
                                            <Text style={[
                                                styles.dropdownItemText,
                                                { color: textColor },
                                                option === title && { color: primaryColor, fontWeight: 'bold' },
                                                (option === 'Delete' || option === 'Logout') && { color: errorColor }
                                            ]}>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )}
        </View>
    );
}

const styles = ScaledSheet.create({
    mainHeader: {
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.sm,
        borderBottomWidth: 1,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: moderateScale(16),
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: Spacing.xs,
        marginRight: Spacing.sm,
    },
    mainHeaderTitle: {
        fontSize: moderateScale(20),
        fontWeight: '800',
    },
    headerRightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
    },
    iconBtn: {
        padding: moderateScale(4),
    },
    locationText: {
        fontSize: moderateScale(14),
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        borderTopLeftRadius: moderateScale(24),
        borderTopRightRadius: moderateScale(24),
        paddingHorizontal: Spacing.md,
        paddingBottom: moderateScale(40),
        paddingTop: moderateScale(12),
    },
    sheetIndicator: {
        width: moderateScale(40),
        height: moderateScale(5),
        backgroundColor: '#E5E7EB',
        borderRadius: moderateScale(3),
        alignSelf: 'center',
        marginBottom: Spacing.md,
    },
    sheetTitle: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    locationItem: {
        paddingVertical: moderateScale(14),
        paddingHorizontal: Spacing.md,
        borderRadius: moderateScale(12),
        marginBottom: moderateScale(8),
        borderWidth: 1,
        borderColor: 'transparent',
    },
    locationItemActive: {
    },
    locationItemText: {
        fontSize: moderateScale(15),
        fontWeight: '500',
    },
    locationItemTextActive: {
        fontWeight: '600',
    },
    dropdownOverlay: {
        flex: 1,
        top: moderateScale(-20),
    },
    dropdownMenu: {
        position: 'absolute',
        right: Spacing.md,
        borderRadius: moderateScale(12),
        width: moderateScale(160),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        zIndex: 100,
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingVertical: moderateScale(12),
        paddingHorizontal: Spacing.md,
    },
    dropdownItemBorder: {
        borderBottomWidth: 1,
    },
    dropdownItemText: {
        fontSize: moderateScale(14),
        fontWeight: '500',
    },
    dropdownItemTextDanger: {
    },
});
