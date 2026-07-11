import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useUser } from '@/app/shared/api/auth';
import { useThemeColor } from '@/app/shared/hooks/useThemeColor';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const backgroundColor = useThemeColor({}, 'background');
  const { data: user, isLoading } = useUser();
  const segments = useSegments();
  const router = useRouter();

  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // Wait until the root layout navigation state is mounted before redirecting
    if (!rootNavigationState?.key) return;

    // If the authentication state is still loading from the server/storage, wait.
    // user === undefined means the query hasn't settled (neither null nor data).
    if (isLoading || user === undefined) return;

    // Check if the user is currently trying to access a route inside the (auth) directory
    const inAuthGroup = segments[0] === '(auth)';
    const isAtRoot = !segments[0];

    console.log("=== AUTH STATUS CHECK ===");
    console.log("Is Loading:", isLoading);
    console.log("User object exists?", !!user);
    if (user) console.log("User Name:", user.firstname, user.lastname);
    console.log("Current segments:", segments);
    console.log("=========================");

    if (user === null && (!inAuthGroup || isAtRoot)) {
      // console.log("[AuthGuard] Redirecting to login because user === null");
      // 🚨 User is explicitly NOT authenticated -> Redirect to login
      router.replace('/(auth)/login');
    } else if (user && (inAuthGroup || isAtRoot)) {
      //console.log("[AuthGuard] Redirecting to tabs because user is authenticated");
      // 🛡️ User IS authenticated, but sitting on the login screen or root -> Redirect to app
      router.replace('/(tabs)');
    } else {
      // Auth check is complete AND we are on the correct screen.
      // It is now safe to hide the splash screen!
      SplashScreen.hideAsync();
    }

  }, [user, isLoading, segments, rootNavigationState?.key]);

  // Always return children so Expo Router can mount the navigation tree properly.
  // We use an absolute full-screen View to cover the routing process while auth loads.
  return (
    <>
      {children}
      {(isLoading || user === undefined) && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor, zIndex: 99999 }]} />
      )}
    </>
  );
}
