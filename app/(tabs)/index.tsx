import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, StatusBar, Pressable } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Spacing } from '@/app/shared/constants/Theme';
import {
  Hospital, Briefcase, Scanning, Drop,
  Activity, Heart, Profile2User, Building3,
  ShieldSecurity, Wallet3, Moneys, Building, Headphone,
  Personalcard, Send2, Calendar, CalendarTick, Routing,
  Verify,
  Folder
} from 'iconsax-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FlaskConical } from 'lucide-react-native';
import AppHeader from '@/app/shared/components/AppHeader';
import { useThemeColor } from '../shared/hooks/useThemeColor';

const DEPARTMENTS = [
  { name: 'Accounting', Icon: Wallet3 },
  { name: 'Admin', Icon: ShieldSecurity },
  { name: 'Appointments', Icon: CalendarTick },
  { name: 'Appt Workflow', Icon: Routing },
  { name: 'Blood Bank', Icon: Drop },
  { name: 'CRM', Icon: Headphone },
  { name: 'Case Management', Icon: Personalcard },
  { name: 'Clients', Icon: Profile2User },
  { name: 'Clinic', Icon: Hospital },
  { name: 'Corporate', Icon: Building },
  { name: 'Documentation', Icon: Folder },
  { name: 'ECG', Icon: Heart },
  { name: 'Finance', Icon: Moneys },
  { name: 'Immunization', Icon: Activity },
  { name: 'Laboratory', Icon: FlaskConical },
  { name: 'Managed Care', Icon: Verify },
  { name: 'Pharmacy', Icon: Briefcase },
  { name: 'Radiology', Icon: Scanning },
  { name: 'Referral', Icon: Send2 },
  { name: 'Schedule', Icon: Calendar },
  { name: 'Theatre', Icon: Profile2User },
  { name: 'Ward', Icon: Building3 },
];

export default function DepartmentsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const primaryLightColor = useThemeColor({}, 'primaryLight');

  const filteredDepartments = DEPARTMENTS.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <AppHeader
        title="Departments"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor }]}>
          {filteredDepartments.map((item, itemIdx) => (
            <Pressable
              key={itemIdx}
              style={({ pressed, hovered }: any) => [
                styles.itemRow,
                itemIdx !== filteredDepartments.length - 1 && [styles.itemBorder, { borderBottomColor: borderColor }],
                (pressed || hovered) && { backgroundColor: primaryLightColor }
              ]}
              onPress={() => router.push(`/departments/${item.name}`)}
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
