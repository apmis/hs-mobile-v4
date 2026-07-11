import React from 'react';
import { View, Text } from 'react-native';
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
}

export function MyMessageBubble({ msg, primaryColor, textSecondaryColor }: MyMessageBubbleProps) {
  return (
    <View style={styles.groupMessageRowRight}>
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
    </View>
  );
}

const styles = ScaledSheet.create({
  groupMessageRowRight: {
    flexDirection: 'row',
    marginBottom: moderateScale(16),
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
