import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, StatusBar, Pressable } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Spacing } from '@/src/shared/constants/Theme';
import { MODULES } from '@/src/shared/constants/Modules';
import { useThemeColor } from '@/src/shared/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '@/src/shared/components/AppHeader';
import { useUser } from '@/src/shared/api/auth';

export default function ModulesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: user } = useUser();

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const primaryLightColor = useThemeColor({}, 'primaryLight');

  const roles = user?.roles || [];
  const isOrgAdmin = roles.includes('Admin');
  const facilityModules = user?.facilityDetail?.facilityModules || [];

  const facilitySortedMenuItems = MODULES.filter((item) =>
    facilityModules.includes(item.name)
  );

  const getFacilitySortedMenuItems = facilitySortedMenuItems.length > 0 
    ? facilitySortedMenuItems 
    : MODULES.filter((item) => item.name === 'Admin');

  const rolesMenuList = isOrgAdmin
    ? getFacilitySortedMenuItems
    : getFacilitySortedMenuItems.filter((item) => roles.includes(item.name));

  const finalModules = user?.stacker ? MODULES : rolesMenuList;

  const filteredModules = finalModules.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <AppHeader
        title="Modules"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor }]}>
          {filteredModules.map((item, itemIdx) => (
            <Pressable
              key={itemIdx}
              style={({ pressed, hovered }: any) => [
                styles.itemRow,
                itemIdx !== filteredModules.length - 1 && [styles.itemBorder, { borderBottomColor: borderColor }],
                (pressed || hovered) && { backgroundColor: primaryLightColor }
              ]}
              onPress={() => router.push(`/modules/${item.name}`)}
            >
              <View style={[styles.itemIconContainer, { backgroundColor: cardColor }]}>
                <item.Icon size={moderateScale(20)} color={primaryColor} variant="Bold" />
              </View>
              <Text style={[styles.itemName, { color: textColor }]}>{item.name}</Text>
              {/* <ArrowRight2 size={moderateScale(20)} color={textSecondaryColor} variant="Linear" /> */}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
  },
  header: {
    marginBottom: '14@vs',
    borderBottomWidth: 1,
    paddingBottom: '14@vs',
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    height: moderateScale(48),
    borderWidth: 1,
    marginTop: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateScale(12),
    fontSize: moderateScale(15),
  },
  subtitle: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22),
    fontWeight: '400',
  },
  categoryContainer: {
    marginBottom: Spacing.lg,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  categoryIconContainer: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  categoryTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
  },
  card: {
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: moderateScale(12),
  },
  itemHovered: {
  },
  itemBorder: {
    borderBottomWidth: 1,
  },
  itemIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  itemName: {
    flex: 1,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});
