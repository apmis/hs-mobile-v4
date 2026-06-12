import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Colors, Spacing } from '@/app/shared/constants/Theme';

// Icons
import { ArrowLeft } from 'iconsax-react-native';
import {
  MoreVertical,
  Send,
  CheckCheck
} from 'lucide-react-native';

export default function ChatLoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = React.useRef<ScrollView>(null);

  const chatName = 'Healthstack Copilot';
  const chatAvatar = require('@/assets/images/Healthstack.png');
  const isOnline = true;

  const [messages, setMessages] = useState<any[]>([
    {
      id: '1',
      isMe: false,
      sender: 'ASSISTANT',
      time: 'Just now',
      text: "👋 Welcome back! To log you in, what's your registered email or medical ID?",
    }
  ]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    const timeStr = `${formattedHours < 10 ? '0' : ''}${formattedHours}:${formattedMins} ${ampm}`;

    setMessages([...messages, {
      id: Date.now().toString(),
      isMe: true,
      sender: 'You',
      time: timeStr,
      text: inputText.trim()
    }]);

    if (messages.length === 1) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          isMe: false,
          sender: 'ASSISTANT',
          time: timeStr,
          text: `Got it! Can you please provide your secure password or authorization phrase to confirm?`,
        }]);
      }, 1000);
    } else if (messages.length === 3) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          isMe: false,
          sender: 'ASSISTANT',
          time: timeStr,
          text: `Perfect! Loading your clinical workspace now... Hang tight.`,
        }]);
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 2000);
      }, 1000);
    }

    setInputText('');
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <Stack.Screen options={{ headerShown: false }} />

        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={moderateScale(24)} color={Colors.text} variant="Linear" />
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
            <Image source={chatAvatar} style={styles.headerAvatar} />
            {isOnline && <View style={styles.onlineDot} />}
          </View>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>{chatName}</Text>
            <Text style={[styles.onlineText]}>Active Now</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <MoreVertical size={moderateScale(24)} color="#4B5563" />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>ACCOUNT LOGIN</Text>
          </View>

          {messages.map((msg) => {
            if (msg.isMe) {
              return (
                <View key={msg.id} style={styles.groupMessageRowRight}>
                  <View style={styles.groupMsgContentColRight}>
                    <Text style={styles.groupSenderNameRight}>{msg.sender}</Text>
                    <View style={styles.bubbleRightGroup}>
                      <Text style={styles.messageTextRight}>{msg.text}</Text>
                    </View>
                    <View style={styles.timeStatusContainerRight}>
                      <Text style={styles.groupTimeLabelRight}>{msg.time}</Text>
                      <CheckCheck size={moderateScale(14)} color="#1D4ED8" style={{ marginLeft: 4 }} />
                    </View>
                  </View>
                </View>
              );
            }

            return (
              <View key={msg.id} style={styles.messageGroupLeftConsult}>
                <View style={styles.senderHeader}>
                  <View style={styles.senderBadge}>
                    <Text style={styles.senderBadgeText}>{msg.sender}</Text>
                  </View>
                  <Text style={styles.timeLabel}>{msg.time}</Text>
                </View>
                <View style={styles.bubbleLeft}>
                  <Text style={styles.messageTextLeft}>{msg.text}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Input Area */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom || moderateScale(20) }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your response..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              autoFocus
              secureTextEntry={messages.length === 3}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Send size={moderateScale(16)} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: moderateScale(10),
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    zIndex: 10,
  },
  backButton: {
    marginRight: Spacing.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.sm,
  },
  headerAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  headerTitleContainer: {
    flex: 1,
    paddingLeft: moderateScale(8),
  },
  headerTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#0059B2',
  },
  onlineText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#10B981',
    marginTop: moderateScale(2),
  },
  iconButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: Spacing.md,
    paddingBottom: moderateScale(40),
  },
  dateSeparator: {
    alignSelf: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(16),
    marginBottom: moderateScale(20),
  },
  dateText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  messageGroupLeftConsult: {
    marginBottom: moderateScale(20),
    alignItems: 'flex-start',
    maxWidth: '85%',
  },
  senderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(6),
  },
  senderBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(4),
    marginRight: moderateScale(6),
  },
  senderBadgeText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: '#4B5563',
  },
  timeLabel: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: '#9CA3AF',
  },
  bubbleLeft: {
    backgroundColor: Colors.white,
    padding: moderateScale(14),
    borderTopLeftRadius: 0,
    borderTopRightRadius: moderateScale(16),
    borderBottomRightRadius: moderateScale(16),
    borderBottomLeftRadius: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  messageTextLeft: {
    fontSize: moderateScale(15),
    color: '#374151',
    lineHeight: moderateScale(22),
  },
  groupMessageRowRight: {
    flexDirection: 'row',
    marginBottom: moderateScale(16),
    justifyContent: 'flex-end',
  },
  groupMsgContentColRight: {
    maxWidth: '85%',
    alignItems: 'flex-end',
  },
  groupSenderNameRight: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#0059B2',
    marginBottom: moderateScale(4),
    marginRight: moderateScale(4),
  },
  bubbleRightGroup: {
    backgroundColor: '#0059B2',
    padding: moderateScale(16),
    borderRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(4),
  },
  messageTextRight: {
    fontSize: moderateScale(15),
    color: Colors.white,
    lineHeight: moderateScale(22),
  },
  timeStatusContainerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: moderateScale(6),
    marginRight: moderateScale(4),
  },
  groupTimeLabelRight: {
    fontSize: moderateScale(10),
    color: '#9CA3AF',
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingTop: moderateScale(12),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: moderateScale(40),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
  },
  textInput: {
    flex: 1,
    minHeight: moderateScale(40),
    maxHeight: moderateScale(100),
    fontSize: moderateScale(15),
    color: '#1F2937',
    paddingHorizontal: moderateScale(8),
  },
  sendButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#0059B2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: moderateScale(8),
  },
});
