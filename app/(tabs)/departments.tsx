import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar, TextInput, Pressable } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Colors, Spacing } from '@/app/shared/constants/Theme';
import {
  Health, ShieldTick, People,
  Hospital, Briefcase, Scanning, Drop,
  Activity, Heart, Profile2User, Building3,
  ShieldSecurity, Wallet3, Moneys, Building, Headphone,
  Personalcard, Send2, Calendar, CalendarTick, Routing,
  Verify, ArrowRight2,
  Book,
  BookSaved,
  Folder
} from 'iconsax-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FlaskConical, Search, TestTube, X } from 'lucide-react-native';
//import AppHeader from '@/components/AppHeader';
import AppHeader from '@/app/shared/components/AppHeader';

const DEPARTMENTS = [
  { name: 'Admin', Icon: ShieldSecurity },
  { name: 'Clients', Icon: Profile2User },
  { name: 'Appointments', Icon: CalendarTick },
  { name: 'Clinic', Icon: Hospital },
  { name: 'Pharmacy', Icon: Briefcase },
  { name: 'Laboratory', Icon: FlaskConical },
  { name: 'Documentation', Icon: Folder },
  { name: 'Radiology', Icon: Scanning },
  { name: 'Blood Bank', Icon: Drop },
  { name: 'Immunization', Icon: Activity },
  { name: 'ECG', Icon: Heart },
  { name: 'Theatre', Icon: Profile2User },
  { name: 'Ward', Icon: Building3 },
  { name: 'Accounting', Icon: Wallet3 },
  { name: 'Finance', Icon: Moneys },
  { name: 'Corporate', Icon: Building },
  { name: 'CRM', Icon: Headphone },
  { name: 'Case Management', Icon: Personalcard },
  { name: 'Referral', Icon: Send2 },
  { name: 'Schedule', Icon: Calendar },
  { name: 'Appt Workflow', Icon: Routing },
  { name: 'Managed Care', Icon: Verify },
];

export default function DepartmentsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDepartments = DEPARTMENTS.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Modules"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {filteredDepartments.map((item, itemIdx) => (
            <Pressable
              key={itemIdx}
              style={({ pressed, hovered }: any) => [
                styles.itemRow,
                itemIdx !== filteredDepartments.length - 1 && styles.itemBorder,
                (pressed || hovered) && styles.itemHovered
              ]}
              onPress={() => router.push(`/department/${item.name}`)}
            >
              <View style={styles.itemIconContainer}>
                <item.Icon size={moderateScale(20)} color={Colors.primary} variant="Bold" />
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
              {/* <ArrowRight2 size={moderateScale(20)} color="#A0A0A0" variant="Linear" /> */}
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
    backgroundColor: '#F7F9FA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
  },
  header: {
    marginBottom: '14@vs',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: '14@vs',
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    height: moderateScale(48),
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateScale(12),
    fontSize: moderateScale(15),
    color: Colors.text,
  },
  subtitle: {
    fontSize: moderateScale(15),
    color: '#4B5563',
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
    color: '#1A1A1A',
  },
  card: {
    backgroundColor: '#F7F9FA',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: moderateScale(12),
  },
  itemHovered: {
    backgroundColor: '#E5E7EB',
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2ff',
  },
  itemIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#F3F6FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  itemName: {
    flex: 1,
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#1F2937',
  },
});
