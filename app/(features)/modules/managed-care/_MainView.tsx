import React from 'react';
import ChatInterface from '../_components/generic/ChatInterface';

export default function ManagedCareView() {
  const initialMessages = [
    {
      id: 'init-1',
      sender: 'Managed Care Copilot',
      text: "### Welcome to Managed Care\n\nThis module manages HMOs, policies, claims, and authorizations.\n\n**Manual Navigation**\nTap the More Options (⋮) menu in the top right corner to access specific sub-sections like Claims, Policies, Preauthorizations, and Tariffs.\n\n**AI Assistant**\nPrefer the fast way? Just ask me! You can type things like *\"Show me today's pending claims\"* or *\"Verify policy status.\"*",
      time: '',
      isMe: false,
    }
  ];

  const suggestedActions = [
    'What can you do?',
    'Show pending claims',
    'Verify HMO status',
  ];

  return (
    <ChatInterface
      initialMessages={initialMessages}
      suggestedActions={suggestedActions}
    />
  );
}
