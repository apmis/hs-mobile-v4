import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/src/shared/hooks/useThemeColor';
import ProfileScreen from '../(features)/profile';



// import { 
//   Building2, 
//   ChevronRight, 
//   Bell, 
//   Lock, 
//   Palette, 
//   LogOut,
//   Hospital
// } from 'lucide-react-native';
// import { Verify } from 'iconsax-react-native';

export default function Profile() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ProfileScreen
        styles={styles}
      />
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
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
