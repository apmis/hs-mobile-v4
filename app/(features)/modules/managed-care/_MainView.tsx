import React from 'react';
import ChatInterface, { Message } from '../_components/generic/ChatInterface';
import { useCopilotEngine } from '../_hooks/useCopilotEngine';
import { formatMessageTime } from '@/src/features/chat/utils';

export default function ManagedCareView() {
  const initialMessages: Message[] = [
    {
      id: 'init-1',
      sender: 'Managed Care Copilot',
      text: "### Welcome to Managed Care\n\nThis module manages HMOs, policies, claims, authorizations and so on.\n\n**Manual Navigation**\nTap the More Options (⋮) menu in the top right corner to access specific sub-sections like Claims, Policies, Preauthorizations, and Tariffs.\n\n**AI Assistant**\nPrefer the fast way? Just ask me! You can type things like *\"Show me today's pending claims\"* or *\"Verify policy status.\"*",
      time: formatMessageTime(new Date()),
      isMe: false,
      avatar: require('@/assets/images/Healthstack.png'),
      suggestedActions: [
        'What can you do?',
        'Show pending claims',
        'Verify HMO status',
      ]
    }
  ];

  const { messages, isTyping, handleSendText, handleAction } = useCopilotEngine({
    moduleName: 'Managed Care',
    initialMessages,
    actionHandlers: {}
  });

  return (
    <ChatInterface
      messages={messages}
      isTyping={isTyping}
      onSend={(text) => {
        // For now, all initial suggested actions go to the AI.
        // Data actions can be added later by checking specific texts.
        handleSendText(text);
      }}
    />
  );
}
