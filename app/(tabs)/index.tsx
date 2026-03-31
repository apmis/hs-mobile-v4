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
  People, 
  Activity, 
  Calendar, 
  Add, 
  MessageText,
  ArchiveTick,
  Danger,
  DocumentText,
  Health
} from 'iconsax-react-native';
import { Colors, Typography } from '../../constants/Theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingHorizontal: moderateScale(20) }]}>
          <Text style={styles.title}>Facility Overview</Text>
          <Text style={styles.subtitle}>St. Jude Medical Center</Text>
        </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Total Patients Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <People size={moderateScale(18)} color={Colors.primary} variant="Bold" />
            <Text style={styles.metricLabel}>TOTAL PATIENTS</Text>
          </View>
          <Text style={styles.metricValue}>1,284</Text>
          <View style={styles.trendRow}>
            <View style={styles.trendBadge}>
              <Text style={styles.trendText}>+2.4%</Text>
            </View>
            <Text style={styles.trendLabel}>vs last month</Text>
          </View>
        </View>

        {/* Active Cases Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Activity size={moderateScale(18)} color="#2E7D32" variant="Bold" />
            <Text style={[styles.metricLabel, { color: '#2E7D32' }]}>ACTIVE CASES</Text>
          </View>
          <Text style={styles.metricValue}>342</Text>
          <View style={styles.progressBackground}>
            <View style={[styles.progressBar, { width: '70%', backgroundColor: '#2E7D32' }]} />
          </View>
        </View>

        {/* Today's Visits Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Calendar size={moderateScale(18)} color={Colors.primary} variant="Bold" />
            <Text style={styles.metricLabel}>TODAY'S VISITS</Text>
          </View>
          <Text style={styles.metricValue}>48</Text>
          <View style={styles.avatarRow}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={[styles.avatar, { left: (i - 1) * -10, backgroundColor: '#E0E0E0' }]} />
            ))}
            <View style={[styles.avatarCircle, { left: 2 * -10 }]}>
              <Text style={styles.avatarMore}>+45</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.actionButtonPrimary}>
          <View>
            <Text style={styles.actionLabel}>SCHEDULE</Text>
            <Text style={styles.actionTitle}>New Appointment</Text>
          </View>
          <View style={styles.actionIconContainer}>
            <Add size={24} color={Colors.primary} variant="Bold" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButtonSecondary}>
          <View>
            <Text style={styles.actionLabelSecondary}>LABORATORY</Text>
            <Text style={styles.actionTitleSecondary}>Urgent Lab Result</Text>
          </View>
          <MessageText size={24} color="#0047AB" variant="Bold" />
        </TouchableOpacity>

        {/* Critical Intelligence Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Critical Intelligence</Text>
          <TouchableOpacity style={styles.archiveAll}>
            <Text style={styles.archiveText}>Archive All</Text>
            <ArchiveTick size={16} color="#0047AB" variant="Bold" />
          </TouchableOpacity>
        </View>

        {/* Alerts List */}
        <View style={styles.alertCardRed}>
          <View style={styles.alertIconBgRed}>
            <Danger size={24} color={Colors.white} variant="Bold" />
          </View>
          <View style={styles.alertContent}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitleRed}>ICU Capacity Warning</Text>
              <Text style={styles.timeLabel}>2 MINS AGO</Text>
            </View>
            <Text style={styles.alertDescription}>
              Ward 4B ICU reaching 95% capacity. Divert non-critical emergency arrivals to Sector C.
            </Text>
          </View>
        </View>

        <View style={styles.alertCardBlue}>
          <View style={styles.alertIconBgBlue}>
            <DocumentText size={24} color={Colors.white} variant="Bold" />
          </View>
          <View style={styles.alertContent}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitle}>Surgery Report Finalized</Text>
              <Text style={styles.timeLabel}>15 MINS AGO</Text>
            </View>
            <Text style={styles.alertDescription}>
              The post-operative report for Patient #8821 is ready for Dr. Aris's signature.
            </Text>
          </View>
        </View>

        <View style={styles.alertCardGreen}>
          <View style={styles.alertIconBgGreen}>
            <Health size={24} color={Colors.white} variant="Bold" />
          </View>
          <View style={styles.alertContent}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitle}>Pharmacy Restock</Text>
              <Text style={styles.timeLabel}>1 HOUR AGO</Text>
            </View>
            <Text style={styles.alertDescription}>
              Inventory for generic insulin and IV saline bags has been replenished.
            </Text>
          </View>
        </View>

        {/* On-Duty Staff */}
        <View style={styles.staffSection}>
          <View style={styles.staffHeader}>
            <Text style={styles.sectionTitle}>On-Duty Staff</Text>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>12 ACTIVE</Text>
            </View>
          </View>

          {[
            { 
              name: 'Dr. Sarah Jenkins', 
              specialty: 'Cardiology',
              image: 'https://randomuser.me/api/portraits/women/44.jpg'
            },
            { 
              name: 'Marcus Chen, RN', 
              specialty: 'Pediatrics',
              image: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            { 
              name: 'Dr. Robert Miller', 
              specialty: 'Orthopedics',
              image: 'https://randomuser.me/api/portraits/men/46.jpg'
            },
          ].map((staff, idx) => (
            <TouchableOpacity key={idx} style={styles.staffItem} onPress={() => router.push({
                  pathname: `/chat/staff-${idx}`,
                  params: { fallbackName: staff.name, fallbackAvatar: staff.image }
                })}>
              <View style={styles.staffAvatar}>
                <Image source={{ uri: staff.image }} style={styles.staffImage} />
                <View style={styles.statusDot} />
              </View>
              <View style={styles.staffInfo}>
                <Text style={styles.staffName}>{staff.name}</Text>
                <Text style={styles.staffSpecialty}>{staff.specialty}</Text>
              </View>
              <TouchableOpacity 
                style={styles.chatButton}
                onPress={() => router.push({
                  pathname: `/chat/staff-${idx}`,
                  params: { fallbackName: staff.name, fallbackAvatar: staff.image }
                })}
              >
                <MessageText size={20} color="#0059B2" variant="Bold" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/directory')}
            activeOpacity={0.7}
          >
            <Text style={styles.viewAllText}>View All Directory</Text>
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
    paddingHorizontal: '10@ms',
    paddingBottom: '10@ms',
  },
  header: {
    marginBottom: '14@vs',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: '14@vs',
  },
  title: {
    ...Typography.h1,
    fontSize: '26@ms',
  },
  subtitle: {
    ...Typography.subtitle,
    fontSize: '14@ms',
    marginTop: '4@vs',
  },
  metricCard: {
    backgroundColor: Colors.white,
    borderRadius: '24@ms',
    padding: '24@ms',
    marginBottom: '16@vs',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '12@vs',
    gap: '8@s',
  },
  metricLabel: {
    fontSize: '12@ms',
    fontWeight: '700',
    color: '#3949AB',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: '40@ms',
    fontWeight: '700',
    color: Colors.text,
    marginBottom: '12@vs',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8@s',
  },
  trendBadge: {
    backgroundColor: '#C8E6C9',
    paddingHorizontal: '8@s',
    paddingVertical: '4@vs',
    borderRadius: '12@ms',
  },
  trendText: {
    color: '#2E7D32',
    fontSize: '12@ms',
    fontWeight: '700',
  },
  trendLabel: {
    fontSize: '12@ms',
    color: Colors.textSecondary,
  },
  progressBackground: {
    height: '6@vs',
    backgroundColor: '#F5F5F5',
    borderRadius: '3@ms',
    marginTop: '8@vs',
  },
  progressBar: {
    height: '100%',
    borderRadius: '3@ms',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '32@ms',
  },
  avatar: {
    width: '32@ms',
    height: '32@ms',
    borderRadius: '16@ms',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatarCircle: {
    width: '32@ms',
    height: '32@ms',
    borderRadius: '16@ms',
    backgroundColor: '#0047AB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatarMore: {
    color: Colors.white,
    fontSize: '10@ms',
    fontWeight: '700',
  },
  actionButtonPrimary: {
    backgroundColor: '#0059B2',
    height: '80@vs',
    borderRadius: '24@ms',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '24@ms',
    marginBottom: '16@vs',
  },
  actionLabel: {
    fontSize: '10@ms',
    color: Colors.white,
    opacity: 0.8,
    fontWeight: '700',
    letterSpacing: 1,
  },
  actionTitle: {
    fontSize: '18@ms',
    color: Colors.white,
    fontWeight: '700',
    marginTop: '2@vs',
  },
  actionIconContainer: {
    width: '32@ms',
    height: '32@ms',
    borderRadius: '16@ms',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: '#E6E6E6',
    height: '80@vs',
    borderRadius: '24@ms',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '24@ms',
  },
  actionLabelSecondary: {
    fontSize: '10@ms',
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  actionTitleSecondary: {
    fontSize: '18@ms',
    color: Colors.text,
    fontWeight: '700',
    marginTop: '2@vs',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '32@vs',
    marginBottom: '16@vs',
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: '20@ms',
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
    marginBottom: '32@vs',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20@vs',
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
  staffImage: {
    width: '44@ms',
    height: '44@ms',
    borderRadius: '22@ms',
    backgroundColor: '#F3F4F6',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: '12@ms',
    height: '12@ms',
    borderRadius: '6@ms',
    backgroundColor: '#10B981',
    borderWidth: 2,
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
