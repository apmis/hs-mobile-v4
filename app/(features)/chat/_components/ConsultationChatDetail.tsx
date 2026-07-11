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
import { InsightMessageBubble } from './ui/InsightMessageBubble';
import { FileMessageBubble } from './ui/FileMessageBubble';
import ChatDetailSkeleton from './ui/loading/ChatDetailSkeleton';
import { ChatInput } from './ui/ChatInput';
import { ChatInfoModal } from './ChatInfoModal';

import { useThemeColor } from '@/app/shared/hooks/useThemeColor';
import { styles } from './style/chatDetailStyles';


export // -------------------------------------------------------------
  // 2) CONSULTATION CHAT UI (For "Medical Consultation")
  // -------------------------------------------------------------
  function ConsultationChatDetail({ id, apiRoom, fallbackName, fallbackAvatar, initialQuery, user }: any) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [imgError, setImgError] = useState(false);

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

  const chatPartner = apiRoom?.members?.find((m: any) => m._id !== user?._id);
  const apiChatName = chatPartner?.firstname ? `${chatPartner.firstname} ${chatPartner.lastname}` : chatPartner?.name;

  const chatName = apiRoom ? apiChatName : (fallbackName);
  const profession = chatPartner?.profession || 'Specialist';
  const chatAvatar = (chatPartner?.imageurl && chatPartner.imageurl.trim() !== "")
    ? chatPartner.imageurl
    : (chatName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(chatName)}&background=random` : fallbackAvatar);
  const isOnline = true;

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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={moderateScale(24)} color={textColor} variant="Linear" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
          onPress={() => setShowInfoModal(true)}
        >
          <View style={styles.avatarContainer}>
            {chatAvatar && !imgError ? (
              <Image
                source={{ uri: chatAvatar }}
                style={styles.headerAvatar}
                onError={() => setImgError(true)}
              />
            ) : (
              <View style={[styles.headerAvatar, { backgroundColor: borderColor, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: cardColor }]}>
                <User size={moderateScale(20)} color={textSecondaryColor} />
              </View>
            )}
            {isOnline && <View style={[styles.onlineDot, { borderColor: cardColor }]} />}
          </View>

          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: primaryColor }]} numberOfLines={1}>{chatName}</Text>
            {/* <Text style={[styles.onlineText, !isOnline && { color: textSecondaryColor }]}>{isOnline ? 'Active Now' : 'Offline'}</Text> */}
            <Text style={[styles.onlineText, !isOnline && { color: textSecondaryColor }]}>{profession}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Video size={moderateScale(24)} color={textSecondaryColor} />
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



        {messagesToRender.length === 0 && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: moderateScale(100) }}>
            <View style={{ width: moderateScale(80), height: moderateScale(80), borderRadius: moderateScale(40), backgroundColor: primaryColor + '15', justifyContent: 'center', alignItems: 'center', marginBottom: moderateScale(16) }}>
              <Smile size={moderateScale(40)} color={primaryColor} />
            </View>
            <Text style={{ fontSize: moderateScale(18), fontFamily: 'Switzer-Semibold', color: textColor, marginBottom: moderateScale(8) }}>No messages yet</Text>
            <Text style={{ fontSize: moderateScale(14), fontFamily: 'Switzer-Regular', color: textSecondaryColor, textAlign: 'center', paddingHorizontal: moderateScale(40) }}>Say hi to start the conversation!</Text>
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
              {msg.type === 'insight' ? (
                <InsightMessageBubble msg={msg} />
              ) : msg.isMe ? (
                <MyMessageBubble
                  msg={msg}
                  primaryColor={primaryColor}
                  textSecondaryColor={textSecondaryColor}
                />
              ) : msg.file ? (
                <FileMessageBubble
                  msg={msg}
                  primaryColor={primaryColor}
                  cardColor={cardColor}
                  borderColor={borderColor}
                  textColor={textColor}
                  textSecondaryColor={textSecondaryColor}
                />
              ) : (
                <OtherMessageBubble
                  msg={msg}
                  variant="consultation"
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

      {/* Input Area */}
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
        chatName={chatName}
        chatAvatar={chatAvatar}
        isGroup={false}
      />
    </KeyboardAvoidingView>
  );
}