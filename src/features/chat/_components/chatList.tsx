import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { People } from 'iconsax-react-native';
import { User, Check, CheckCheck, Clock, AlertCircle, Trash2, MoreVertical, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AppHeader from '@/src/shared/components/AppHeader';
import { useChatRooms, useDeleteChat } from '../_api/chat';
import { useUser } from '@/src/shared/api/auth';
import ChatFilters from './ChatFilters';
import { DataViewState } from '@/src/shared/components/ui/DataViewState';
import ChatListSkeleton from './ui/loading/ChatListSkeleton';
import { useThemeColor } from '@/src/shared/hooks/useThemeColor';
import { useStaffs, useStartPersonalChat, useCreateChannel } from '../_api/chatCreation';
import { useAllChatDrafts } from '../hooks/useChatDraft';
import { useLogout } from '@/src/shared/api/auth';
import { getAcronym } from '@/src/features/chat/utils';
import { ChatAvatar, SmallAvatar } from './ui/ChatAvatar';
import { styles } from './style';
import NewChatModal from './NewChatModal';
import NewGroupModal from './NewGroupModal';
import { ChatInfoModal } from './ChatInfoModal';



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
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedActionChat, setSelectedActionChat] = useState<any>(null);
  const [showSelectionMoreMenu, setShowSelectionMoreMenu] = useState(false);

  const deleteChat = useDeleteChat();
  const logoutMutation = useLogout();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data: user } = useUser();
  const { data: chatRooms = [], isLoading } = useChatRooms();
  const allDrafts = useAllChatDrafts();

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');

  const handleLongPress = (chat: any) => {
    if (chat.id === 'copilot') return; // Can't delete/view copilot
    setSelectedActionChat(chat);
  };

  const confirmDelete = (chatId: string, chatName: string) => {
    Alert.alert(
      'Delete Chat',
      `Are you sure you want to delete ${chatName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', onPress: () => {
            deleteChat.mutate(chatId);
            setSelectedActionChat(null);
          }, style: 'destructive'
        }
      ]
    );
  };
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryLightColor = useThemeColor({}, 'primaryLight');
  const errorTextColor = useThemeColor({}, 'errorText');
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
    const isGroup = room.chatType !== 'personal';

    const hasDraft = !!allDrafts[room._id];
    const draftText = allDrafts[room._id];

    // Determine external organization
    let externalOrgName = null;
    if (!isGroup && chatPartner?.organization?._id && chatPartner.organization._id !== user?.facilityDetail?._id) {
      externalOrgName = chatPartner.organization.facilityName;
    } else if (isGroup && room.chatType === 'Organization' && room.name !== user?.facilityDetail?.facilityName) {
      // For organization group chats, we could potentially show the organization name if we saved it differently, 
      // but if the channel is named correctly, it might be fine. 
      // Let's check members just in case, but usually group chats have their own names.
    }

    const getTagInfo = () => {
      if (room.chatType && room.chatType !== 'personal') {
        return {
          tag: room.chatType,
          tagColor: '#FEF3C7',
          tagTextColor: '#B45309'
        };
      }
      return {
        tag: isGroup ? 'Group' : 'Direct',
        tagColor: isGroup ? '#E0E7FF' : '#D1FAE5',
        tagTextColor: isGroup ? '#3730A3' : '#065F46'
      };
    };

    const tagInfo = getTagInfo();

    return {
      apiRoom: room,
      id: room._id,
      name: chatName,
      chatType: room.chatType,
      rawMembers: room.members,
      message: hasDraft ? draftText : (room.lastmessage?.message || "No messages yet"),
      isDraft: hasDraft,
      lastMessageObj: room.lastmessage,
      isMyLastMessage: room.lastmessage?.createdbyId === user?._id,
      time: formatChatTime(room.lastmessage?.time || room.updatedAt),
      tag: tagInfo.tag,
      tagColor: tagInfo.tagColor,
      tagTextColor: tagInfo.tagTextColor,
      avatarImg: (chatPartner?.imageurl && chatPartner.imageurl.trim() !== "")
        ? chatPartner.imageurl
        : (!isGroup && chatName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(chatName)}&background=random` : null),
      iconType: isGroup ? 'group' : undefined,
      isOnline: false,
      externalOrgName,
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
        return chat.chatType !== 'personal' && chat.chatType !== 'consultation';
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
      {/* Main Header / Selection Header */}
      {selectedActionChat ? (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: moderateScale(60),
          paddingHorizontal: moderateScale(16),
          backgroundColor: cardColor,
          borderBottomWidth: 1,
          borderBottomColor: borderColor
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setSelectedActionChat(null)} style={{ padding: moderateScale(8), marginRight: moderateScale(16) }}>
              <ArrowLeft size={moderateScale(24)} color={textColor} />
            </TouchableOpacity>
            <Text style={{ fontSize: moderateScale(18), fontWeight: 'bold', color: textColor }}>1</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => confirmDelete(selectedActionChat.id, selectedActionChat.name)} style={{ padding: moderateScale(8) }}>
              <Trash2 size={moderateScale(24)} color={errorTextColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSelectionMoreMenu(true)} style={{ padding: moderateScale(8) }}>
              <MoreVertical size={moderateScale(24)} color={textColor} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
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
      )}

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
              renderItem={({ item: chat }) => {
                const isSelected = selectedActionChat?.id === chat.id;
                return (
                  <TouchableOpacity
                    style={[
                      styles.chatRow,
                      { borderBottomColor: borderColor },
                      isSelected && { backgroundColor: primaryLightColor }
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (selectedActionChat) {
                        if (isSelected) {
                          setSelectedActionChat(null);
                        } else {
                          setSelectedActionChat(chat);
                        }
                      } else {
                        router.push(`/chat/${chat.id}`);
                      }
                    }}
                    onLongPress={() => handleLongPress(chat)}
                  >
                    <ChatAvatar chat={chat} />

                    <View style={styles.chatContent}>
                      <View style={styles.chatHeader}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={[styles.chatName, { color: textColor, flexShrink: 1 }, chat.unread && [styles.chatNameUnread, { color: textColor }]]} numberOfLines={1}>
                            {chat.name}
                          </Text>
                        </View>
                        <Text style={[styles.chatTime, { color: textSecondaryColor, marginLeft: moderateScale(8) }, chat.unread && [styles.chatTimeUnread, { color: primaryColor }]]}>
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
                        {chat.externalOrgName && (
                          <View style={{ backgroundColor: '#eef2ff', paddingHorizontal: moderateScale(6), paddingVertical: moderateScale(2), borderRadius: moderateScale(4), marginRight: moderateScale(8) }}>
                            <Text style={{ fontSize: moderateScale(10), color: primaryColor, fontWeight: '600' }} numberOfLines={1}>{getAcronym(chat.externalOrgName)}</Text>
                          </View>
                        )}

                        <View style={[styles.tagPill, { backgroundColor: chat.tagColor, marginRight: moderateScale(6) }]}>
                          <Text style={[styles.tagText, { color: chat.tagTextColor }]}>{chat.tag}</Text>
                        </View>
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
                )
              }}
            />
          )}
        />
      </View>

      <NewChatModal visible={showNewChat} onClose={() => setShowNewChat(false)} />
      <NewGroupModal visible={showNewGroup} onClose={() => setShowNewGroup(false)} />

      {selectedActionChat && (
        <ChatInfoModal
          visible={showInfoModal}
          onClose={() => {
            setShowInfoModal(false);
            setSelectedActionChat(null);
          }}
          apiRoom={selectedActionChat.apiRoom}
          user={user}
          chatName={selectedActionChat.name}
          chatAvatar={selectedActionChat.avatarImg}
          isGroup={selectedActionChat.apiRoom?.chatType !== 'personal'}
        />
      )}

      {/* Selection More Menu Modal */}
      <Modal visible={showSelectionMoreMenu} transparent={true} animationType="fade">
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'transparent' }}
          onPress={() => setShowSelectionMoreMenu(false)}
          activeOpacity={1}
        />
        <View style={{
          position: 'absolute',
          top: insets.top + moderateScale(50),
          right: moderateScale(16),
          backgroundColor: cardColor,
          borderRadius: moderateScale(8),
          elevation: 5,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 5,
          borderWidth: 1,
          borderColor: borderColor,
          minWidth: moderateScale(150)
        }}>
          <TouchableOpacity style={{ padding: moderateScale(12), borderBottomWidth: 1, borderBottomColor: borderColor }} onPress={() => {
            setShowSelectionMoreMenu(false);
            setShowInfoModal(true);
          }}>
            <Text style={{ color: textColor, fontSize: moderateScale(14) }}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: moderateScale(12) }} onPress={() => {
            setShowSelectionMoreMenu(false);
            confirmDelete(selectedActionChat.id, selectedActionChat.name);
          }}>
            <Text style={{ color: '#ef4444', fontSize: moderateScale(14) }}>Delete Chat</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
