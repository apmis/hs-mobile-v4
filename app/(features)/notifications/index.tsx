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
import { useNotifications, useMarkAsRead } from '@/app/shared/api/notifications';
import { useUser } from '@/app/shared/api/auth';
import { DataViewState } from '@/app/shared/components/ui/DataViewState';

const formatRelativeTime = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'JUST NOW';
  if (minutes < 60) return `${minutes} MINS AGO`;
  if (hours < 24) return `${hours} HOURS AGO`;
  return `${days} DAYS AGO`;
};

export default function CriticalIntelligenceScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: user } = useUser();
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsReadMutation = useMarkAsRead();

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');

  //console.log("notifications", notifications)

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Notifications</Text>
        </View>

        {/* Alerts List */}
        <DataViewState
          isLoading={isLoading}
          data={notifications}
          render={(data) => (
            <>
              {data.map((notification: any) => {
                const isUnread = !(notification.isRead || []).includes(user?.currentEmployee?._id || user?._id);

                // Determine styling based on type (mocking it slightly based on common types, defaulting to blue)
                let cardStyle = styles.alertCardBlue;
                let iconBgStyle = styles.alertIconBgBlue;
                let titleStyle = styles.alertTitle;
                let Icon = FileText;

                if (notification.type === 'Complaint-Message' || notification.type?.toLowerCase().includes('warning')) {
                  cardStyle = styles.alertCardRed;
                  iconBgStyle = styles.alertIconBgRed;
                  titleStyle = styles.alertTitleRed;
                  Icon = AlertTriangle;
                } else if (notification.type === 'success' || notification.type?.toLowerCase().includes('restock')) {
                  cardStyle = styles.alertCardGreen;
                  iconBgStyle = styles.alertIconBgGreen;
                  titleStyle = styles.alertTitle;
                  Icon = Stethoscope;
                } else if (notification.type === 'message') {
                  Icon = MessageCircle;
                }

                return (
                  <TouchableOpacity
                    key={notification._id}
                    style={[cardStyle, { backgroundColor: cardColor, borderColor, opacity: isUnread ? 1 : 0.6 }]}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (isUnread) markAsReadMutation.mutate(notification);
                      //if (notification.pageUrl) router.push(notification.pageUrl as any);
                    }}
                  >
                    <View style={iconBgStyle}>
                      <Icon size={24} color="#FFFFFF" />
                    </View>
                    <View style={styles.alertContent}>
                      <View style={styles.alertHeader}>
                        <Text style={[titleStyle, titleStyle === styles.alertTitle && { color: textColor }, titleStyle === styles.alertTitleRed && { color: '#EF4444' }]}>
                          {notification.title || 'Notification'}
                        </Text>
                        <Text style={[styles.timeLabel, { color: textSecondaryColor }]}>
                          {formatRelativeTime(notification.createdAt)}
                        </Text>
                      </View>
                      <Text style={[styles.alertDescription, { color: textSecondaryColor }]}>
                        {notification.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        />


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
