import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Platform, Keyboard, ScrollView, Text } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Paperclip2 } from 'iconsax-react-native';
import { Smile, Send } from 'lucide-react-native';
import EmojiPicker from 'rn-emoji-keyboard';

import { styles } from '../style/chatDetailStyles';
import { useThemeColor } from '@/app/shared/hooks/useThemeColor';

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSend: () => void;
  isSending?: boolean;
  hideAttachments?: boolean;
  placeholder?: string;
}

export function ChatInput({
  inputText,
  setInputText,
  onSend,
  isSending = false,
  hideAttachments = false,
  placeholder = "Type a message..."
}: ChatInputProps) {
  const insets = useSafeAreaInsets();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPress = (emojiObj: any) => {
    setInputText(inputText + emojiObj.emoji);
  };

  const handleSendPress = () => {
    setShowEmojiPicker(false);
    onSend();
  };

  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const primaryColor = useThemeColor({}, 'primary');

  useEffect(() => {
    if (Platform.OS === 'ios') return;
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const paddingBottom = Platform.OS === 'android' && isKeyboardVisible
    ? moderateScale(10)
    : (insets.bottom || moderateScale(20));

  return (
    <View style={[styles.inputContainer, { paddingBottom, backgroundColor }]}>

      <View style={[styles.inputWrapper, { backgroundColor: borderColor }]}>
        {!hideAttachments && (
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip2 size={moderateScale(22)} color={textSecondaryColor} variant="Linear" />
          </TouchableOpacity>
        )}

        <TextInput
          style={[styles.textInput, { color: textColor }]}
          placeholder={placeholder}
          placeholderTextColor={textSecondaryColor}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSendPress}
          editable={!isSending}
        />

        {!hideAttachments && (
          <TouchableOpacity style={styles.smileButton} onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
            <Smile size={moderateScale(22)} color={showEmojiPicker ? primaryColor : textSecondaryColor} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: isSending || !inputText.trim() ? textSecondaryColor : primaryColor }
          ]}
          onPress={handleSendPress}
          disabled={isSending || !inputText.trim()}
        >
          <Send size={moderateScale(18)} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <EmojiPicker
        open={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onEmojiSelected={handleEmojiPress}
        enableSearchBar={true}
        expandable={true}
        theme={{
          backdrop: 'rgba(0, 0, 0, 0.3)',
          knob: textSecondaryColor,
          container: backgroundColor,
          header: textColor,
          skinTonesContainer: borderColor,
          category: {
            icon: textSecondaryColor,
            iconActive: primaryColor,
            container: backgroundColor,
            containerActive: 'transparent',
          },
          search: {
            background: borderColor,
            text: textColor,
            placeholder: textSecondaryColor,
            icon: textSecondaryColor,
          }
        }}
      />
    </View>
  );
}
