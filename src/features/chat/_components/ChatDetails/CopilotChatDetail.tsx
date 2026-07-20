import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Platform,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'iconsax-react-native';
import { Send } from 'lucide-react-native';
import { moderateScale } from 'react-native-size-matters';
import { useThemeColor } from '@/src/shared/hooks/useThemeColor';
import { ScaledSheet } from 'react-native-size-matters';
import { MyMessageBubble } from '../ui/MyMessageBubble';
import { OtherMessageBubble } from '../ui/OtherMessageBubble';

import { formatMessageTime } from '@/src/features/chat/utils';
import { useCopilotSession, useSendCopilotMessage } from '../../_api/copilot';
import { TypingIndicator } from '../ui/loading/TypingIndicator';
import { ChatInput } from '../ui/ChatInput';
import { ChatHeader } from '../ui/ChatHeader';
import { useChatDraft } from '../../hooks/useChatDraft';
import { useKeyboardHeight } from '../../hooks/useKeyboardHeight';


export function CopilotChatDetail() {
  const router = useRouter();
  const { initialQuery } = useLocalSearchParams<{ initialQuery?: string }>();
  const insets = useSafeAreaInsets();
  const { draft: inputText, setDraft: setInputText, clearDraft } = useChatDraft('copilot');
  const keyboardHeight = useKeyboardHeight();
  const scrollViewRef = useRef<ScrollView>(null);
  const hasAutoSent = useRef(false);

  // Use Copilot hooks
  const { data: sessionId } = useCopilotSession();
  const sendMessageMutation = useSendCopilotMessage();
  const [isSending, setIsSending] = useState(false);

  const Container: any = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

  const [mockMessages, setMockMessages] = useState<any[]>([
    {
      id: '1',
      isMe: false,
      sender: 'HealthStack AI Assistant',
      time: formatMessageTime(new Date()),
      text: 'How can I help you today?',
      avatar: require('@/assets/images/Healthstack.png')
    }
  ]);

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');

  const handleSend = async (textOverride?: any) => {
    const textToSend = typeof textOverride === 'string' ? textOverride.trim() : inputText.trim();
    if (!textToSend) return;

    const timeStr = formatMessageTime(new Date());

    // Add User Message
    const userMsg = {
      id: Date.now().toString(),
      isMe: true,
      sender: 'You',
      time: timeStr,
      text: textToSend
    };

    if (typeof textOverride !== 'string') {
      clearDraft();
    }
    setMockMessages(prev => [...prev, userMsg]);
    setIsSending(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Build chat history for AI context
    const currentMessages = [...mockMessages, userMsg];
    // Exclude initial welcome message (id: '1') and error messages
    const validMessages = currentMessages.filter(m => !m.isError && m.id !== '1');
    const chatHistory: { role: string; content: string }[] = [];
    let userCount = 0;
    let assistantCount = 0;

    for (let i = validMessages.length - 1; i >= 0; i--) {
      const m = validMessages[i];
      const isCopilot = !m.isMe;

      if (isCopilot && assistantCount < 5) {
        chatHistory.unshift({ role: "assistant", content: m.text });
        assistantCount++;
      } else if (!isCopilot && userCount < 5) {
        chatHistory.unshift({ role: "user", content: m.text });
        userCount++;
      }

      if (userCount >= 5 && assistantCount >= 5) break;
    }

    try {
      const responseText = await sendMessageMutation.mutateAsync({
        question: textToSend,
        chatHistory,
        sessionId,
      });

      const aiTime = formatMessageTime(new Date());
      const isErrorResponse = responseText.includes("Sorry, I couldn't understand that request.");
      const aiMsg = {
        id: Date.now().toString(),
        isMe: false,
        sender: 'HealthStack AI Assistant',
        time: aiTime,
        text: responseText,
        avatar: require('@/assets/images/Healthstack.png'),
        isError: isErrorResponse
      };
      setMockMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      console.error("Copilot Error:", error);
      const aiTime = formatMessageTime(new Date());
      const errorMsg = {
        id: Date.now().toString(),
        isMe: false,
        sender: 'HealthStack AI Assistant',
        time: aiTime,
        text: `Sorry, I encountered an error: ${error.message || "Could not connect to the API."}`,
        avatar: require('@/assets/images/Healthstack.png'),
        isError: true
      };
      setMockMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  React.useEffect(() => {
    if (initialQuery && typeof initialQuery === 'string' && !hasAutoSent.current) {
      hasAutoSent.current = true;
      setTimeout(() => {
        handleSend(initialQuery);
      }, 400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  return (
    <Container
      style={{ flex: 1, backgroundColor, paddingBottom: Platform.OS === 'android' ? (keyboardHeight > 0 ? keyboardHeight + 45 : 0) : 0 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <ChatHeader
        disableCenterPress={true}
        title="HealthStack AI Assistant"
        subtitle={
          <Text style={[localStyles.onlineText, { color: textSecondaryColor }]}>Always active</Text>
        }
        avatarElement={
          <Image
            source={require('@/assets/images/Healthstack.png')}
            style={localStyles.headerAvatar}
          />
        }
      />

      {/* Chat Area */}
      <ScrollView
        ref={scrollViewRef}
        style={[localStyles.chatArea, { backgroundColor }]}
        contentContainerStyle={localStyles.chatContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        <Text style={[localStyles.dateLabel, { backgroundColor: cardColor, color: textSecondaryColor }]}>Today</Text>
        {mockMessages.map((msg) => {
          if (msg.isMe) {
            return (
              <MyMessageBubble
                key={msg.id}
                msg={msg}
                primaryColor={primaryColor}
                textSecondaryColor={textSecondaryColor}
              />
            );
          } else {
            return (
              <OtherMessageBubble
                key={msg.id}
                msg={msg}
                variant="group"
                cardColor={cardColor}
                borderColor={borderColor}
                textColor={msg.isError ? '#DC2626' : textColor}
                textSecondaryColor={textSecondaryColor}
              />
            );
          }
        })}

        {isSending && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScale(10) }}>
            <Image
              source={require('@/assets/images/Healthstack.png')}
              style={{ width: moderateScale(24), height: moderateScale(24), borderRadius: moderateScale(12), marginRight: moderateScale(8) }}
            />
            <View style={{ backgroundColor: cardColor, padding: moderateScale(10), borderRadius: moderateScale(12), borderTopLeftRadius: 0, borderColor, borderWidth: 1, height: moderateScale(36), justifyContent: 'center' }}>
              <TypingIndicator dotColor={textSecondaryColor} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        onSend={() => handleSend()}
        isSending={isSending}
        //hideAttachments={true}
        placeholder="Ask AI Assistant..."
      />
    </Container>
  );
}

const localStyles = ScaledSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(8),
    borderBottomWidth: 1,
    zIndex: 10,
  },
  backButton: {
    marginRight: moderateScale(12),
    padding: moderateScale(4),
  },
  avatarContainer: {
    position: 'relative',
    marginRight: moderateScale(12),
  },
  headerAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#0059B2',
  },
  onlineText: {
    fontSize: moderateScale(12),
    marginTop: moderateScale(2),
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(24),
    paddingBottom: moderateScale(40),
  },
  dateLabel: {
    alignSelf: 'center',
    fontSize: moderateScale(11),
    fontWeight: '600',
    overflow: 'hidden',
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(4),
    marginBottom: moderateScale(24),
  },
  systemAlertContainer: {
    alignItems: 'center',
    marginVertical: moderateScale(16),
  },
  systemAlertBubble: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(16),
  },
  systemAlertText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    color: '#065F46',
  },
  inputContainer: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(10),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(30),
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(6),
  },
  textInput: {
    flex: 1,
    minHeight: moderateScale(40),
    fontSize: moderateScale(15),
    paddingHorizontal: moderateScale(14),
  },
  sendButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: moderateScale(8),
  }
});
