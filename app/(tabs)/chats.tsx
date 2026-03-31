import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Platform, TextInput } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../constants/Theme';
import { People, Edit2, Microscope } from 'iconsax-react-native';
import { FileText, Search, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const FILTERS = ['All Chats', '#x-Patient', '#Patient-Facility', '#Internal'];

export const CHAT_LIST = [
  {
    id: '1',
    name: 'Surgical Team',
    message: 'Discussing Case #8821 - Pre-op cle...',
    time: '10:42 AM',
    tag: '#x-Patient',
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
    tag: '#Patient-St.Jude',
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
    tag: '#Patient-MayoClinic',
    tagColor: '#D1FAE5',
    tagTextColor: '#065F46',
    avatarImg: 'https://randomuser.me/api/portraits/women/33.jpg',
    isOnline: true,
    unread: false,
  }
];

export default function ChatsScreen() {
  const [activeFilter, setActiveFilter] = useState('All Chats');
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const renderAvatar = (chat: any) => {
    if (chat.avatarImg) {
      return (
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: chat.avatarImg }} style={styles.avatarImage} />
          <View style={[styles.statusDot, { backgroundColor: chat.isOnline ? '#10B981' : '#D1D5DB' }]} />
        </View>
      );
    }
    
    if (chat.iconType === 'group') {
      return (
        <View style={styles.avatarWrapper}>
          <View style={[styles.avatarIconBox, { backgroundColor: '#E5E7EB' }]}>
            <People size={moderateScale(24)} color="#4B5563" variant="Bold" />
          </View>
          <View style={[styles.statusDot, { backgroundColor: chat.isOnline ? '#10B981' : '#D1D5DB' }]} />
        </View>
      );
    }

    if (chat.iconType === 'science') {
      return (
        <View style={styles.avatarWrapper}>
          <View style={[styles.avatarIconBox, { backgroundColor: '#064E3B' }]}>
            <Microscope size={moderateScale(24)} color="#FFFFFF" variant="Bold" />
          </View>
          <View style={[styles.statusDot, { backgroundColor: chat.isOnline ? '#10B981' : '#D1D5DB' }]} />
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
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Main Header */}
      <View style={styles.mainHeader}>
        {isSearching ? (
          <View style={styles.searchBarContainer}>
            <Search size={moderateScale(20)} color="#9CA3AF" />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search chats by name or message..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity onPress={() => {
              setIsSearching(false);
              setSearchQuery('');
            }} style={styles.closeSearchBtn}>
              <X size={moderateScale(20)} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View>
              <Text style={styles.mainHeaderTitle}>Chats</Text>
              <Text style={styles.mainHeaderSubtitle}>4 unread conversations</Text>
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={() => setIsSearching(true)}>
              <Search size={moderateScale(22)} color="#1F2937" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Filters Header */}
      <View style={styles.filtersWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          {FILTERS.map((f, i) => {
            const isActive = activeFilter === f;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setActiveFilter(f)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Chat List */}
      <ScrollView 
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + moderateScale(80) }]}
        showsVerticalScrollIndicator={false}
      >
        {filteredChats.map((chat) => (
          <TouchableOpacity 
            key={chat.id} 
            style={styles.chatRow}
            activeOpacity={0.7}
            onPress={() => router.push(`/chat/${chat.id}`)}
          >
            {renderAvatar(chat)}
            
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={[styles.chatName, chat.unread && styles.chatNameUnread]}>
                  {chat.name}
                </Text>
                <Text style={[styles.chatTime, chat.unread && styles.chatTimeUnread]}>
                  {chat.time}
                </Text>
              </View>
              
              <View style={styles.chatSubHeader}>
                <Text 
                  style={[styles.chatMessage, chat.unread && styles.chatMessageUnread]} 
                  numberOfLines={1}
                >
                  {chat.message}
                </Text>
                {chat.unread && <View style={styles.unreadDot} />}
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
                  <Text style={styles.membersOnlineText}>{chat.membersOnline} members online</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    backgroundColor: Colors.white,
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
  searchButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(12),
    height: moderateScale(40),
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateScale(8),
    fontSize: moderateScale(14),
    color: '#1F2937',
  },
  closeSearchBtn: {
    padding: moderateScale(4),
  },
  filtersWrapper: {
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
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
