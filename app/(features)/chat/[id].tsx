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
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Colors, Spacing } from '@/app/shared/constants/Theme';

// Icons
import { ArrowLeft, DocumentDownload, Paperclip2, ChartSquare, Folder2, ExportSquare, TickCircle } from 'iconsax-react-native';
import {
  MoreVertical,
  Send,
  Video,
  Smile,
  Leaf,
  Activity,
  CheckCheck
} from 'lucide-react-native';
import { CHAT_LIST } from '@/app/(tabs)/chats';

export default function ChatWrapperScreen() {
  const { id, fallbackName, fallbackAvatar } = useLocalSearchParams();
  const chatItem = CHAT_LIST.find((c) => c.id === id);

  if (id === '1' || chatItem?.iconType === 'group' || chatItem?.extraIcons) {
    return <GroupChatDetail id={id} chatItem={chatItem} fallbackName={fallbackName} fallbackAvatar={fallbackAvatar} />;
  }

  return <ConsultationChatDetail id={id} chatItem={chatItem} fallbackName={fallbackName} fallbackAvatar={fallbackAvatar} />;
}

// -------------------------------------------------------------
// 1) GROUP CHAT UI (For "Surgical Team")
// -------------------------------------------------------------
function GroupChatDetail({ id, chatItem, fallbackName, fallbackAvatar }: any) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = React.useRef<ScrollView>(null);

  const [messages, setMessages] = useState<any[]>([
    {
      id: '1',
      isMe: false,
      sender: 'Dr. Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      time: '09:42 AM',
      text: 'Reviewing the labs for Case #8821. Creatinine levels are slightly elevated. Thoughts on adjusting the hydration protocol before we move to the next phase?',
      attachmentName: 'LabResults_8821.pdf'
    },
    {
      id: '2',
      isMe: false,
      sender: 'Dr. Thorne',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      time: '09:45 AM',
      text: "Agreed. I've seen similar trajectories in Case #7740. Let's increase saline to 125ml/hr and re-evaluate in 4 hours."
    },
    {
      id: '3',
      isMe: true,
      sender: 'You',
      time: '09:48 AM',
      text: "Noted. I'll update the orders now and alert the nursing staff for the 14:00 draw. @Dr. Chen, should we hold the NSAIDs for now?",
    },
    {
      id: '4',
      type: 'alert',
      text: 'Order #8821-H updated to Active status'
    },
    {
      id: '5',
      isMe: false,
      sender: 'Dr. Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      time: '09:50 AM',
      text: "Yes, let's hold NSAIDs until we see the next creatinine result. Good catch."
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
    setInputText('');
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F8F9FA' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + moderateScale(10) }]}>
        <TouchableOpacity style={styles.iconButtonLeft} onPress={() => router.back()}>
          <ArrowLeft size={moderateScale(24)} color="#4B5563" variant="Linear" />
        </TouchableOpacity>

        {/* Avatars Cluster */}
        <View style={styles.groupAvatarCluster}>
          <Image source={{ uri: chatItem?.extraIcons?.[0] || 'https://randomuser.me/api/portraits/men/32.jpg' }} style={[styles.clusterImg, { zIndex: 3 }]} />
          <Image source={{ uri: chatItem?.extraIcons?.[1] || 'https://randomuser.me/api/portraits/women/44.jpg' }} style={[styles.clusterImg, { marginLeft: -moderateScale(12), zIndex: 2 }]} />
          <View style={[styles.clusterBadge, { marginLeft: -moderateScale(12), zIndex: 1 }]}>
            <Text style={styles.clusterBadgeText}>+1</Text>
          </View>
        </View>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{chatItem?.name || fallbackName || 'Surgical Team'}</Text>
          <Text style={styles.headerSubtitleGroup}>{chatItem?.tag || '#X-PATIENT  •  CASE #8821'}</Text>
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
        {/* Pinned Case File Card */}
        <View style={styles.pinnedCaseCard}>
          <View style={styles.pinnedBlueAccent} />
          <View style={styles.pinnedContent}>
            <View style={styles.pinnedLeft}>
              <View style={styles.pinnedIconBox}>
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/337/337946.png' }} style={styles.folderIcon} />
              </View>
              <View style={styles.pinnedTextCol}>
                <Text style={styles.pinnedTitle}>Case #8821: Post-Op Strategy</Text>
                <Text style={styles.pinnedSub}>Last updated 14 mins ago</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewCaseBtn} activeOpacity={0.8}>
              <Text style={styles.viewCaseBtnText}>View Case File</Text>
              <ExportSquare size={moderateScale(14)} color="#FFFFFF" variant="Linear" style={{ marginLeft: moderateScale(4) }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date */}
        <View style={styles.dateSeparator}><Text style={styles.dateText}>TODAY</Text></View>

        {messages.map((msg) => {
          if (msg.type === 'alert') {
            return (
              <View key={msg.id} style={styles.systemAlertContainer}>
                <View style={styles.systemAlertBubble}>
                  <TickCircle size={moderateScale(18)} color="#065F46" variant="Bold" />
                  <Text style={styles.systemAlertText}>{msg.text}</Text>
                </View>
              </View>
            );
          }

          if (msg.isMe) {
            return (
              <View key={msg.id} style={styles.groupMessageRowRight}>
                <View style={styles.groupMsgContentColRight}>
                  <Text style={styles.groupSenderNameRight}>{msg.sender}</Text>
                  <View style={styles.bubbleRightGroup}>
                    <Text style={styles.messageTextRight}>
                      {msg.text}
                    </Text>
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
            <View key={msg.id} style={styles.groupMessageRow}>
              <View style={styles.groupAvatarCol}>
                <Image source={{ uri: msg.avatar || 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.groupMessageAvatar} />
              </View>
              <View style={styles.groupMsgContentCol}>
                <Text style={styles.groupSenderName}>{msg.sender}</Text>
                <View style={styles.bubbleLeftGroup}>
                  <Text style={styles.messageTextLeft}>
                    {msg.text}
                  </Text>
                  {msg.attachmentName && (
                    <View style={styles.innerAttachmentBlock}>
                      <ChartSquare size={moderateScale(16)} color="#065F46" variant="Bold" />
                      <Text style={styles.innerAttachmentText}>{msg.attachmentName}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.groupTimeLabelLeft}>{msg.time}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Standard Input Area */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom || moderateScale(20) }]}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip2 size={moderateScale(22)} color="#9CA3AF" variant="Linear" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.smileButton}>
            <Smile size={moderateScale(22)} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Send size={moderateScale(18)} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// -------------------------------------------------------------
// 2) CONSULTATION CHAT UI (For "Medical Consultation")
// -------------------------------------------------------------
function ConsultationChatDetail({ id, chatItem, fallbackName, fallbackAvatar }: any) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = React.useRef<ScrollView>(null);

  const chatName = chatItem?.name || fallbackName || 'Medical Consultation';
  const chatAvatar = chatItem?.avatarImg || fallbackAvatar || 'https://randomuser.me/api/portraits/men/32.jpg';
  const isOnline = chatItem?.isOnline ?? true;

  const [messages, setMessages] = useState<any[]>([
    {
      id: '1',
      isMe: false,
      sender: 'CARE TEAM',
      time: '10:15 AM',
      text: "Hello Alex, we've finished reviewing your latest laboratory results from yesterday's check-up. Based on your progress, we've made some positive adjustments to your recovery schedule.",
    },
    {
      id: '2',
      isMe: false,
      sender: 'CARE TEAM',
      time: '10:16 AM',
      file: {
        name: 'Updated Care Plan.pdf',
        size: '1.4 MB • Medical File',
      }
    },
    {
      id: '3',
      isMe: false,
      sender: 'CARE TEAM',
      time: '10:18 AM',
      text: "The new plan reduces your physical therapy frequency while increasing low-impact mobility exercises. Please take a look and let us know if you have any questions before our call tomorrow. You're doing great! 🌿",
    },
    {
      id: '4',
      type: 'insight',
      title: 'RECOVERY INSIGHT',
      desc: 'Your mobility score improved by 12% this week. Keep it up!',
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
    setInputText('');
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F8F9FA' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + moderateScale(10) }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={moderateScale(24)} color={Colors.text} variant="Linear" />
        </TouchableOpacity>

        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: chatAvatar }}
            style={styles.headerAvatar}
          />
          {isOnline && <View style={styles.onlineDot} />}
        </View>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{chatName}</Text>
          <Text style={[styles.onlineText, !isOnline && { color: '#6B7280' }]}>{isOnline ? 'Active Now' : 'Offline'}</Text>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Video size={moderateScale(24)} color="#4B5563" />
        </TouchableOpacity>
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
        <View style={styles.sessionPillContainer}>
          <View style={styles.sessionPill}>
            <Text style={styles.sessionPillText}>
              SESSION: <Text style={{ color: '#0059B2', fontWeight: '700' }}>ALEX RIVERA (PATIENT)</Text>  •  #PATIENT-ST.JUDE
            </Text>
          </View>
        </View>

        <View style={styles.dateSeparator}>
          <Text style={styles.dateText}>TODAY, OCT 24</Text>
        </View>

        {messages.map((msg) => {
          if (msg.type === 'insight') {
            return (
              <View key={msg.id} style={styles.insightCard}>
                <View style={styles.insightIconBox}>
                  <Activity size={moderateScale(24)} color="#065F46" />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>{msg.title}</Text>
                  <Text style={styles.insightDesc}>{msg.desc}</Text>
                </View>
              </View>
            );
          }

          if (msg.isMe) {
            return (
              <View key={msg.id} style={styles.groupMessageRowRight}>
                <View style={styles.groupMsgContentColRight}>
                  <Text style={styles.groupSenderNameRight}>{msg.sender}</Text>
                  <View style={styles.bubbleRightGroup}>
                    <Text style={styles.messageTextRight}>
                      {msg.text}
                    </Text>
                  </View>
                  <View style={styles.timeStatusContainerRight}>
                    <Text style={styles.groupTimeLabelRight}>{msg.time}</Text>
                    <CheckCheck size={moderateScale(14)} color="#1D4ED8" style={{ marginLeft: 4 }} />
                  </View>
                </View>
              </View>
            );
          }

          if (msg.file) {
            return (
              <View key={msg.id} style={styles.messageGroupLeftConsult}>
                <View style={styles.fileAttachmentBorder}>
                  <View style={styles.fileAttachmentCard}>
                    <View style={styles.fileIconBox}>
                      <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/337/337946.png' }} style={styles.pdfIcon} />
                    </View>
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName}>{msg.file.name}</Text>
                      <Text style={styles.fileSize}>{msg.file.size}</Text>
                    </View>
                    <TouchableOpacity style={styles.downloadBtn}>
                      <DocumentDownload size={moderateScale(20)} color="#0059B2" variant="Outline" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={[styles.timeLabel, { marginTop: moderateScale(4) }]}>{msg.time}</Text>
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
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip2 size={moderateScale(22)} color="#9CA3AF" variant="Linear" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.smileButton}>
            <Smile size={moderateScale(22)} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Send size={moderateScale(18)} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// -------------------------------------------------------------
// UNIFIED STYLES
// -------------------------------------------------------------
const styles = ScaledSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    zIndex: 10,
  },
  backButton: {
    marginRight: Spacing.sm,
  },
  iconButtonLeft: {
    padding: Spacing.xs,
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
    paddingBottom: moderateScale(80),
  },
  sessionPillContainer: {
    alignItems: 'center',
    marginBottom: moderateScale(16),
  },
  sessionPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(16),
  },
  sessionPillText: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
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

  // Group Header specifics
  groupAvatarCluster: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clusterImg: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    borderWidth: 2,
    borderColor: Colors.white,
  },
  clusterBadge: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: '#0059B2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clusterBadgeText: {
    color: Colors.white,
    fontSize: moderateScale(12),
    fontWeight: '700',
  },
  headerSubtitleGroup: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: '#6B7280',
    marginTop: moderateScale(2),
    letterSpacing: 0.5,
  },

  // Group Chat Layout
  pinnedCaseCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(16),
    marginBottom: moderateScale(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  pinnedBlueAccent: {
    width: moderateScale(6),
    backgroundColor: '#0059B2',
  },
  pinnedContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: moderateScale(14),
  },
  pinnedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pinnedIconBox: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(10),
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  folderIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
    resizeMode: 'contain',
  },
  pinnedTextCol: {
    flex: 1,
  },
  pinnedTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: moderateScale(2),
  },
  pinnedSub: {
    fontSize: moderateScale(12),
    color: '#6B7280',
    fontWeight: '500',
  },
  viewCaseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0059B2',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(16),
    marginLeft: moderateScale(8),
  },
  viewCaseBtnText: {
    color: Colors.white,
    fontSize: moderateScale(12),
    fontWeight: '600',
  },

  // Group Message specifics
  groupMessageRow: {
    flexDirection: 'row',
    marginBottom: moderateScale(16),
  },
  groupMessageRowRight: {
    flexDirection: 'row',
    marginBottom: moderateScale(16),
    justifyContent: 'flex-end',
  },
  groupAvatarCol: {
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  groupMessageAvatar: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
  },
  groupTimeLabelLeft: {
    fontSize: moderateScale(10),
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: moderateScale(6),
    marginLeft: moderateScale(4),
  },
  groupTimeLabelRight: {
    fontSize: moderateScale(10),
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: moderateScale(6),
    marginRight: moderateScale(4),
  },
  groupMsgContentCol: {
    flex: 1,
    maxWidth: '85%',
  },
  groupMsgContentColRight: {
    maxWidth: '85%',
    alignItems: 'flex-end',
  },
  groupSenderName: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: moderateScale(4),
    marginLeft: moderateScale(4),
  },
  groupSenderNameRight: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#0059B2',
    marginBottom: moderateScale(4),
    marginRight: moderateScale(4),
  },
  bubbleLeftGroup: {
    backgroundColor: Colors.white,
    padding: moderateScale(16),
    borderRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
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
  innerAttachmentBlock: {
    marginTop: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(12),
  },
  innerAttachmentText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#065F46',
    marginLeft: moderateScale(8),
  },
  timeStatusContainerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  // System alert
  systemAlertContainer: {
    alignItems: 'center',
    marginVertical: moderateScale(16),
  },
  systemAlertBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(16),
  },
  systemAlertText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: '#065F46',
    marginLeft: moderateScale(8),
  },

  // Consultation Layout specific blocks
  messageGroupLeftConsult: {
    marginBottom: moderateScale(16),
    alignItems: 'flex-start',
    maxWidth: '85%',
  },
  senderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(6),
  },
  senderBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(8),
    marginRight: moderateScale(6),
  },
  senderBadgeText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: '#3730A3',
  },
  timeLabel: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    color: '#9CA3AF',
  },
  bubbleLeft: {
    backgroundColor: Colors.white,
    padding: moderateScale(16),
    borderRadius: moderateScale(18),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
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
  fileAttachmentBorder: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(16),
    padding: moderateScale(2),
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  fileAttachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
    borderRadius: moderateScale(14),
  },
  fileIconBox: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(10),
    backgroundColor: '#FDE4E4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  pdfIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
    resizeMode: 'contain',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: moderateScale(2),
  },
  fileSize: {
    fontSize: moderateScale(12),
    color: '#6B7280',
    fontWeight: '500',
  },
  downloadBtn: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: moderateScale(10),
  },
  insightCard: {
    backgroundColor: '#D1FAE5',
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(20),
  },
  insightIconBox: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#A7F3D0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: moderateScale(11),
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.5,
    marginBottom: moderateScale(2),
  },
  insightDesc: {
    fontSize: moderateScale(14),
    color: '#065F46',
    fontWeight: '500',
  },
  fabMic: {
    position: 'absolute',
    right: Spacing.md,
    bottom: moderateScale(85),
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: '#0059B2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0059B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  inputContainer: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: Spacing.md,
    paddingTop: moderateScale(10),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: moderateScale(30),
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(6),
  },
  attachButton: {
    padding: moderateScale(10),
  },
  textInput: {
    flex: 1,
    minHeight: moderateScale(40),
    fontSize: moderateScale(15),
    color: '#1F2937',
    paddingHorizontal: moderateScale(4),
  },
  smileButton: {
    padding: moderateScale(10),
  },
  sendButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#0059B2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: moderateScale(4),
  },
});
