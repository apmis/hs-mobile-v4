import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { People } from 'iconsax-react-native';
import { User, Check, CheckCheck, Clock, AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AppHeader from '@/app/shared/components/AppHeader';
import { useChatRooms } from '../_api/chat';
import { useUser } from '@/app/shared/api/auth';
import ChatFilters from './ChatFilters';
import { DataViewState } from '@/app/shared/components/ui/DataViewState';
import ChatListSkeleton from './ui/loading/ChatListSkeleton';
import { useThemeColor } from '@/app/shared/hooks/useThemeColor';
import { useStaffs, useStartPersonalChat, useCreateChannel } from '../_api/chatCreation';
import { useAllChatDrafts } from '../hooks/useChatDraft';
import { useLogout } from '@/app/shared/api/auth';
import { ChatAvatar, SmallAvatar } from './ui/ChatAvatar';
import { styles } from './style';
import NewChatModal from './NewChatModal';
import NewGroupModal from './NewGroupModal';


const formatChatTime = (dateString?: string | number) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const copilotChat = {
  id: 'copilot',
  name: 'HealthStack AI Assistant',
  message: 'How can I help you today?',
  time: 'Now',
  tag: 'AI Assistant',
  tagColor: '#F3E8FF',
  tagTextColor: '#9333EA',
  avatarImg: require('@/assets/images/Healthstack.png'),
  isOnline: true,
  unread: false,
  unreadCount: 0,
};



export default function ChatList() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const logoutMutation = useLogout();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data: user } = useUser();
  const { data: chatRooms = [], isLoading } = useChatRooms();
  const allDrafts = useAllChatDrafts();

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');

  // Map fetched chatrooms to UI structure
  const mappedChats = chatRooms.map((room: any) => {
    const chatPartner = room.members.find(
      (item: any) => item._id !== user?._id
    );

    // Get other members
    const otherMembers = room.members?.filter((m: any) => m._id !== user?._id) || [];
    const personalName = chatPartner?.firstname ? `${chatPartner.firstname} ${chatPartner.lastname}` : chatPartner?.name;
    const groupName = room.name || (otherMembers.length > 0 ? otherMembers.map((m: any) => `${m.firstname} ${m.lastname}`).join(', ') : 'Unknown Chat');
    const chatName = room?.chatType === "personal" ? personalName : groupName;
    const isGroup = room.members?.length > 2;

    const hasDraft = !!allDrafts[room._id];
    const draftText = allDrafts[room._id];

    return {
      id: room._id,
      name: chatName,
      chatType: room.chatType,
      rawMembers: room.members,
      message: hasDraft ? draftText : (room.lastmessage?.message || "No messages yet"),
      isDraft: hasDraft,
      lastMessageObj: room.lastmessage,
      isMyLastMessage: room.lastmessage?.createdbyId === user?._id,
      time: formatChatTime(room.lastmessage?.time || room.updatedAt),
      tag: isGroup ? 'Group' : 'Direct',
      tagColor: isGroup ? '#E0E7FF' : '#D1FAE5',
      tagTextColor: isGroup ? '#3730A3' : '#065F46',
      avatarImg: (chatPartner?.imageurl && chatPartner.imageurl.trim() !== "")
        ? chatPartner.imageurl
        : (!isGroup && chatName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(chatName)}&background=random` : null),
      iconType: isGroup ? 'group' : undefined,
      isOnline: false,
      unread: room.unreadCount !== undefined ? room.unreadCount > 0 : (!!room.lastmessage && room.lastmessage?.status !== 'read' && room.lastmessage?.createdbyId !== user?._id),
      unreadCount: room.unreadCount !== undefined ? room.unreadCount : (!!room.lastmessage && room.lastmessage?.status !== 'read' && room.lastmessage?.createdbyId !== user?._id ? 1 : 0),
      extraIcons: isGroup ? otherMembers.slice(0, 5).map((m: any) => {
        const memberName = m.firstname ? `${m.firstname} ${m.lastname}` : m.name;
        return (m.imageurl && m.imageurl.trim() !== "")
          ? m.imageurl
          : (memberName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(memberName)}&background=random` : null);
      }) : undefined,
    };
  });



  const hasCopilotDraft = !!allDrafts['copilot'];
  const copilotChatModified = {
    ...copilotChat,
    message: hasCopilotDraft ? allDrafts['copilot'] : copilotChat.message,
    isDraft: hasCopilotDraft,
  };

  const combinedChats = [copilotChatModified, ...mappedChats]
    .filter(Boolean)
    .filter((chat: any, index: number, self: any[]) =>
      index === self.findIndex((c: any) => c.id === chat.id)
    );

  const filteredChats = combinedChats.filter((chat: any) => {
    // Search query filtering
    const matchesSearch =
      chat.id === 'copilot' || // Always keep copilot if it matches other filters
      (chat.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.message || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch && searchQuery !== '') return false;

    // Tab category filtering
    if (activeFilter === 'All') return true;
    if (activeFilter === 'AI Assistant') return chat.id === 'copilot';
    if (chat.id === 'copilot') return false; // Hide copilot from other specific filters

    switch (activeFilter) {
      case 'Direct':
        return chat.tag === 'Direct' || chat.chatType === 'personal';
      case 'Group':
        return chat.tag === 'Group';
      case 'Consultation':
        return chat.chatType === 'consultation' || chat.rawMembers?.some((m: any) => m.type === 'client' || m.model === 'client');
      case 'Internal':
        return chat.rawMembers?.every((m: any) => m.type === 'staff' || m.model === 'employee');
      case 'Unread':
        return chat.unread === true;
      default:
        return true;
    }
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top', 'left', 'right']}>
      {/* Main Header */}
      <AppHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showMoreOptions={true}
        moreOptions={['New Chat', 'New Group', "Logout"]}
        onOptionPress={(option) => {
          if (option === 'Logout') {
            logoutMutation.mutate();
          } else if (option === 'New Chat') {
            setShowNewChat(true);
          } else if (option === 'New Group') {
            setShowNewGroup(true);
          }
        }}
      />

      {/* Chat List */}
      <View style={{ flex: 1 }}>
        <ChatFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        <DataViewState
          isLoading={isLoading}
          data={filteredChats}
          loadingComponent={<View style={styles.listContent}><ChatListSkeleton /></View>}
          render={(data) => (
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + moderateScale(80) }]}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: chat }) => (
                <TouchableOpacity
                  style={[styles.chatRow, { borderBottomColor: borderColor }]}
                  activeOpacity={0.7}
                  onPress={() => router.push(`/chat/${chat.id}`)}
                >
                  <ChatAvatar chat={chat} />

                  <View style={styles.chatContent}>
                    <View style={styles.chatHeader}>
                      <Text style={[styles.chatName, { color: textColor }, chat.unread && [styles.chatNameUnread, { color: textColor }]]}>
                        {chat.name}
                      </Text>
                      <Text style={[styles.chatTime, { color: textSecondaryColor }, chat.unread && [styles.chatTimeUnread, { color: primaryColor }]]}>
                        {chat.time}
                      </Text>
                    </View>

                    <View style={styles.chatSubHeader}>
                      {chat.isMyLastMessage && !chat.isDraft && (
                        <View style={{ marginRight: moderateScale(4), alignSelf: 'center', marginTop: moderateScale(2) }}>
                          {chat.lastMessageObj?.status === 'sending' ? (
                            <Clock size={moderateScale(14)} color={textSecondaryColor} />
                          ) : chat.lastMessageObj?.status === 'sent' ? (
                            <Check size={moderateScale(14)} color={textSecondaryColor} />
                          ) : chat.lastMessageObj?.status === 'failed' ? (
                            <AlertCircle size={moderateScale(14)} color="#EF4444" />
                          ) : (
                            <CheckCheck size={moderateScale(14)} color={chat.lastMessageObj?.status === 'read' ? "#53BDEB" : textSecondaryColor} />
                          )}
                        </View>
                      )}
                      <Text
                        style={[styles.chatMessage, { color: textSecondaryColor, flex: 1 }, chat.unread && [styles.chatMessageUnread, { color: textColor }]]}
                        numberOfLines={1}
                      >
                        {chat.isDraft && <Text style={{ color: '#EF4444' }}>Draft: </Text>}
                        {chat.message}
                      </Text>
                      {chat.unreadCount > 0 ? (
                        <View style={[styles.unreadBadge, { backgroundColor: primaryColor }]}>
                          <Text style={styles.unreadBadgeText}>
                            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                          </Text>
                        </View>
                      ) : (
                        chat.unread && <View style={[styles.unreadDot, { backgroundColor: primaryColor }]} />
                      )}
                    </View>

                    <View style={styles.tagRow}>
                      {/* <View style={[styles.tagPill, { backgroundColor: chat.tagColor }]}>
                        <Text style={[styles.tagText, { color: chat.tagTextColor }]}>{chat.tag}</Text>
                      </View> */}

                      {chat.extraIcons && (
                        <View style={styles.extraIconsContainer}>
                          {chat.extraIcons.map((uri: string | null, idx: number) => (
                            <SmallAvatar key={`${chat.id}-extra-${idx}`} uri={uri} idx={idx} />
                          ))}
                        </View>
                      )}

                      {chat.membersOnline && (
                        <Text style={[styles.membersOnlineText, { color: textSecondaryColor }]}>{chat.membersOnline} members online</Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        />
      </View>

      <NewChatModal visible={showNewChat} onClose={() => setShowNewChat(false)} />
      <NewGroupModal visible={showNewGroup} onClose={() => setShowNewGroup(false)} />

    </SafeAreaView>
  );
}
