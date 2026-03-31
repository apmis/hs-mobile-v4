import React from 'react';
import { Tabs } from 'expo-router';
import { Home2, People, MessageText, User } from 'iconsax-react-native';
import { Colors } from '../../constants/Theme';
import { Platform } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? moderateScale(80) : moderateScale(60),
          paddingBottom: Platform.OS === 'ios' ? moderateScale(25) : moderateScale(10),
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
        name="index" 
        options={{
          title: 'HEALTH',
          tabBarIcon: ({ color, size }) => <Home2 size={size as number} color={color} variant="Bold" />,
        }} 
      />
      <Tabs.Screen 
        name="departments" 
        options={{
          title: 'DEPTS',
          tabBarIcon: ({ color, size }) => <People size={size as number} color={color} variant="Bold" />,
        }} 
      />
      <Tabs.Screen 
        name="chats" 
        options={{
          title: 'CHATS',
          tabBarIcon: ({ color, size }) => <MessageText size={size as number} color={color} variant="Bold" />,
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'PROFILE',
          tabBarIcon: ({ color, size }) => <User size={size as number} color={color} variant="Bold" />,
        }} 
      />
    </Tabs>
  );
}

const styles: any = ScaledSheet.create({});
