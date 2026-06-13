import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useThemeColor } from '@/app/shared/hooks/useThemeColor';
import AppHeader from '@/app/shared/components/AppHeader';

interface Props {
  title: string;
  children: React.ReactNode;
}

const MORE_OPTIONS = [
  'Search', 'Appointments', 'Check-ins', 'Referrals',
  'Pre-authorisations', 'Claims', 'Payments', 'Tariffs',
  'Complaints', 'Analytics'
];

export default function ManagedCareScreenWrapper({ title, children }: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const router = useRouter();

  const handleOptionPress = (option: string) => {
    const slug = option.toLowerCase().replace(' ', '-');
    router.replace(`/departments/managed-care/${slug}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <AppHeader
          title={title}
          subtitle="Managed Care"
          showBack={true}
          showSearch={false}
          showIcons={true}
          showLocation={false}
          showMoreOptions={true}
          moreOptions={MORE_OPTIONS}
          onOptionPress={handleOptionPress}
        />
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
