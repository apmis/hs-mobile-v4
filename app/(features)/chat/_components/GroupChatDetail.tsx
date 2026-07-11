import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, Keyboard } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Paperclip2, ExportSquare, TickCircle, People } from 'iconsax-react-native';
import {
  MoreVertical,
  Send,
  Video,
  Smile,
  User,
} from 'lucide-react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';

import { useChatMessages, useSendMessage, useMarkAsRead } from '../_api/chat';
import { mapApiMessageToUI } from '../utils';
import { formatMessageTime, getMessageDateLabel } from '../utils';

import { MyMessageBubble } from './ui/MyMessageBubble';
import { OtherMessageBubble } from './ui/OtherMessageBubble';
import ChatDetailSkeleton from './ui/loading/ChatDetailSkeleton';
import { ChatInput } from './ui/ChatInput';
import { ChatInfoModal } from './ChatInfoModal';

const ClusterImage = ({ m, idx, zIndex, marginLeft, borderColor, textSecondaryColor }: any) => {
  const [imgError, setImgError] = useState(false);
  const memberName = m.firstname ? `${m.firstname} ${m.lastname}` : m.name;
  const imgUri = (m.imageurl && m.imageurl.trim() !== "")
    ? m.imageurl
    : (memberName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(memberName)}&background=random` : null);

  if (!imgUri || imgError) {
    return (
      <View style={[styles.clusterImg, { zIndex, marginLeft, backgroundColor: borderColor, justifyContent: 'center', alignItems: 'center' }]}>
        <User size={moderateScale(18)} color={textSecondaryColor} />
      </View>
    );
  }

  return (
    <Image source={{ uri: imgUri }} style={[styles.clusterImg, { zIndex, marginLeft }]} onError={() => setImgError(true)} />
  );
};

import { useThemeColor } from '@/app/shared/hooks/useThemeColor';
import { styles } from './style/chatDetailStyles';


export // -------------------------------------------------------------
  // 1) GROUP CHAT UI (For "Surgical Team")
  // -------------------------------------------------------------
  function GroupChatDetail({ id, apiRoom, fallbackName, fallbackAvatar, user }: any) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const { data: actualMessages = [], isLoading: isMessagesLoading } = useChatMessages(apiRoom);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();

  React.useEffect(() => {
    const hasUnreadCount = apiRoom?.unreadCount && apiRoom.unreadCount > 0;
    const isLastMessageUnread = apiRoom?.lastmessage && apiRoom.lastmessage.status !== 'read' && apiRoom.lastmessage.createdbyId !== user?._id;

    if (hasUnreadCount || isLastMessageUnread) {
      markAsReadMutation.mutate(id);
    }
  }, [apiRoom?.unreadCount, apiRoom?.lastmessage, id]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    if (apiRoom) {
      const messageToStore = inputText.trim();
      setInputText('');
      await sendMessageMutation.mutateAsync({ chatRoom: apiRoom, inputMessage: messageToStore });
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const messagesToRender = apiRoom ? actualMessages.map((m: any) => mapApiMessageToUI(m, user)) : [];

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');

  const hasNoMessages = apiRoom && !apiRoom.lastmessage;

  if (isMessagesLoading && !actualMessages.length && !hasNoMessages) {
    return (
      <View style={{ flex: 1, backgroundColor }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ChatDetailSkeleton />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + moderateScale(10), backgroundColor: cardColor, borderBottomColor: borderColor }]}>
        <TouchableOpacity style={styles.iconButtonLeft} onPress={() => router.back()}>
          <ArrowLeft size={moderateScale(24)} color={textColor} variant="Linear" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
          onPress={() => setShowInfoModal(true)}
        >
          {/* Avatars Cluster */}
          <View style={styles.groupAvatarCluster}>
            {apiRoom ? (
              <>
                {(apiRoom.members?.filter((m: any) => m._id !== user?._id) || []).slice(0, 2).map((m: any, idx: number) => {
                  const zIndex = 3 - idx;
                  const marginLeft = idx > 0 ? -moderateScale(12) : 0;

                  return (
                    <ClusterImage 
                      key={idx} 
                      m={m} 
                      idx={idx} 
                      zIndex={zIndex} 
                      marginLeft={marginLeft} 
                      borderColor={borderColor} 
                      textSecondaryColor={textSecondaryColor} 
                    />
                  );
                })}
                {(apiRoom.members?.filter((m: any) => m._id !== user?._id) || []).length > 2 && (
                  <View style={[styles.clusterBadge, { marginLeft: -moderateScale(12), zIndex: 1 }]}>
                    <Text style={styles.clusterBadgeText}>+{(apiRoom.members?.filter((m: any) => m._id !== user?._id) || []).length - 2}</Text>
                  </View>
                )}
              </>
            ) : (
              <View style={[styles.clusterImg, { zIndex: 3, backgroundColor: borderColor, justifyContent: 'center', alignItems: 'center' }]}>
                <People size={moderateScale(18)} color={textSecondaryColor} variant="Bold" />
              </View>
            )}
          </View>

          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: primaryColor }]} numberOfLines={1}>{apiRoom ? (apiRoom.name || 'Group Chat') : (fallbackName)}</Text>
            <Text style={[styles.headerSubtitleGroup, { color: textSecondaryColor }]}>{apiRoom?.description}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <MoreVertical size={moderateScale(24)} color={textSecondaryColor} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {/* Pinned Case File Card */}
        {/* <View style={[styles.pinnedCaseCard, { backgroundColor: cardColor, borderColor }]}>
          <View style={[styles.pinnedBlueAccent, { backgroundColor: primaryColor }]} />
          <View style={styles.pinnedContent}>
            <View style={styles.pinnedLeft}>
              <View style={[styles.pinnedIconBox, { backgroundColor: primaryColor + '20' }]}>
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/337/337946.png' }} style={styles.folderIcon} />
              </View>
              <View style={styles.pinnedTextCol}>
                <Text style={[styles.pinnedTitle, { color: textColor }]}>Case #8821: Post-Op Strategy</Text>
                <Text style={[styles.pinnedSub, { color: textSecondaryColor }]}>Last updated 14 mins ago</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.viewCaseBtn, { backgroundColor: primaryColor }]} activeOpacity={0.8}>
              <Text style={styles.viewCaseBtnText}>View Case File</Text>
              <ExportSquare size={moderateScale(14)} color="#FFFFFF" variant="Linear" style={{ marginLeft: moderateScale(4) }} />
            </TouchableOpacity>
          </View>
        </View> */}

        {messagesToRender.length === 0 && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: moderateScale(100) }}>
            <View style={{ width: moderateScale(80), height: moderateScale(80), borderRadius: moderateScale(40), backgroundColor: primaryColor + '15', justifyContent: 'center', alignItems: 'center', marginBottom: moderateScale(16) }}>
              <Smile size={moderateScale(40)} color={primaryColor} />
            </View>
            <Text style={{ fontSize: moderateScale(18), fontFamily: 'Switzer-Semibold', color: textColor, marginBottom: moderateScale(8) }}>No messages yet</Text>
            <Text style={{ fontSize: moderateScale(14), fontFamily: 'Switzer-Regular', color: textSecondaryColor, textAlign: 'center', paddingHorizontal: moderateScale(40) }}>Say hi to start the conversation in this group!</Text>
          </View>
        )}

        {messagesToRender.map((msg: any, index: number) => {
          const currentLabel = getMessageDateLabel(msg.rawDate);
          const previousLabel = index > 0 ? getMessageDateLabel(messagesToRender[index - 1].rawDate) : null;
          const showDateSeparator = currentLabel !== previousLabel;

          return (
            <React.Fragment key={msg.id}>
              {showDateSeparator && (
                <View style={[styles.dateSeparator, { backgroundColor: borderColor }]}>
                  <Text style={[styles.dateText, { color: textSecondaryColor }]}>{currentLabel}</Text>
                </View>
              )}
              {msg.type === 'alert' ? (
                <View style={styles.systemAlertContainer}>
                  <View style={styles.systemAlertBubble}>
                    <TickCircle size={moderateScale(18)} color="#065F46" variant="Bold" />
                    <Text style={styles.systemAlertText}>{msg.text}</Text>
                  </View>
                </View>
              ) : msg.isMe ? (
                <MyMessageBubble
                  key={msg.id}
                  msg={msg}
                  primaryColor={primaryColor}
                  textSecondaryColor={textSecondaryColor}
                />
              ) : (
                <OtherMessageBubble
                  key={msg.id}
                  msg={msg}
                  variant="group"
                  cardColor={cardColor}
                  borderColor={borderColor}
                  textColor={textColor}
                  textSecondaryColor={textSecondaryColor}
                />
              )}
            </React.Fragment>
          );
        })}
      </ScrollView>

      {/* Standard Input Area */}
      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        onSend={handleSend}
      />

      <ChatInfoModal 
        visible={showInfoModal} 
        onClose={() => setShowInfoModal(false)}
        apiRoom={apiRoom}
        user={user}
        chatName={apiRoom ? (apiRoom.name || 'Group Chat') : fallbackName}
        chatAvatar={apiRoom?.imageurl}
        isGroup={true}
      />
    </KeyboardAvoidingView>
  );
}