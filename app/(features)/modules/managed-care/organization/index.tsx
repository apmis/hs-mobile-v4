import { ThemedText } from '@/src/shared/components/ui/ThemedText';
import { ThemedView } from '@/src/shared/components/ui/ThemedView';
import React from 'react';
import ManagedCareScreenWrapper from '../_ScreenWrapper';
import ChatInterface from '@/app/(features)/modules/_components/generic/ChatInterface';

export default function OrganizationScreen() {
  return (
    <ManagedCareScreenWrapper title="Organization">
      <ThemedView style={{ flex: 1 }}>
        <ThemedText type="subtitle" style={{ padding: 16, textAlign: 'center' }}>
          Organization Chats
        </ThemedText>
        <ChatInterface />
      </ThemedView>
    </ManagedCareScreenWrapper>
  );
}
