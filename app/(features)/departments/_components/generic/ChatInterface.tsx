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
import { Colors, Spacing } from '@/app/shared/constants/Theme';
import { useThemeColor } from '@/app/shared/hooks/useThemeColor';

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
}

export default function ChatInterface({ headerComponent }: ChatInterfaceProps) {
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([]);

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
    <View style={styles.container}>
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
          <View key={msg.id} style={msg.isMe ? styles.messageGroupRight : styles.messageGroupLeft}>
            <Text
              style={[
                msg.isMe ? styles.senderNameRight : styles.senderName,
                msg.isMe ? { color: primaryColor } : { color: textSecondaryColor },
              ]}
            >
              {msg.sender}
            </Text>

            <View
              style={[
                msg.isMe ? styles.bubbleRight : styles.bubbleLeft,
                msg.isMe ? { backgroundColor: primaryColor } : { backgroundColor: cardColor, borderColor },
              ]}
            >
              {msg.image && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.imageAttachmentContainer}
                  onPress={() => setPreviewImage(msg.image || null)}
                >
                  <Image source={{ uri: msg.image }} style={styles.attachmentImage} />
                  <View style={styles.expandIconContainer}>
                    <Maximize4 size={moderateScale(24)} color="#FFFFFF" variant="Linear" />
                  </View>
                </TouchableOpacity>
              )}

              {msg.text && (
                <Text
                  style={[
                    msg.isMe ? styles.messageTextRight : styles.messageTextLeft,
                    msg.isMe ? { color: Colors.white } : { color: textColor },
                    msg.image && { marginTop: moderateScale(12) },
                  ]}
                >
                  {msg.text}
                </Text>
              )}
            </View>

            <View style={msg.isMe ? styles.timeStatusContainer : null}>
              <Text style={[styles.timeLabel, { color: textSecondaryColor }]}>{msg.time}</Text>
              {msg.isMe && (
                <CheckCheck size={moderateScale(14)} color={primaryColor} style={{ marginLeft: 4 }} />
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View
        style={[
          styles.inputContainer,
          {
            paddingBottom: insets.bottom || moderateScale(20),
            backgroundColor: cardColor,
            borderTopColor: borderColor,
          },
        ]}
      >
        <View style={[styles.inputWrapper, { backgroundColor: borderColor, borderColor }]}>
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={moderateScale(20)} color={textSecondaryColor} />
          </TouchableOpacity>
          <TextInput
            style={[styles.textInput, { color: textColor }]}
            placeholder="Ask Copilot"
            placeholderTextColor={textSecondaryColor}
            value={inputText}
            onChangeText={setInputText}
            multiline
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: primaryColor, shadowColor: primaryColor }]}
            onPress={handleSend}
          >
            <Send size={moderateScale(18)} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

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
