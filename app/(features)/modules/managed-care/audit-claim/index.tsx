import { ThemedText } from '@/src/shared/components/ui/ThemedText';
import { ThemedView } from '@/src/shared/components/ui/ThemedView';
import React from 'react';
import ManagedCareScreenWrapper from '../_ScreenWrapper';
import ChatInterface from '@/app/(features)/modules/_components/generic/ChatInterface';

export default function AuditClaimScreen() {
  return (
    <ManagedCareScreenWrapper title="Audit Claim">
      <ThemedView style={{ flex: 1 }}>
        <ThemedText type="subtitle" style={{ padding: 16, textAlign: 'center' }}>
          Audit Claim Chats
        </ThemedText>
        <ChatInterface />
      </ThemedView>
    </ManagedCareScreenWrapper>
  );
}
