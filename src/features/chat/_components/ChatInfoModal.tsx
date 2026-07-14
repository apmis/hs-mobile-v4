import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Dimensions, FlatList, Image } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, User, Mail, Phone, Briefcase } from 'lucide-react-native';
import { People } from 'iconsax-react-native';
import { useThemeColor } from '@/src/shared/hooks/useThemeColor';
import { ChatAvatar } from './ui/ChatAvatar';

const { width } = Dimensions.get('window');

interface ChatInfoModalProps {
  visible: boolean;
  onClose: () => void;
  apiRoom: any;
  user: any;
  chatName: string;
  chatAvatar?: string;
  isGroup: boolean;
}

export function ChatInfoModal({ visible, onClose, apiRoom, user, chatName, chatAvatar, isGroup }: ChatInfoModalProps) {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');

  const [imgError, setImgError] = useState(false);

  const slideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Determine chat partner for 1-on-1
  const chatPartner = !isGroup ? apiRoom?.members?.find((m: any) => m._id !== user?._id) : null;
  const members = apiRoom?.members || [];

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose} animationType="none">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', flexDirection: 'row', justifyContent: 'flex-end', }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1} />

        <Animated.View style={{
          width: width * 0.85,
          backgroundColor,
          transform: [{ translateX: slideAnim }],
          shadowColor: '#000',
          shadowOffset: { width: -2, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5
        }}>
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(12), borderBottomWidth: 1, borderBottomColor: borderColor }}>
              <TouchableOpacity onPress={onClose} style={{ padding: moderateScale(4), marginRight: moderateScale(12) }}>
                <ArrowLeft size={moderateScale(24)} color={textColor} />
              </TouchableOpacity>
              <Text style={{ fontSize: moderateScale(18), fontWeight: '600', color: textColor }}>
                {isGroup ? 'Group Info' : 'Contact Info'}
              </Text>
            </View>

            {/* Profile Info Section */}
            <View style={{ alignItems: 'center', paddingVertical: moderateScale(24), borderBottomWidth: 1, borderBottomColor: borderColor, backgroundColor: cardColor }}>
              {chatAvatar && !imgError ? (
                <Image 
                  source={{ uri: chatAvatar }} 
                  style={{ width: moderateScale(100), height: moderateScale(100), borderRadius: moderateScale(50), marginBottom: moderateScale(16) }} 
                  onError={() => setImgError(true)}
                />
              ) : (
                <View style={{ width: moderateScale(100), height: moderateScale(100), borderRadius: moderateScale(50), backgroundColor: borderColor, justifyContent: 'center', alignItems: 'center', marginBottom: moderateScale(16) }}>
                  {isGroup ? (
                    <People size={moderateScale(40)} color={textSecondaryColor} variant="Bold" />
                  ) : (
                    <User size={moderateScale(40)} color={textSecondaryColor} />
                  )}
                </View>
              )}

              <Text style={{ fontSize: moderateScale(22), fontWeight: '700', color: textColor, textAlign: 'center', paddingHorizontal: moderateScale(16) }}>
                {chatName}
              </Text>

              {!isGroup && chatPartner?.profession && (
                <Text style={{ fontSize: moderateScale(14), color: textSecondaryColor, marginTop: moderateScale(4) }}>
                  {chatPartner.profession} {chatPartner.department ? `- ${chatPartner.department}` : ''}
                </Text>
              )}

              {isGroup && apiRoom?.description && (
                <Text style={{ fontSize: moderateScale(14), color: textSecondaryColor, marginTop: moderateScale(8), textAlign: 'center', paddingHorizontal: moderateScale(16) }}>
                  {apiRoom.description}
                </Text>
              )}
            </View>

            {/* Details Section */}
            {!isGroup && chatPartner ? (
              <View style={{ padding: moderateScale(16) }}>
                {chatPartner.email && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: moderateScale(12) }}>
                    <Mail size={moderateScale(20)} color={primaryColor} />
                    <View style={{ marginLeft: moderateScale(16) }}>
                      <Text style={{ color: textSecondaryColor, fontSize: moderateScale(12) }}>Email</Text>
                      <Text style={{ color: textColor, fontSize: moderateScale(14), marginTop: moderateScale(2) }}>{chatPartner.email}</Text>
                    </View>
                  </View>
                )}
                {chatPartner.phone && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: moderateScale(12) }}>
                    <Phone size={moderateScale(20)} color={primaryColor} />
                    <View style={{ marginLeft: moderateScale(16) }}>
                      <Text style={{ color: textSecondaryColor, fontSize: moderateScale(12) }}>Phone</Text>
                      <Text style={{ color: textColor, fontSize: moderateScale(14), marginTop: moderateScale(2) }}>{chatPartner.phone}</Text>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <View style={{ padding: moderateScale(16), backgroundColor }}>
                  <Text style={{ color: primaryColor, fontWeight: '600', fontSize: moderateScale(14) }}>
                    {members.length} Members
                  </Text>
                </View>
                <FlatList
                  data={members}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => {
                    const memberName = item.firstname ? `${item.firstname} ${item.lastname}` : item.name;
                    const fallbackImg = memberName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(memberName)}&background=random` : null;
                    return (
                      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(12), borderBottomWidth: 1, borderBottomColor: borderColor }}>
                        <ChatAvatar chat={{ avatarImg: item.imageurl || fallbackImg }} />
                        <View style={{ marginLeft: moderateScale(12), flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{ fontSize: moderateScale(16), fontWeight: '500', color: textColor }}>
                            {item._id === user?._id ? 'You' : `${item.firstname || ''} ${item.lastname || item.name || ''}`}
                          </Text>
                          {isGroup && item._id === members[0]?._id && (
                            <View style={{ backgroundColor: primaryColor + '20', paddingHorizontal: moderateScale(6), paddingVertical: moderateScale(2), borderRadius: moderateScale(4), marginLeft: moderateScale(8) }}>
                              <Text style={{ color: primaryColor, fontSize: moderateScale(10), fontWeight: '600' }}>Group Admin</Text>
                            </View>
                          )}
                        </View>
                        {(item.profession || item.department) && (
                          <Text style={{ fontSize: moderateScale(13), color: textSecondaryColor, marginTop: moderateScale(2) }}>
                            {item.profession || 'Member'} {item.department ? `- ${item.department}` : ''}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                }}
                />
              </View>
            )}

          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}
