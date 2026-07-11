import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useStaffs, useStartPersonalChat } from '../_api/chatCreation';
import { useThemeColor } from '@/app/shared/hooks/useThemeColor';
import { ChatAvatar } from './ui/ChatAvatar';
import { styles } from './style';
import TopSearchBar from '@/app/shared/components/TopSearchBar';

interface NewChatModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NewChatModal({ visible, onClose }: NewChatModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');

  const { data: staffs = [], isLoading } = useStaffs();
  const startPersonalChat = useStartPersonalChat();

  const filteredStaffs = staffs.filter((staff: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      staff.firstname?.toLowerCase().includes(searchLower) ||
      staff.lastname?.toLowerCase().includes(searchLower) ||
      staff.profession?.toLowerCase().includes(searchLower) ||
      staff.department?.toLowerCase().includes(searchLower)
    );
  });

  const handleStaffClick = async (staff: any) => {
    try {
      const chatRoom = await startPersonalChat.mutateAsync(staff);
      onClose();
      router.push(`/chat/${chatRoom._id}`);
    } catch (error) {
      console.error('Failed to start personal chat:', error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(12), borderBottomWidth: 1, borderBottomColor: borderColor }}>
          <TouchableOpacity onPress={onClose} style={{ padding: moderateScale(4), marginRight: moderateScale(12) }}>
            <ArrowLeft size={moderateScale(24)} color={textColor} />
          </TouchableOpacity>
          <Text style={{ fontSize: moderateScale(18), fontWeight: '600', color: textColor }}>New Chat</Text>
        </View>

        {/* Search */}
        <View style={{ padding: moderateScale(16) }}>
          <TopSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            hideAskAI={true}
          />
        </View>

        {/* List */}
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={primaryColor} />
            <Text style={{ marginTop: moderateScale(12), color: textSecondaryColor }}>Loading staff...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredStaffs}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: insets.bottom + moderateScale(20) }}
            ListEmptyComponent={() => (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: moderateScale(40) }}>
                <Text style={{ color: textSecondaryColor, fontSize: moderateScale(14) }}>No staff found matching "{searchQuery}"</Text>
              </View>
            )}
            renderItem={({ item: staff }) => (
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', padding: moderateScale(16), borderBottomWidth: 1, borderBottomColor: borderColor }}
                onPress={() => handleStaffClick(staff)}
                disabled={startPersonalChat.isPending}
              >
                <ChatAvatar chat={{ avatarImg: staff.imageurl || `https://ui-avatars.com/api/?name=${staff.firstname}+${staff.lastname}&background=random` }} />
                <View style={{ marginLeft: moderateScale(12), flex: 1 }}>
                  <Text style={{ fontSize: moderateScale(16), fontWeight: '500', color: textColor }}>
                    {staff.firstname} {staff.lastname}
                  </Text>
                  <Text style={{ fontSize: moderateScale(13), color: textSecondaryColor, marginTop: moderateScale(4) }}>
                    {staff.profession || 'Staff'} {staff.department ? `- ${staff.department}` : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </SafeAreaView>

      {/* Loading Overlay when creating chat */}
      {startPersonalChat.isPending && (
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: '#fff', marginTop: moderateScale(12), fontWeight: '600' }}>Creating Chat...</Text>
        </View>
      )}
    </Modal>
  );
}
