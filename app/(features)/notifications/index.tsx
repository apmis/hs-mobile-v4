import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import {
  AlertTriangle,
  FileText,
  Archive,
  MessageCircle,
  Stethoscope
} from 'lucide-react-native';
import { Colors, Typography } from '@/app/shared/constants/Theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useThemeColor } from '../../shared/hooks/useThemeColor';

export default function CriticalIntelligenceScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Critical Intelligence</Text>
          <TouchableOpacity style={styles.archiveAll}>
            <Text style={[styles.archiveText, { color: primaryColor }]}>Archive All</Text>
            <Archive size={16} color={primaryColor} />
          </TouchableOpacity>
        </View>

        {/* Alerts List */}
        <View style={[styles.alertCardRed, { backgroundColor: cardColor, borderColor }]}>
          <View style={styles.alertIconBgRed}>
            <AlertTriangle size={24} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <View style={styles.alertContent}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitleRed}>ICU Capacity Warning</Text>
              <Text style={[styles.timeLabel, { color: textSecondaryColor }]}>2 MINS AGO</Text>
            </View>
            <Text style={[styles.alertDescription, { color: textSecondaryColor }]}>
              Ward 4B ICU reaching 95% capacity. Divert non-critical emergency arrivals to Sector C.
            </Text>
          </View>
        </View>

        <View style={[styles.alertCardBlue, { backgroundColor: cardColor, borderColor }]}>
          <View style={styles.alertIconBgBlue}>
            <FileText size={24} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <View style={styles.alertContent}>
            <View style={styles.alertHeader}>
              <Text style={[styles.alertTitle, { color: textColor }]}>Surgery Report Finalized</Text>
              <Text style={[styles.timeLabel, { color: textSecondaryColor }]}>15 MINS AGO</Text>
            </View>
            <Text style={[styles.alertDescription, { color: textSecondaryColor }]}>
              The post-operative report for Patient #8821 is ready for Dr. Aris's signature.
            </Text>
          </View>
        </View>

        <View style={[styles.alertCardGreen, { backgroundColor: cardColor, borderColor }]}>
          <View style={styles.alertIconBgGreen}>
            <Stethoscope size={24} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <View style={styles.alertContent}>
            <View style={styles.alertHeader}>
              <Text style={[styles.alertTitle, { color: textColor }]}>Pharmacy Restock</Text>
              <Text style={[styles.timeLabel, { color: textSecondaryColor }]}>1 HOUR AGO</Text>
            </View>
            <Text style={[styles.alertDescription, { color: textSecondaryColor }]}>
              Inventory for generic insulin and IV saline bags has been replenished.
            </Text>
          </View>
        </View>

        {/* On-Duty Staff */}
        <View style={[styles.staffSection, { backgroundColor: cardColor }]}>
          <View style={styles.staffHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>On-Duty Staff</Text>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>12 ACTIVE</Text>
            </View>
          </View>

          {[
            { name: 'Dr. Sarah Jenkins', specialty: 'Cardiology' },
            { name: 'Marcus Chen, RN', specialty: 'Pediatrics' },
            { name: 'Dr. Robert Miller', specialty: 'Orthopedics' },
          ].map((staff, idx) => (
            <View key={idx} style={styles.staffItem}>
              <View style={styles.staffAvatar}>
                <View style={[styles.staffInitialCircle, { backgroundColor: borderColor, borderColor }]}>
                  <Text style={[styles.staffInitial, { color: primaryColor }]}>{staff.name[0]}</Text>
                </View>
                <View style={[styles.statusDot, { borderColor: cardColor }]} />
              </View>
              <View style={styles.staffInfo}>
                <Text style={[styles.staffName, { color: textColor }]}>{staff.name}</Text>
                <Text style={[styles.staffSpecialty, { color: textSecondaryColor }]}>{staff.specialty}</Text>
              </View>
              <TouchableOpacity style={styles.chatButton}>
                <MessageCircle size={20} color={primaryColor} />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={[styles.viewAllButton, { borderColor }]}>
            <Text style={[styles.viewAllText, { color: textColor }]}>View All Directory</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles: any = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: '20@ms',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24@vs',
  },
  title: {
    ...Typography.h1,
    fontSize: '24@ms',
  },
  archiveAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '4@s',
  },
  archiveText: {
    fontSize: '14@ms',
    fontWeight: '700',
    color: '#0047AB',
  },
  alertCardRed: {
    backgroundColor: '#FFF5F5',
    borderRadius: '20@ms',
    padding: '16@ms',
    flexDirection: 'row',
    marginBottom: '16@vs',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  alertCardBlue: {
    backgroundColor: '#F8FAFC',
    borderRadius: '20@ms',
    padding: '16@ms',
    flexDirection: 'row',
    marginBottom: '16@vs',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  alertCardGreen: {
    backgroundColor: '#F0FDF4',
    borderRadius: '20@ms',
    padding: '16@ms',
    flexDirection: 'row',
    marginBottom: '16@vs',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  alertIconBgRed: {
    width: '48@ms',
    height: '48@ms',
    borderRadius: '12@ms',
    backgroundColor: '#B91C1C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '12@s',
  },
  alertIconBgBlue: {
    width: '48@ms',
    height: '48@ms',
    borderRadius: '12@ms',
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '12@s',
  },
  alertIconBgGreen: {
    width: '48@ms',
    height: '48@ms',
    borderRadius: '12@ms',
    backgroundColor: '#15803D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '12@s',
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '4@vs',
  },
  alertTitleRed: {
    fontSize: '16@ms',
    fontWeight: '700',
    color: '#991B1B',
    flex: 1,
  },
  alertTitle: {
    fontSize: '16@ms',
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  timeLabel: {
    fontSize: '10@ms',
    fontWeight: '700',
    color: Colors.textSecondary,
    marginLeft: '8@s',
  },
  alertDescription: {
    fontSize: '14@ms',
    color: Colors.textSecondary,
    lineHeight: '20@ms',
  },
  staffSection: {
    backgroundColor: Colors.white,
    borderRadius: '24@ms',
    padding: '24@ms',
    marginTop: '16@vs',
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20@vs',
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: '20@ms',
  },
  activeBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: '10@s',
    paddingVertical: '4@vs',
    borderRadius: '12@ms',
  },
  activeBadgeText: {
    color: '#059669',
    fontSize: '11@ms',
    fontWeight: '700',
  },
  staffItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '16@vs',
  },
  staffAvatar: {
    position: 'relative',
    marginRight: '12@s',
  },
  staffInitialCircle: {
    width: '44@ms',
    height: '44@ms',
    borderRadius: '22@ms',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  staffInitial: {
    fontSize: '18@ms',
    fontWeight: '700',
    color: Colors.primary,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: '10@ms',
    height: '10@ms',
    borderRadius: '5@ms',
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: '14@ms',
    fontWeight: '700',
    color: Colors.text,
  },
  staffSpecialty: {
    fontSize: '12@ms',
    color: Colors.textSecondary,
  },
  chatButton: {
    padding: '8@ms',
  },
  viewAllButton: {
    width: '100%',
    height: '44@vs',
    borderRadius: '12@ms',
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '8@vs',
  },
  viewAllText: {
    fontSize: '14@ms',
    fontWeight: '600',
    color: Colors.text,
  },
});
