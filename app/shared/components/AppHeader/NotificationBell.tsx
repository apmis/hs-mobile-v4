import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useNotifications } from '@/app/shared/api/notifications';
import { useUser } from '@/app/shared/api/auth';

interface NotificationBellProps {
  color: string;
}

export default function NotificationBell({ color }: NotificationBellProps) {
  const router = useRouter();
  const { data: user } = useUser();
  const { data: notifications = [] } = useNotifications();

  const unreadCount = notifications.filter((n: any) => {
    const userId = user?.currentEmployee?._id || user?._id;
    return userId && !(n.isRead || []).includes(userId);
  }).length;

  return (
    <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(features)/notifications')}>
      <View>
        <Bell size={moderateScale(24)} color={color} />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = ScaledSheet.create({
  iconBtn: {
    padding: moderateScale(4),
  },
  badge: {
    position: 'absolute',
    top: moderateScale(-4),
    right: moderateScale(-4),
    backgroundColor: '#EF4444',
    borderRadius: moderateScale(10),
    minWidth: moderateScale(18),
    height: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(4),
    // borderWidth: 1.5,
    //borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: moderateScale(10),
    fontWeight: 'bold',
  },
});
