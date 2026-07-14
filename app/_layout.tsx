import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { View } from 'react-native';
import { useActiveTheme } from '@/src/shared/hooks/useThemeColor';
import { Colors, DarkColors } from '@/src/shared/constants/Theme';
import { QueryProvider } from '@/src/shared/providers/QueryProvider';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/src/shared/components/ui/ToastConfig';

import { AuthGuard } from '@/src/shared/providers/AuthGuard';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useActiveTheme();

  const backgroundColor = theme === 'dark' ? DarkColors.background : Colors.background;

  return (
    <QueryProvider>
      <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthGuard>
          <View style={{ flex: 1, backgroundColor }}>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor } }}>
              <Stack.Screen name="(auth)/login" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </View>
          <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
          <Toast config={toastConfig} />
        </AuthGuard>
      </ThemeProvider>
    </QueryProvider>
  );
}
