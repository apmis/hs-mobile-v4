import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Theme';

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

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + moderateScale(20), paddingBottom: insets.bottom + moderateScale(40) }]}
        showsVerticalScrollIndicator={false}
      >
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
          
          <Text style={styles.name}>Alex Rivera</Text>
          <Text style={styles.role}>Senior Care Coordinator</Text>
          
          <View style={styles.staffIdPill}>
            <Text style={styles.staffIdText}>STAFF ID: 8820</Text>
          </View>
        </View>

        {/* Facility Overview Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Facility Overview</Text>
            <Building2 size={moderateScale(20)} color="#0059B2" />
          </View>
          
          <View style={styles.facilityContent}>
            <View style={styles.facilityIconBox}>
              <Hospital size={moderateScale(22)} color="#4B5563" />
            </View>
            <View style={styles.facilityInfo}>
              <Text style={styles.activeSiteLabel}>ACTIVE SITE</Text>
              <Text style={styles.facilityName}>Test Facility</Text>
              <Text style={styles.facilityDesc}>North Wing - Specialized{'\n'}Diagnostics</Text>
            </View>
            <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Section */}
        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        
        <View style={styles.cardAlt}>
          {/* Notifications */}
          <TouchableOpacity style={styles.preferenceRow}>
            <View style={[styles.prefIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Bell size={moderateScale(20)} color="#2563EB" />
            </View>
            <View style={styles.prefTextCol}>
              <Text style={styles.prefTitle}>Notifications</Text>
              <Text style={styles.prefSub}>Alerts, updates & health reports</Text>
            </View>
            <ChevronRight size={moderateScale(20)} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Privacy & Security */}
          <TouchableOpacity style={styles.preferenceRow}>
            <View style={[styles.prefIconBox, { backgroundColor: '#ECFDF5' }]}>
              <Lock size={moderateScale(20)} color="#059669" />
            </View>
            <View style={styles.prefTextCol}>
              <Text style={styles.prefTitle}>Privacy & Security</Text>
              <Text style={styles.prefSub}>HIPAA compliance & data access</Text>
            </View>
            <ChevronRight size={moderateScale(20)} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Appearance */}
          <TouchableOpacity style={styles.preferenceRow}>
            <View style={[styles.prefIconBox, { backgroundColor: '#F5F3FF' }]}>
              <Palette size={moderateScale(20)} color="#7C3AED" />
            </View>
            <View style={styles.prefTextCol}>
              <Text style={styles.prefTitle}>Appearance</Text>
              <Text style={styles.prefSub}>Theme settings & accessibility</Text>
            </View>
            <ChevronRight size={moderateScale(20)} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={moderateScale(20)} color="#DC2626" />
          <Text style={styles.logoutText}>Logout from System</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>VERSION 4.2.0-CLINICAL • BUILD 902</Text>

      </ScrollView>
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingHorizontal: moderateScale(20),
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: moderateScale(28),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: moderateScale(16),
  },
  avatar: {
    width: moderateScale(96),
    height: moderateScale(96),
    borderRadius: moderateScale(48),
    borderWidth: moderateScale(3),
    borderColor: '#0059B2',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -moderateScale(2),
    right: -moderateScale(2),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(14),
    padding: moderateScale(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBg: {
    position: 'absolute',
    width: moderateScale(10),
    height: moderateScale(10),
    backgroundColor: '#FFFFFF',
    zIndex: -1,
  },
  name: {
    fontSize: moderateScale(22),
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: moderateScale(4),
  },
  role: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: moderateScale(12),
  },
  staffIdPill: {
    backgroundColor: '#86EFAC',
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(16),
  },
  staffIdText: {
    color: '#15803D',
    fontSize: moderateScale(11),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginBottom: moderateScale(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardAlt: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    paddingHorizontal: moderateScale(20),
    marginBottom: moderateScale(32),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(16),
  },
  cardTitle: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    color: '#1F2937',
  },
  facilityContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  facilityIconBox: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(12),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(16),
  },
  facilityInfo: {
    flex: 1,
  },
  activeSiteLabel: {
    fontSize: moderateScale(10),
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: moderateScale(4),
  },
  facilityName: {
    fontSize: moderateScale(15),
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: moderateScale(4),
  },
  facilityDesc: {
    fontSize: moderateScale(13),
    color: '#6B7280',
    lineHeight: moderateScale(18),
    paddingRight: moderateScale(10),
  },
  changeLink: {
    fontSize: moderateScale(14),
    fontWeight: '800',
    color: '#0059B2',
    marginTop: moderateScale(6),
  },
  sectionTitle: {
    fontSize: moderateScale(12),
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: moderateScale(12),
    marginLeft: moderateScale(6),
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(12),
  },
  prefIconBox: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(16),
  },
  prefTextCol: {
    flex: 1,
    paddingRight: moderateScale(10),
  },
  prefTitle: {
    fontSize: moderateScale(15),
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: moderateScale(2),
  },
  prefSub: {
    fontSize: moderateScale(12),
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: moderateScale(4),
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: moderateScale(24),
    paddingVertical: moderateScale(14),
    marginBottom: moderateScale(32),
  },
  logoutText: {
    marginLeft: moderateScale(10),
    fontSize: moderateScale(15),
    fontWeight: '800',
    color: '#DC2626',
  },
  versionText: {
    textAlign: 'center',
    fontSize: moderateScale(10),
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1,
  }
});
