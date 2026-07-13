import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { CheckCheck, Check, Clock, AlertCircle } from 'lucide-react-native';
import { Colors } from '@/app/shared/constants/Theme';

interface MyMessageBubbleProps {
  msg: {
    id: string;
    text: string;
    sender: string;
    time: string;
    status?: string;
  };
  primaryColor: string;
  textSecondaryColor: string;
  isSelected?: boolean;
  onLongPress?: () => void;
  onPress?: () => void;
}

export function MyMessageBubble({ msg, primaryColor, textSecondaryColor, isSelected, onLongPress, onPress }: MyMessageBubbleProps) {
  return (
    <Pressable
      style={[
        styles.groupMessageRowRight,
        isSelected && {
          backgroundColor: primaryColor + '15',
          marginHorizontal: -moderateScale(16),
          paddingHorizontal: moderateScale(16)
        }
      ]}
      onLongPress={onLongPress}
      onPress={onPress}
      delayLongPress={300}
    >
      <View style={[styles.bubbleRightGroup, { backgroundColor: primaryColor }]}>
        <Text style={styles.messageTextRight}>
          {msg.text}
        </Text>
        <View style={styles.timeStatusContainerRight}>
          <Text style={styles.groupTimeLabelRight}>{msg.time}</Text>
          {msg.status === 'sending' ? (
            <Clock size={moderateScale(14)} color="rgba(255,255,255,0.7)" style={{ marginLeft: moderateScale(4) }} />
          ) : msg.status === 'sent' ? (
            <Check size={moderateScale(14)} color="rgba(255,255,255,0.7)" style={{ marginLeft: moderateScale(4) }} />
          ) : msg.status === 'failed' ? (
            <AlertCircle size={moderateScale(14)} color="#FF4D4D" style={{ marginLeft: moderateScale(4) }} />
          ) : (
            <CheckCheck size={moderateScale(14)} color={msg.status === 'read' ? "#53BDEB" : "rgba(255,255,255,0.7)"} style={{ marginLeft: moderateScale(4) }} />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = ScaledSheet.create({
  groupMessageRowRight: {
    flexDirection: 'row',
    marginBottom: moderateScale(4),
    paddingVertical: moderateScale(6),
    justifyContent: 'flex-end',
  },
  bubbleRightGroup: {
    maxWidth: '75%',
    minWidth: moderateScale(80),
    paddingHorizontal: moderateScale(12),
    paddingTop: moderateScale(8),
    paddingBottom: moderateScale(6),
    borderRadius: moderateScale(12),
    borderTopRightRadius: moderateScale(0),
  },
  messageTextRight: {
    fontSize: moderateScale(15),
    color: Colors.white,
    lineHeight: moderateScale(22),
  },
  timeStatusContainerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: moderateScale(2),
    marginLeft: moderateScale(10),
  },
  groupTimeLabelRight: {
    fontSize: moderateScale(10),
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '500',
  },
});
