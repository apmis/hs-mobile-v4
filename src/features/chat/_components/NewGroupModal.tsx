import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/src/shared/hooks/useThemeColor';
import { styles } from './style';
import { useStaffs, useCreateChannel } from '../_api/chatCreation';
import Input from '@/src/shared/components/ui/Input';
import Button from '@/src/shared/components/ui/Button';
import TopSearchBar from '@/src/shared/components/TopSearchBar';

interface NewGroupModalProps {
  visible: boolean;
  onClose: () => void;
}

const CHANNEL_TYPES = ["Unit", "Location", "Client", "Global", "Department", "Organization"];

export default function NewGroupModal({ visible, onClose }: NewGroupModalProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');

  const [channelType, setChannelType] = useState('Unit');
  const [channelName, setChannelName] = useState('');
  const [channelDesc, setChannelDesc] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedStaffs, setSelectedStaffs] = useState<string[]>([]);

  // Data hooks
  const { data: staffs = [], isLoading: staffsLoading } = useStaffs();
  const createChannel = useCreateChannel();

  const toggleStaff = (staffId: string) => {
    if (selectedStaffs.includes(staffId)) {
      setSelectedStaffs(selectedStaffs.filter(id => id !== staffId));
    } else {
      setSelectedStaffs([...selectedStaffs, staffId]);
    }
  };

  const filteredStaffs = staffs.filter((staff: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = `${staff.firstname || ''} ${staff.lastname || ''}`.toLowerCase();
    const profession = (staff.profession || '').toLowerCase();
    return name.includes(q) || profession.includes(q);
  });

  const handleCreate = async () => {
    if (!channelName.trim()) {
      alert("Please provide a Channel Name");
      return;
    }

    try {
      const selectedStaffObjects = staffs.filter((s: any) => selectedStaffs.includes(s._id));

      const payload = {
        channel_type: channelType,
        channel_name: channelName,
        channel_description: channelDesc,
        staffs: selectedStaffObjects,
        clients: [] // Simplified for now
      };

      const chatRoom = await createChannel.mutateAsync(payload);
      onClose();
      router.push(`/chat/${chatRoom._id}`);
    } catch (error) {
      console.error('Failed to create channel:', error);
      alert("Failed to create channel");
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
          <Text style={{ fontSize: moderateScale(18), fontWeight: '600', color: textColor }}>Create Channel</Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: moderateScale(16), paddingBottom: insets.bottom + moderateScale(40) }}>

          <Text style={{ fontSize: moderateScale(14), fontWeight: '500', color: textColor, marginBottom: moderateScale(8) }}>Channel Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: moderateScale(16) }}>
            {CHANNEL_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setChannelType(type)}
                style={{
                  paddingHorizontal: moderateScale(16),
                  paddingVertical: moderateScale(8),
                  borderRadius: moderateScale(20),
                  backgroundColor: channelType === type ? primaryColor : 'transparent',
                  borderWidth: 1,
                  borderColor: channelType === type ? primaryColor : borderColor,
                  marginRight: moderateScale(8)
                }}
              >
                <Text style={{ color: channelType === type ? '#fff' : textColor, fontWeight: '500' }}>{type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Input
            label="Channel Name"
            placeholder="e.g. General Announcements"
            value={channelName}
            onChangeText={setChannelName}
            containerStyle={{ marginBottom: moderateScale(16) }}
          />

          <Input
            label="Channel Description"
            placeholder="e.g. A place for all updates"
            value={channelDesc}
            onChangeText={setChannelDesc}
            containerStyle={{ marginBottom: moderateScale(24) }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: moderateScale(12) }}>
            <Text style={{ fontSize: moderateScale(14), fontWeight: '500', color: textColor }}>Select Staff Members</Text>
          </View>

          <View style={{ marginBottom: moderateScale(16) }}>
            <TopSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              hideAskAI={true}
            />
          </View>
          {staffsLoading ? (
            <ActivityIndicator size="small" color={primaryColor} />
          ) : (
            <View style={{ marginBottom: moderateScale(24) }}>
              {filteredStaffs.map((staff: any) => {
                const isSelected = selectedStaffs.includes(staff._id);
                return (
                  <TouchableOpacity
                    key={staff._id}
                    onPress={() => toggleStaff(staff._id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: moderateScale(12),
                      borderBottomWidth: 1,
                      borderBottomColor: borderColor
                    }}
                  >
                    <View style={{
                      width: moderateScale(24),
                      height: moderateScale(24),
                      borderRadius: moderateScale(12),
                      borderWidth: 1,
                      borderColor: isSelected ? primaryColor : borderColor,
                      backgroundColor: isSelected ? primaryColor : 'transparent',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: moderateScale(12)
                    }}>
                      {isSelected && <Check size={moderateScale(14)} color="#fff" />}
                    </View>
                    <View>
                      <Text style={{ fontSize: moderateScale(16), color: textColor, fontWeight: '500' }}>
                        {staff.firstname} {staff.lastname}
                      </Text>
                      <Text style={{ fontSize: moderateScale(13), color: textSecondaryColor }}>
                        {staff.profession || 'Staff'} {staff.department ? `- ${staff.department}` : ''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <Button
            title="Create Channel"
            onPress={handleCreate}
            disabled={createChannel.isPending || channelName.trim() === ''}
            loading={createChannel.isPending}
            style={{ marginTop: moderateScale(16) }}
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
