import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { People } from 'iconsax-react-native';
import { User } from 'lucide-react-native';
import { useThemeColor } from '@/app/shared/hooks/useThemeColor';
import { styles } from '../style';

export const ChatAvatar = ({ chat }: { chat: any }) => {
  const [hasError, setHasError] = useState(false);
  const borderColor = useThemeColor({}, 'border');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');

  if (!chat.avatarImg || hasError) {
    return (
      <View style={styles.avatarWrapper}>
        <View style={[styles.avatarIconBox, { backgroundColor: borderColor }]}>
          {chat.iconType === 'group' ? (
            <People size={moderateScale(24)} color={textSecondaryColor} variant="Bold" />
          ) : (
            <User size={moderateScale(24)} color={textSecondaryColor} />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.avatarWrapper}>
      <Image
        source={typeof chat.avatarImg === 'string' ? { uri: chat.avatarImg } : chat.avatarImg}
        style={styles.avatarImage}
        onError={() => setHasError(true)}
      />
    </View>
  );
};

export const SmallAvatar = ({ uri, idx }: { uri: string | null, idx: number }) => {
  const [hasError, setHasError] = useState(false);
  const borderColor = useThemeColor({}, 'border');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');

  const iconStyle: any = [
    styles.smallAvatar,
    { marginLeft: idx > 0 ? -moderateScale(8) : moderateScale(0) }
  ];

  if (!uri || hasError) {
    return (
      <View style={[iconStyle, { backgroundColor: borderColor, justifyContent: 'center', alignItems: 'center' }]}>
        <User size={moderateScale(12)} color={textSecondaryColor} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={iconStyle}
      onError={() => setHasError(true)}
    />
  );
};
