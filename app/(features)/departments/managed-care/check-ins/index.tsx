import { ThemedText } from '@/app/shared/components/ui/ThemedText';
import { ThemedView } from '@/app/shared/components/ui/ThemedView';
import React from 'react';
import ManagedCareScreenWrapper from '../_ScreenWrapper';
import ChatInterface from '@/app/(features)/departments/_components/generic/ChatInterface';

export default function CheckInsScreen() {
  return (
    <ManagedCareScreenWrapper title="Check-ins">
      <ThemedView style={{ flex: 1 }}>
        <ThemedText type="subtitle" style={{ padding: 16, textAlign: 'center' }}>
          Check-ins Details
        </ThemedText>
        <ChatInterface />
      </ThemedView>
    </ManagedCareScreenWrapper>
  );
}
