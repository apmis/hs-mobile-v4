import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useUser } from '@/src/shared/api/auth';
import { useChatRooms } from '@/src/features/chat/_api/chat';
import { CopilotChatDetail } from '@/src/features/chat/_components/ChatDetails/CopilotChatDetail';
import { GroupChatDetail } from '@/src/features/chat/_components/ChatDetails/GroupChatDetail';
import { ConsultationChatDetail } from '@/src/features/chat/_components/ChatDetails/ConsultationChatDetail';



// import { CopilotChatDetail } from '@/src/features/chat/_components/CopilotChatDetail';
// import { GroupChatDetail } from "./_components/GroupChatDetail";
// import { ConsultationChatDetail } from "./_components/ConsultationChatDetail";

export default function ChatWrapperScreen() {
  const { id, fallbackName, fallbackAvatar, initialQuery } = useLocalSearchParams();
  const { data: user } = useUser();
  const { data: chatRooms = [] } = useChatRooms();

  if (id === 'copilot') {
    return <CopilotChatDetail />;
  }

  const apiRoom = chatRooms.find((data: any) => data._id === id);
  const isGroup = apiRoom ? (apiRoom.members?.length > 2) : (id === '1');

  if (isGroup) {
    return <GroupChatDetail id={id} apiRoom={apiRoom} fallbackName={fallbackName} fallbackAvatar={fallbackAvatar} initialQuery={initialQuery} user={user} />;
  }

  return <ConsultationChatDetail id={id} apiRoom={apiRoom} fallbackName={fallbackName} fallbackAvatar={fallbackAvatar} initialQuery={initialQuery} user={user} />;
}






// -------------------------------------------------------------
// UNIFIED STYLES
// -------------------------------------------------------------
