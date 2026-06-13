import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Platform, StatusBar, TextInput, Modal, KeyboardAvoidingView } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/app/shared/constants/Theme';
import { People, Edit2, Microscope } from 'iconsax-react-native';
import { FileText, Search, X, Camera, MoreVertical, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AppHeader from '@/app/shared/components/AppHeader';
import { ThemedView } from '@/app/shared/components/ui/ThemedView';
import { ThemedText } from '@/app/shared/components/ui/ThemedText';
import { useThemeColor } from '@/app/shared/hooks/useThemeColor';

// Removing hard-coded filter line, implementing via state instead

export const CHAT_LIST = [
  {
    id: 'copilot',
    name: 'HealthStack Copilot',
    message: 'How can I help you today?',
    time: 'Now',
    tag: 'AI Assistant',
    tagColor: '#F3E8FF',
    tagTextColor: '#9333EA',
    avatarImg: 'https://api.dicebear.com/7.x/bottts/png?seed=copilot&backgroundColor=F3E8FF',
    isOnline: true,
    unread: false,
  },
  {
    id: '1',
    name: 'Surgical Team',
    message: 'Discussing Case #8821 - Pre-op cle...',
    time: '10:42 AM',
    tag: 'Patient',
    tagColor: '#E0E7FF',
    tagTextColor: '#3730A3',
    avatarImg: 'https://images.unsplash.com/photo-1582750433449-648ed127d09e?q=80&w=200&auto=format&fit=crop', // Stock doctor team
    isOnline: true,
    unread: false,
    extraIcons: [
      'https://randomuser.me/api/portraits/men/32.jpg',
      'https://randomuser.me/api/portraits/women/44.jpg'
    ]
  },
  {
    id: '2',
    name: 'Alex Rivera (Patient)',
    message: 'Care plan update: "Thank you ..."',
    time: '09:15 AM',
    tag: 'Patient-St.Jude',
    tagColor: '#D1FAE5',
    tagTextColor: '#065F46',
    avatarImg: 'https://randomuser.me/api/portraits/men/44.jpg',
    isOnline: false,
    unread: true,
  },
  {
    id: '3',
    name: 'Nursing Staff Lounge',
    message: 'Shift change notes: Station 4 is fully ...',
    time: 'Yesterday',
    tag: '#Employees',
    tagColor: '#E5E7EB',
    tagTextColor: '#4B5563',
    iconType: 'group',
    membersOnline: 12,
    isOnline: true,
    unread: false,
  },
  {
    id: '4',
    name: 'Oncology Research',
    message: 'New protocol study: Phase 3 enrollm...',
    time: 'Mon',
    tag: '#Custom',
    tagColor: '#A7F3D0',
    tagTextColor: '#065F46',
    iconType: 'science',
    isOnline: false,
    unread: false,
  },
  {
    id: '5',
    name: 'Sarah Jenkins (Patient)',
    message: 'Lab results inquiry: "Are the blood w...',
    time: 'Sun',
    tag: 'Patient-MayoClinic',
    tagColor: '#D1FAE5',
    tagTextColor: '#065F46',
    avatarImg: 'https://randomuser.me/api/portraits/women/33.jpg',
    isOnline: true,
    unread: false,
  }
];

export default function ChatList() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(['All', 'Unread', 'Patient', 'System']);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [newFilterText, setNewFilterText] = useState('');
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');

  const renderAvatar = (chat: any) => {
    if (chat.avatarImg) {
      return (
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: chat.avatarImg }} style={styles.avatarImage} />
          <View style={[styles.statusDot, { borderColor: backgroundColor, backgroundColor: chat.isOnline ? '#10B981' : textSecondaryColor }]} />
        </View>
      );
    }

    if (chat.iconType === 'group') {
      return (
        <View style={styles.avatarWrapper}>
          <View style={[styles.avatarIconBox, { backgroundColor: borderColor }]}>
            <People size={moderateScale(24)} color={textSecondaryColor} variant="Bold" />
          </View>
          <View style={[styles.statusDot, { borderColor: backgroundColor, backgroundColor: chat.isOnline ? '#10B981' : textSecondaryColor }]} />
        </View>
      );
    }

    if (chat.iconType === 'science') {
      return (
        <View style={styles.avatarWrapper}>
          <View style={[styles.avatarIconBox, { backgroundColor: '#064E3B' }]}>
            <Microscope size={moderateScale(24)} color="#FFFFFF" variant="Bold" />
          </View>
          <View style={[styles.statusDot, { borderColor: backgroundColor, backgroundColor: chat.isOnline ? '#10B981' : textSecondaryColor }]} />
        </View>
      );
    }
    return null;
  };

  const filteredChats = CHAT_LIST.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top', 'left', 'right']}>
      {/* Main Header */}
      <AppHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showMoreOptions={true}
        moreOptions={['New Chat', 'New Group', 'Settings', "Logout"]}
        onOptionPress={(option) => {
          if (option === 'Logout') {
            router.replace('/(auth)/chat-login');
          }
        }}
      />

      {/* Chat List */}
      <ScrollView
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + moderateScale(80) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Filters Header */}
        <ThemedView style={[styles.filtersWrapper, { marginHorizontal: -Spacing.md }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScrollContent}
          >
            {filters.map((f, i) => {
              const isActive = activeFilter === f;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.filterPill, { backgroundColor: cardColor, borderColor }, isActive && [styles.filterPillActive, { backgroundColor: primaryColor, borderColor: primaryColor }]]}
                  onPress={() => setActiveFilter(f)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterText, { color: textSecondaryColor }, isActive && styles.filterTextActive]}>{f}</Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={[styles.filterPillAdd, { backgroundColor: cardColor, borderColor }]}
              onPress={() => setShowFilterModal(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterTextAdd, { color: textSecondaryColor }]}>+</Text>
            </TouchableOpacity>
          </ScrollView>
        </ThemedView>
        {filteredChats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={[styles.chatRow, { borderBottomColor: borderColor }]}
            activeOpacity={0.7}
            onPress={() => router.push(`/chat/${chat.id}`)}
          >
            {renderAvatar(chat)}

            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={[styles.chatName, { color: textColor }, chat.unread && [styles.chatNameUnread, { color: textColor }]]}>
                  {chat.name}
                </Text>
                <Text style={[styles.chatTime, { color: textSecondaryColor }, chat.unread && [styles.chatTimeUnread, { color: primaryColor }]]}>
                  {chat.time}
                </Text>
              </View>

              <View style={styles.chatSubHeader}>
                <Text
                  style={[styles.chatMessage, { color: textSecondaryColor }, chat.unread && [styles.chatMessageUnread, { color: textColor }]]}
                  numberOfLines={1}
                >
                  {chat.message}
                </Text>
                {chat.unread && <View style={[styles.unreadDot, { backgroundColor: primaryColor }]} />}
              </View>

              <View style={styles.tagRow}>
                <View style={[styles.tagPill, { backgroundColor: chat.tagColor }]}>
                  <Text style={[styles.tagText, { color: chat.tagTextColor }]}>{chat.tag}</Text>
                </View>

                {chat.extraIcons && (
                  <View style={styles.extraIconsContainer}>
                    {chat.extraIcons.map((uri, idx) => (
                      <Image
                        key={idx}
                        source={{ uri }}
                        style={[styles.smallAvatar, { marginLeft: idx > 0 ? -moderateScale(8) : moderateScale(8) }]}
                      />
                    ))}
                  </View>
                )}

                {chat.membersOnline && (
                  <Text style={[styles.membersOnlineText, { color: textSecondaryColor }]}>{chat.membersOnline} members online</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Filter Modal */}
      <Modal visible={showFilterModal} transparent animationType="fade" onRequestClose={() => setShowFilterModal(false)}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ThemedView style={styles.filterModalContent} variant="card">
            <ThemedText type="h2" style={styles.filterModalTitle}>Add Custom Filter</ThemedText>
            <TextInput
              style={[styles.filterInput, { backgroundColor, borderColor, color: textColor }]}
              placeholder="e.g. ICU, Priority..."
              placeholderTextColor={textSecondaryColor}
              value={newFilterText}
              onChangeText={setNewFilterText}
              autoFocus
            />
            <View style={styles.filterModalActions}>
              <TouchableOpacity style={[styles.filterModalBtn, { backgroundColor: cardColor }]} onPress={() => {
                setShowFilterModal(false);
                setNewFilterText('');
              }}>
                <Text style={[styles.filterModalBtnText, { color: textSecondaryColor }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterModalBtn, { backgroundColor: primaryColor }]} onPress={() => {
                if (newFilterText.trim()) {
                  setFilters([...filters, newFilterText.trim()]);
                  setActiveFilter(newFilterText.trim());
                }
                setShowFilterModal(false);
                setNewFilterText('');
              }}>
                <Text style={styles.filterModalBtnTextPrimary}>Add Filter</Text>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: Colors.white,
  },
  mainHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateScale(16),
  },
  mainHeaderTitle: {
    fontSize: moderateScale(24),
    fontWeight: '800',
    color: '#1A1A1A',
  },
  mainHeaderSubtitle: {
    fontSize: moderateScale(13),
    color: '#0059B2',
    fontWeight: '600',
    marginTop: moderateScale(2),
  },
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(16),
  },
  iconBtn: {
    padding: moderateScale(4),
  },
  actionButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    height: moderateScale(48),
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateScale(8),
    fontSize: moderateScale(14),
    color: Colors.text,
  },
  closeSearchBtn: {
    padding: moderateScale(4),
  },
  filtersWrapper: {
    paddingVertical: Spacing.sm,
    // Note: Background color is now handled by ThemedView automatically!
  },
  filtersScrollContent: {
    paddingHorizontal: Spacing.md,
    gap: moderateScale(10),
  },
  filterPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(20),
  },
  filterPillActive: {
    backgroundColor: '#0059B2',
  },
  filterText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#4B5563',
  },
  filterTextActive: {
    color: Colors.white,
  },
  filterPillAdd: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTextAdd: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  filterModalContent: {
    // backgroundColor: Colors.white, // Handled by ThemedView variant="card"
    borderRadius: moderateScale(16),
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  filterModalTitle: {
    // fontSize: moderateScale(18), // Handled by ThemedText type="h2"
    // fontWeight: '700',           // Handled by ThemedText type="h2"
    // color: '#1A1A1A',            // Handled by ThemedText type="h2"
    marginBottom: Spacing.md,
  },
  filterInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(12),
    minHeight: moderateScale(44),
    fontSize: moderateScale(15),
    color: '#1F2937',
    marginBottom: Spacing.lg,
  },
  filterModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  filterModalBtn: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(8),
  },
  filterModalBtnPrimary: {
    backgroundColor: '#0059B2',
  },
  filterModalBtnText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#6B7280',
  },
  filterModalBtnTextPrimary: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Colors.white,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: moderateScale(14),
  },
  avatarImage: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
  },
  avatarIconBox: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: moderateScale(14),
    height: moderateScale(14),
    borderRadius: moderateScale(7),
    borderWidth: 2,
    borderColor: Colors.white,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(4),
  },
  chatName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    paddingRight: moderateScale(10),
  },
  chatNameUnread: {
    color: '#1A1A1A',
  },
  chatTime: {
    fontSize: moderateScale(12),
    color: '#9CA3AF',
    fontWeight: '500',
  },
  chatTimeUnread: {
    color: '#0059B2',
    fontWeight: '600',
  },
  chatSubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateScale(8),
    paddingRight: moderateScale(4),
  },
  chatMessage: {
    fontSize: moderateScale(14),
    color: '#6B7280',
    flex: 1,
  },
  chatMessageUnread: {
    color: '#0059B2',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  unreadDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: '#0059B2',
    marginLeft: moderateScale(8),
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagPill: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
  },
  tagText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
  },
  extraIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallAvatar: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  membersOnlineText: {
    fontSize: moderateScale(11),
    color: '#9CA3AF',
    marginLeft: moderateScale(10),
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: Spacing.md,
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(18),
    backgroundColor: '#0059B2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0059B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
});
