import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../constants/Theme';
import { Link2, Phone, PhoneMissed, PhoneIncoming, PhoneOutgoing, Video } from 'lucide-react-native';

const CALLS_DATA = [
  {
    id: '1',
    name: 'Alex Rivera',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    type: 'missed',
    isVideo: false,
    date: 'Today, 10:45 AM',
    count: 2
  },
  {
    id: '2',
    name: 'Surgical Team',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    type: 'outgoing',
    isVideo: true,
    date: 'Yesterday, 4:20 PM'
  },
  {
    id: '3',
    name: 'Dr. Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1594824432433-2ba7d4c9d5ec?q=80&w=200&auto=format&fit=crop',
    type: 'incoming',
    isVideo: true,
    date: 'Yesterday, 1:15 PM'
  },
  {
    id: '4',
    name: 'Marcus Chen, RN',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    type: 'incoming',
    isVideo: false,
    date: 'Monday, 9:00 AM'
  },
  {
    id: '5',
    name: 'Oncology Research',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    type: 'missed',
    isVideo: true,
    date: 'Sunday, 11:30 AM'
  }
];

export default function CallsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Calls</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Create Call Link */}
        <TouchableOpacity style={styles.createLinkCard} activeOpacity={0.7}>
          <View style={styles.linkIconContainer}>
            <Link2 size={moderateScale(20)} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <View style={styles.linkTextContainer}>
            <Text style={styles.linkTitle}>Create call link</Text>
            <Text style={styles.linkSubtitle}>Share a link for your Stack call</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Recent</Text>

        <View style={styles.callsCard}>
          {CALLS_DATA.map((call, idx) => {
            const isMissed = call.type === 'missed';
            return (
              <View key={call.id}>
                <TouchableOpacity style={styles.callRow} activeOpacity={0.7}>
                  <Image source={{ uri: call.avatar }} style={styles.avatar} />
                  
                  <View style={styles.callDetails}>
                    <Text style={[styles.callerName, isMissed && styles.missedName]} numberOfLines={1}>
                      {call.name} {call.count ? `(${call.count})` : ''}
                    </Text>
                    <View style={styles.callMetaRow}>
                      {call.type === 'missed' ? (
                        <PhoneMissed size={moderateScale(14)} color="#DC2626" />
                      ) : call.type === 'incoming' ? (
                        <PhoneIncoming size={moderateScale(14)} color="#059669" />
                      ) : (
                        <PhoneOutgoing size={moderateScale(14)} color="#6B7280" />
                      )}
                      <Text style={styles.timeText}>{call.date}</Text>
                    </View>
                  </View>

                  <View style={styles.actionIcons}>
                    <TouchableOpacity style={styles.iconBtn} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                      {call.isVideo ? (
                        <Video size={moderateScale(22)} color={Colors.primary} />
                      ) : (
                        <Phone size={moderateScale(20)} color={Colors.primary} />
                      )}
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {idx !== CALLS_DATA.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: '14@vs',
    marginBottom: '8@vs',
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: Spacing.xl * 2,
  },
  createLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    marginBottom: moderateScale(24),
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  linkIconContainer: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(16),
  },
  linkTextContainer: {
    flex: 1,
  },
  linkTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: moderateScale(2),
  },
  linkSubtitle: {
    fontSize: moderateScale(13),
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: moderateScale(12),
    marginLeft: moderateScale(4),
  },
  callsCard: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(16),
    paddingHorizontal: moderateScale(16),
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  callRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(14),
  },
  avatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    marginRight: moderateScale(14),
    backgroundColor: '#F3F4F6',
  },
  callDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  callerName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: moderateScale(4),
  },
  missedName: {
    color: '#DC2626',
  },
  callMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: moderateScale(13),
    color: '#6B7280',
    marginLeft: moderateScale(6),
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: moderateScale(12),
  },
  iconBtn: {
    padding: moderateScale(4),
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: moderateScale(62),
  }
});
