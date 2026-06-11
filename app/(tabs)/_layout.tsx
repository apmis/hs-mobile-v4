import React from 'react';
import { Tabs } from 'expo-router';
import { Call, Home2, MessageText, Profile, Setting2 } from 'iconsax-react-native';
import { Colors } from '@/app/shared/constants/Theme';
import { Platform } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? moderateScale(60) + insets.bottom : moderateScale(60) + Math.max(insets.bottom, moderateScale(10)),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, moderateScale(10)),
          paddingTop: moderateScale(10),
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
        },
        tabBarLabelStyle: {
          fontSize: moderateScale(11),
          fontWeight: '600' as const,
        }
      }}
    >
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, size, focused }) => <MessageText size={size as number} color={color} variant={focused ? "Bold" : "Linear"} />,
        }}
      />
      <Tabs.Screen
        name="departments"
        options={{
          title: 'Modules',
          tabBarIcon: ({ color, size, focused }) => <Home2 size={size as number} color={color} variant={focused ? "Bold" : "Linear"} />,
        }}
      />

      <Tabs.Screen
        name="index"
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
