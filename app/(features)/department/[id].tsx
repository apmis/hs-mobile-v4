import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Colors, Spacing } from '@/app/shared/constants/Theme';

// Icons
import { Maximize4 } from 'iconsax-react-native';
import {

  Paperclip,
  Send,
  CheckCheck,
  ListTodo,
  Microscope,
  CalendarDays,
  X
} from 'lucide-react-native';
import AppHeader from '@/app/shared/components/AppHeader';

const FILTERS = [
  { id: 'queue', label: 'View Queue', Icon: ListTodo },
  { id: 'labs', label: 'Lab Requests', Icon: Microscope },
  { id: 'staff', label: 'Staff Schedule', Icon: CalendarDays },
];

interface Message {
  id: string;
  sender: string;
  text?: string;
  time: string;
  isMe: boolean;
  image?: string;
}

export default function DepartmentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([]);

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
      sender: 'You',
      text: inputText.trim(),
      time: timeStr,
      isMe: true,
    }]);
    setInputText('');

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Capitalize department name
  const deptName = typeof id === 'string' ? id : 'Radiology';

  const getMoreOptions = () => {
    switch (deptName) {
      case 'Clinic':
        return ['Appointments', 'Check-ins', 'Referrals'];
      case 'Managed Care':
        return [
          'Search',
          'Appointments',
          'Check-ins',
          'Referrals',
          'Pre-authorisations',
          'Claims',
          'Payments',
          'Tariffs',
          'Complaints',
          'Analytics'
        ];
      default:
        return undefined;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <Stack.Screen options={{ headerShown: false }} />

        <AppHeader
          title={deptName}
          showBack={true}
          showSearch={false}
          showIcons={true}
          showLocation={true}
          showMoreOptions={true}
          moreOptions={getMoreOptions()}
        />

        {/* Filter Tabs */}
        {/* <View style={styles.filtersWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <TouchableOpacity 
                key={filter.id}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setActiveFilter(isActive ? null : filter.id)}
                activeOpacity={0.7}
              >
                <filter.Icon size={moderateScale(16)} color={isActive ? Colors.white : Colors.primary} />
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{filter.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View> */}

        {/* Chat Area */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Date Separator */}
          {/* <View style={styles.dateSeparator}>
          <Text style={styles.dateText}>TODAY, OCT 24</Text>
        </View> */}

          {messages.map((msg) => (
            <View key={msg.id} style={msg.isMe ? styles.messageGroupRight : styles.messageGroupLeft}>
              <Text style={msg.isMe ? styles.senderNameRight : styles.senderName}>{msg.sender}</Text>

              <View style={msg.isMe ? styles.bubbleRight : styles.bubbleLeft}>
                {msg.image && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.imageAttachmentContainer}
                    onPress={() => setPreviewImage(msg.image || null)}
                  >
                    <Image
                      source={{ uri: msg.image }}
                      style={styles.attachmentImage}
                    />
                    <View style={styles.expandIconContainer}>
                      <Maximize4 size={moderateScale(24)} color="#FFFFFF" variant="Linear" />
                    </View>
                  </TouchableOpacity>
                )}

                {msg.text && (
                  <Text style={[
                    msg.isMe ? styles.messageTextRight : styles.messageTextLeft,
                    msg.image && { marginTop: moderateScale(12) }
                  ]}>
                    {msg.text}
                  </Text>
                )}
              </View>

              <View style={msg.isMe ? styles.timeStatusContainer : null}>
                <Text style={styles.timeLabel}>{msg.time}</Text>
                {msg.isMe && <CheckCheck size={moderateScale(14)} color="#0059B2" style={{ marginLeft: 4 }} />}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom || moderateScale(20) }]}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.attachButton}>
              <Paperclip size={moderateScale(20)} color="#6B7280" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Ask Copilot"
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Send size={moderateScale(18)} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        <Modal visible={!!previewImage} transparent={true} animationType="fade" onRequestClose={() => setPreviewImage(null)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={[styles.closeModalButton, { top: insets.top + moderateScale(20) }]}
              onPress={() => setPreviewImage(null)}
            >
              <X size={moderateScale(28)} color="#FFFFFF" />
            </TouchableOpacity>
            {previewImage && (
              <Image
                source={{ uri: previewImage }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: moderateScale(2),
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: '#10B981',
    marginRight: moderateScale(6),
  },
  onlineText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  moreButton: {
    padding: Spacing.xs,
  },
  filtersWrapper: {
    backgroundColor: Colors.white,
    paddingVertical: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  filtersScrollContent: {
    paddingHorizontal: Spacing.md,
    gap: moderateScale(10),
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(10),
    gap: moderateScale(8),
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#4B5563',
  },
  filterTextActive: {
    color: Colors.white,
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
    marginVertical: moderateScale(16),
  },
  dateText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  messageGroupLeft: {
    marginBottom: moderateScale(20),
    alignItems: 'flex-start',
    maxWidth: '85%',
  },
  senderName: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: moderateScale(6),
    marginLeft: moderateScale(4),
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
  messageGroupRight: {
    marginBottom: moderateScale(20),
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  senderNameRight: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#10B981',
    marginBottom: moderateScale(6),
    marginRight: moderateScale(4),
  },
  bubbleRight: {
    backgroundColor: Colors.primary,
    padding: moderateScale(14),
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: 0,
    borderBottomRightRadius: moderateScale(16),
    borderBottomLeftRadius: moderateScale(16),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  messageTextRight: {
    fontSize: moderateScale(15),
    color: Colors.white,
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
    color: '#9CA3AF',
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
    borderRadius: moderateScale(24),
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: '#1F2937',
    paddingHorizontal: moderateScale(8),
    paddingTop: Platform.OS === 'ios' ? moderateScale(10) : moderateScale(8),
  },
  sendButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: moderateScale(8),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
