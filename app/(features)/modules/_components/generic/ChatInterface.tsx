import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  Modal,
} from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Maximize4 } from 'iconsax-react-native';
import { Paperclip, Send, CheckCheck, X } from 'lucide-react-native';
import { Colors, Spacing } from '@/src/shared/constants/Theme';
import { useThemeColor } from '@/src/shared/hooks/useThemeColor';
import { ChatInput } from '@/src/features/chat/_components/ui/ChatInput';
import { MyMessageBubble } from '@/src/features/chat/_components/ui/MyMessageBubble';
import { OtherMessageBubble } from '@/src/features/chat/_components/ui/OtherMessageBubble';
import { useKeyboardHeight } from '@/src/features/chat/hooks/useKeyboardHeight';

interface Message {
  id: string;
  sender: string;
  text?: string;
  time: string;
  isMe: boolean;
  image?: string;
}

interface ChatInterfaceProps {
  headerComponent?: React.ReactNode;
  initialMessages?: Message[];
  suggestedActions?: string[];
}

export default function ChatInterface({ headerComponent, initialMessages, suggestedActions }: ChatInterfaceProps) {
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const [inputText, setInputText] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);

  React.useEffect(() => {
    if (initialMessages && initialMessages.length > 0 && messages.length === 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');

  const handleSend = () => {
    if (!inputText.trim()) return;
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    const timeStr = `${formattedHours < 10 ? '0' : ''}${formattedHours}:${formattedMins} ${ampm}`;

    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        sender: 'You',
        text: inputText.trim(),
        time: timeStr,
        isMe: true,
      },
    ]);
    setInputText('');

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <View
      style={[styles.container, { paddingBottom: Platform.OS === 'android' ? (keyboardHeight > 0 ? keyboardHeight + 45 : 0) : 0 }]}
    >
      {/* Chat Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {headerComponent && <View style={styles.headerComponentContainer}>{headerComponent}</View>}
        {messages.map((msg) => (
          <View key={msg.id}>
            {msg.image && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.imageAttachmentContainer,
                  msg.isMe ? { alignSelf: 'flex-end', marginBottom: moderateScale(4) } : { alignSelf: 'flex-start', marginBottom: moderateScale(4), marginLeft: moderateScale(16) }
                ]}
                onPress={() => setPreviewImage(msg.image || null)}
              >
                <Image source={{ uri: msg.image }} style={styles.attachmentImage} />
                <View style={styles.expandIconContainer}>
                  <Maximize4 size={moderateScale(24)} color="#FFFFFF" variant="Linear" />
                </View>
              </TouchableOpacity>
            )}

            {msg.isMe ? (
              <MyMessageBubble
                msg={{ ...msg, text: msg.text || '', status: 'read' }}
                primaryColor={primaryColor}
                textSecondaryColor={textSecondaryColor}
              />
            ) : (
              <OtherMessageBubble
                msg={{ ...msg, text: msg.text || '' }}
                variant="consultation"
                cardColor={cardColor}
                borderColor={borderColor}
                textColor={textColor}
                textSecondaryColor={textSecondaryColor}
              />
            )}
          </View>
        ))}
      </ScrollView>

      {/* Suggested Actions */}
      {suggestedActions && suggestedActions.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.suggestedActionsContainer}
          contentContainerStyle={styles.suggestedActionsContent}
        >
          {suggestedActions.map((action, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.actionChip, { backgroundColor: primaryColor + '15', borderColor: primaryColor }]}
              onPress={() => {
                setInputText(action);
              }}
            >
              <Text style={[styles.actionChipText, { color: primaryColor }]}>{action}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Input Area */}
      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        onSend={handleSend}
        placeholder="Ask Copilot"
        hideAttachments={false}
      />

      <Modal
        visible={!!previewImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={[styles.closeModalButton, { top: insets.top + moderateScale(20) }]}
            onPress={() => setPreviewImage(null)}
          >
            <X size={moderateScale(28)} color="#FFFFFF" />
          </TouchableOpacity>
          {previewImage && (
            <Image source={{ uri: previewImage }} style={styles.modalImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: Spacing.md,
    paddingBottom: moderateScale(40),
  },
  headerComponentContainer: {
    marginBottom: moderateScale(20),
  },
  suggestedActionsContainer: {
    maxHeight: moderateScale(50),
    minHeight: moderateScale(40),
    marginBottom: moderateScale(8),
  },
  suggestedActionsContent: {
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  actionChip: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    marginRight: moderateScale(8),
  },
  actionChipText: {
    fontSize: moderateScale(13),
    fontFamily: 'Switzer-Medium',
  },
  messageGroupLeft: {
    marginBottom: moderateScale(20),
    alignItems: 'flex-start',
    maxWidth: '85%',
  },
  senderName: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    marginBottom: moderateScale(6),
    marginLeft: moderateScale(4),
  },
  bubbleLeft: {
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
  },
  messageTextLeft: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22),
  },
  messageGroupRight: {
    marginBottom: moderateScale(20),
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  senderNameRight: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    marginBottom: moderateScale(6),
    marginRight: moderateScale(4),
  },
  bubbleRight: {
    padding: moderateScale(14),
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: 0,
    borderBottomRightRadius: moderateScale(16),
    borderBottomLeftRadius: moderateScale(16),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  messageTextRight: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22),
  },
  timeStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(6),
    marginRight: moderateScale(4),
  },
  timeLabel: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    marginTop: moderateScale(6),
    marginHorizontal: moderateScale(4),
  },
  imageAttachmentContainer: {
    width: moderateScale(260),
    height: moderateScale(180),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  expandIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: moderateScale(12),
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(24),
    borderWidth: 1,
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(6),
  },
  attachButton: {
    padding: moderateScale(10),
  },
  textInput: {
    flex: 1,
    minHeight: moderateScale(40),
    maxHeight: moderateScale(100),
    fontSize: moderateScale(15),
    paddingHorizontal: moderateScale(8),
    paddingTop: Platform.OS === 'ios' ? moderateScale(10) : moderateScale(8),
  },
  sendButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: moderateScale(8),
    elevation: 3,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '80%',
  },
  closeModalButton: {
    position: 'absolute',
    right: Spacing.md,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: moderateScale(8),
    borderRadius: moderateScale(20),
  },
});
