import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, CloseCircle, CloseSquare, } from 'iconsax-react-native';
import { useRouter } from 'expo-router';

import { useThemeColor } from '@/app/shared/hooks/useThemeColor';
import { styles } from '../style/chatDetailStyles';
import { Copy, Edit, Edit2Icon, Trash2, X } from 'lucide-react-native';

interface ChatHeaderProps {
  onBack?: () => void;
  onPressCenter?: () => void;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  avatarElement?: React.ReactNode;
  rightAccessory?: React.ReactNode;
  disableCenterPress?: boolean;
  selectedMessageCount?: number;
  onClearSelection?: () => void;
  onCopyAction?: () => void;
  onEditAction?: () => void;
  onDeleteAction?: () => void;
}

export function ChatHeader({
  onBack,
  onPressCenter,
  title,
  subtitle,
  avatarElement,
  rightAccessory,
  disableCenterPress,
  selectedMessageCount = 0,
  onClearSelection,
  onCopyAction,
  onEditAction,
  onDeleteAction
}: ChatHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  if (selectedMessageCount > 0) {
    return (
      <View style={[styles.headerContainer, { paddingTop: insets.top + moderateScale(10), backgroundColor: primaryColor + '10', borderBottomColor: borderColor }]}>
        <TouchableOpacity style={styles.iconButtonLeft} onPress={onClearSelection}>
          <X size={moderateScale(24)} color={textColor} />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: moderateScale(12) }}>
          <Text style={[styles.headerTitle, { color: textColor, fontSize: moderateScale(18) }]}>
            {selectedMessageCount} selected
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ padding: moderateScale(8) }} onPress={onCopyAction}>
            <Copy size={moderateScale(22)} color={textColor} />
          </TouchableOpacity>

          {selectedMessageCount === 1 && (
            <TouchableOpacity style={{ padding: moderateScale(8) }} onPress={onEditAction}>
              <Edit2Icon size={moderateScale(22)} color={textColor} />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={{ padding: moderateScale(8) }} onPress={onDeleteAction}>
            <Trash2 size={moderateScale(22)} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const CenterComponent = disableCenterPress ? View : TouchableOpacity;

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + moderateScale(10), backgroundColor: cardColor, borderBottomColor: borderColor }]}>
      <TouchableOpacity style={styles.iconButtonLeft} onPress={handleBack}>
        <ArrowLeft size={moderateScale(24)} color={textColor} variant="Linear" />
      </TouchableOpacity>

      <CenterComponent
        style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
        onPress={disableCenterPress ? undefined : onPressCenter}
        activeOpacity={disableCenterPress ? 1 : 0.2}
      >
        {avatarElement && (
          <View style={styles.avatarContainer}>
            {avatarElement}
          </View>
        )}

        <View style={styles.headerTitleContainer}>
          {typeof title === 'string' ? (
            <Text style={[styles.headerTitle, { color: primaryColor }]} numberOfLines={1}>{title}</Text>
          ) : (
            title
          )}

          {subtitle && (
            typeof subtitle === 'string' ? (
              <Text style={[styles.headerSubtitleGroup, { color: textSecondaryColor }]}>{subtitle}</Text>
            ) : (
              subtitle
            )
          )}
        </View>
      </CenterComponent>

      {rightAccessory && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {rightAccessory}
        </View>
      )}
    </View>
  );
}
