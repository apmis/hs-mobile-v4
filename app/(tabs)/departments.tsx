import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Colors, Spacing } from '../../constants/Theme';
import {
  Health, ShieldTick, People,
  Hospital, Briefcase, Scanning, Drop,
  Activity, Heart, Profile2User, Building3,
  ShieldSecurity, Wallet3, Moneys, Building, Headphone,
  Personalcard, Send2, Calendar, CalendarTick, Routing,
  Verify, ArrowRight2
} from 'iconsax-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const DEPARTMENTS = [
  {
    title: 'Medical',
    Icon: Health,
    headerColor: '#86EFAC', 
    headerIconColor: '#166534', 
    items: [
      { name: 'Clinic', Icon: Hospital },
      { name: 'Pharmacy', Icon: Briefcase },
      { name: 'Radiology', Icon: Scanning },
      { name: 'Blood Bank', Icon: Drop },
      { name: 'Immunization', Icon: Activity },
      { name: 'ECG', Icon: Heart },
      { name: 'Theatre', Icon: Profile2User },
      { name: 'Ward', Icon: Building3 },
    ],
  },
  {
    title: 'Admin',
    Icon: ShieldTick,
    headerColor: '#A5C2F6', 
    headerIconColor: '#1D4ED8',
    items: [
      { name: 'Admin', Icon: ShieldSecurity },
      { name: 'Accounting', Icon: Wallet3 },
      { name: 'Finance', Icon: Moneys },
      { name: 'Corporate', Icon: Building },
      { name: 'CRM', Icon: Headphone },
    ],
  },
  {
    title: 'Operations',
    Icon: People,
    headerColor: '#86EFAC',
    headerIconColor: '#166534',
    items: [
      { name: 'Case Management', Icon: Personalcard },
      { name: 'Referral', Icon: Send2 },
      { name: 'Schedule', Icon: Calendar },
      { name: 'Appointments', Icon: CalendarTick },
      { name: 'Appt Workflow', Icon: Routing },
      { name: 'Managed Care', Icon: Verify },
    ],
  },
];

export default function DepartmentsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Department Directory</Text>
          <Text style={styles.subtitle}>Navigate through our specialized medical, administrative, and operational units.</Text>
        </View>

        {DEPARTMENTS.map((dept, index) => (
          <View key={index} style={styles.categoryContainer}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIconContainer, { backgroundColor: dept.headerColor }]}>
                <dept.Icon size={moderateScale(18)} color={dept.headerIconColor} variant="Bold" />
              </View>
              <Text style={styles.categoryTitle}>{dept.title}</Text>
            </View>

            <View style={styles.card}>
              {dept.items.map((item, itemIdx) => (
                <TouchableOpacity 
                  key={itemIdx} 
                  style={[
                    styles.itemRow
                    // itemIdx !== dept.items.length - 1 && styles.itemBorder
                  ]}
                  activeOpacity={0.7}
                  onPress={() => router.push(`/department/${item.name}`)}
                >
                  <View style={styles.itemIconContainer}>
                    <item.Icon size={moderateScale(20)} color={Colors.primary} variant="Bold" />
                  </View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <ArrowRight2 size={moderateScale(20)} color="#A0A0A0" variant="Linear" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
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
    padding: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  header: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: Spacing.sm,
    letterSpacing: -0.5,
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
    backgroundColor: Colors.white,
    borderRadius: moderateScale(18),
    paddingHorizontal: Spacing.md,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
