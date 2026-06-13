import React from 'react';
import { Tabs } from 'expo-router';
import { Call, Home2, MessageText, Profile, Setting2 } from 'iconsax-react-native';
import { Colors } from '@/app/shared/constants/Theme';
import { useThemeColor } from '../shared/hooks/useThemeColor';
import { Platform } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const primaryColor = useThemeColor({}, 'primary');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: textSecondaryColor,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? moderateScale(60) + insets.bottom : moderateScale(60) + Math.max(insets.bottom, moderateScale(10)),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, moderateScale(10)),
          paddingTop: moderateScale(10),
          backgroundColor: backgroundColor,
          borderTopWidth: 1,
          borderTopColor: borderColor,
        },
        tabBarLabelStyle: {
          fontSize: moderateScale(11),
          fontWeight: '600' as const,
        }
      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          title: 'Departments',
          tabBarIcon: ({ color, size, focused }) => <Home2 size={size as number} color={color} variant={focused ? "Bold" : "Linear"} />,
        }}
      />

      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, size, focused }) => <MessageText size={size as number} color={color} variant={focused ? "Bold" : "Linear"} />,
        }}
      />

      <Tabs.Screen
        name="calls"
        options={{
          title: 'Calls',
          tabBarIcon: ({ color, size, focused }) => <Call size={size as number} color={color} variant={focused ? "Bold" : "Linear"} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => <Profile size={size as number} color={color} variant={focused ? "Bold" : "Linear"} />,
        }}
      />
    </Tabs>
  );
}

const styles: any = ScaledSheet.create({});
