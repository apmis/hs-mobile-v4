import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useUser } from '@/app/shared/api/auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useUser();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // If the authentication state is still loading from the server/storage, wait.
    if (isLoading) return;

    // Check if the user is currently trying to access a route inside the (auth) directory
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // 🚨 User is NOT authenticated, but trying to access the app -> Redirect to login
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // 🛡️ User IS authenticated, but sitting on the login screen -> Redirect to app
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments]);

  // Always return children so Expo Router can mount the navigation tree properly.
  // The useEffect will instantly redirect if unauthorized.
  return <>{children}</>;
}
