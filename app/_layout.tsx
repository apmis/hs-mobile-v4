import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { View } from 'react-native';
import { useActiveTheme } from '@/app/shared/hooks/useThemeColor';
import { Colors, DarkColors } from '@/app/shared/constants/Theme';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useActiveTheme();

  useEffect(() => {
    // Hide splash screen immediately as we are using system fonts
    SplashScreen.hideAsync();
  }, []);

  const backgroundColor = theme === 'dark' ? DarkColors.background : Colors.background;

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor }}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor } }}>
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
