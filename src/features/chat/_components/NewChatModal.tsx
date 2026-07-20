import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useStaffs, useStartPersonalChat, useFacilities, useClients } from '../_api/chatCreation';
import { useThemeColor } from '@/src/shared/hooks/useThemeColor';
import { ChatAvatar } from './ui/ChatAvatar';
import { styles } from './style';
import TopSearchBar from '@/src/shared/components/TopSearchBar';
import Input from '@/src/shared/components/ui/Input';
import { useUser } from '@/src/shared/api/auth';

interface NewChatModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NewChatModal({ visible, onClose }: NewChatModalProps) {
  const [activeTab, setActiveTab] = useState<'staff' | 'client'>('staff');
  const [searchQuery, setSearchQuery] = useState('');
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data: user } = useUser();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const primaryLightColor = useThemeColor({}, 'primaryLight');

  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [facilitySearchQuery, setFacilitySearchQuery] = useState('');

  const { data: facilities = [], isLoading: loadingFacilities } = useFacilities(facilitySearchQuery);
  const { data: staffs = [], isLoading } = useStaffs(selectedFacility?._id);
  const { data: clients = [], isLoading: loadingClients } = useClients(clientSearchQuery);
  
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

  const handleStartChat = async (userToChat: any, type: 'staff' | 'client') => {
    try {
      const chatRoom = await startPersonalChat.mutateAsync({ userToChat, type });
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

        {/* Segmented Control */}
        <View style={{ flexDirection: 'row', paddingHorizontal: moderateScale(16), paddingTop: moderateScale(16), paddingBottom: moderateScale(8) }}>
          <TouchableOpacity
            style={{ flex: 1, paddingVertical: moderateScale(8), borderBottomWidth: 2, borderBottomColor: activeTab === 'staff' ? primaryColor : 'transparent', alignItems: 'center' }}
            onPress={() => setActiveTab('staff')}
          >
            <Text style={{ color: activeTab === 'staff' ? primaryColor : textSecondaryColor, fontWeight: '600', fontSize: moderateScale(15) }}>Staff</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, paddingVertical: moderateScale(8), borderBottomWidth: 2, borderBottomColor: activeTab === 'client' ? primaryColor : 'transparent', alignItems: 'center' }}
            onPress={() => setActiveTab('client')}
          >
            <Text style={{ color: activeTab === 'client' ? primaryColor : textSecondaryColor, fontWeight: '600', fontSize: moderateScale(15) }}>Client</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'staff' ? (
          <>
            {/* Search Organization */}
            {!selectedFacility ? (
              <View style={{ padding: moderateScale(16), paddingBottom: 0 }}>
                <Text style={{ fontSize: moderateScale(14), fontWeight: '500', color: textColor, marginBottom: moderateScale(8) }}>Organization (Optional)</Text>
                <Input
                  placeholder="Search for an organization..."
                  value={facilitySearchQuery}
                  onChangeText={setFacilitySearchQuery}
                />
              </View>
            ) : (
              <View style={{ padding: moderateScale(16), paddingBottom: 0 }}>
                <Text style={{ fontSize: moderateScale(14), fontWeight: '500', color: textSecondaryColor, marginBottom: moderateScale(4) }}>Selected Organization</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: primaryLightColor, padding: moderateScale(12), borderRadius: moderateScale(8) }}>
                  <Text style={{ flex: 1, color: primaryColor, fontWeight: '600' }}>{selectedFacility.facilityName}</Text>
                  <TouchableOpacity onPress={() => setSelectedFacility(null)}>
                    <Text style={{ color: primaryColor, fontWeight: 'bold' }}>Change</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Dynamic List: Either Facility Results or Staff */}
            {facilitySearchQuery.length > 3 && !selectedFacility ? (
              <View style={{ flex: 1, marginTop: moderateScale(16) }}>
                {loadingFacilities ? (
                  <ActivityIndicator size="large" color={primaryColor} />
                ) : (
                  <FlatList
                    data={facilities}
                    keyExtractor={(item) => item._id}
                    ListEmptyComponent={() => <Text style={{ textAlign: 'center', color: textSecondaryColor, marginTop: moderateScale(20) }}>No organizations found.</Text>}
                    renderItem={({ item: facility }) => (
                      <TouchableOpacity
                        style={{ padding: moderateScale(16), borderBottomWidth: 1, borderBottomColor: borderColor }}
                        onPress={() => {
                          setSelectedFacility(facility);
                          setFacilitySearchQuery('');
                        }}
                      >
                        <Text style={{ fontSize: moderateScale(16), color: textColor, fontWeight: '500' }}>{facility.facilityName}</Text>
                        <Text style={{ fontSize: moderateScale(13), color: textSecondaryColor }}>{facility.facilityType || 'Facility'}</Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            ) : (
              <>
                {/* Search Staff */}
                <View style={{ padding: moderateScale(16) }}>
                  <TopSearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    hideAskAI={true}
                  />
                </View>

                {/* List Staff */}
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
                        onPress={() => handleStartChat(staff, 'staff')}
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
                          {staff.facilityDetail?.facilityName && staff.facilityDetail._id !== user?.facilityDetail?._id && (
                            <Text style={{ fontSize: moderateScale(12), color: primaryColor, marginTop: moderateScale(2), fontWeight: '500' }}>
                              {staff.facilityDetail.facilityName}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </>
            )}
          </>
        ) : (
          <>
            {/* Search Clients */}
            <View style={{ padding: moderateScale(16) }}>
              <TopSearchBar
                searchQuery={clientSearchQuery}
                setSearchQuery={setClientSearchQuery}
                hideAskAI={true}
              />
            </View>

            {/* List Clients */}
            {clientSearchQuery.length <= 3 ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: moderateScale(32) }}>
                <Text style={{ color: textSecondaryColor, fontSize: moderateScale(14), textAlign: 'center' }}>
                  Please type at least 4 characters to search for a client/patient.
                </Text>
              </View>
            ) : loadingClients ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={primaryColor} />
                <Text style={{ marginTop: moderateScale(12), color: textSecondaryColor }}>Searching clients...</Text>
              </View>
            ) : (
              <FlatList
                data={clients}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ paddingBottom: insets.bottom + moderateScale(20) }}
                ListEmptyComponent={() => (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: moderateScale(40) }}>
                    <Text style={{ color: textSecondaryColor, fontSize: moderateScale(14) }}>No clients found matching "{clientSearchQuery}"</Text>
                  </View>
                )}
                renderItem={({ item: client }) => (
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', padding: moderateScale(16), borderBottomWidth: 1, borderBottomColor: borderColor }}
                    onPress={() => handleStartChat(client, 'client')}
                    disabled={startPersonalChat.isPending}
                  >
                    <ChatAvatar chat={{ avatarImg: client.imageurl || `https://ui-avatars.com/api/?name=${client.firstname}+${client.lastname}&background=random` }} />
                    <View style={{ marginLeft: moderateScale(12), flex: 1 }}>
                      <Text style={{ fontSize: moderateScale(16), fontWeight: '500', color: textColor }}>
                        {client.firstname} {client.lastname}
                      </Text>
                      <Text style={{ fontSize: moderateScale(13), color: textSecondaryColor, marginTop: moderateScale(4) }}>
                        {client.email || client.phone || 'Client'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </>
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
