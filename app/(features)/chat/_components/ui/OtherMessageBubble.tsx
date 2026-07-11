import React from 'react';
import { View, Text, Image } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { ChartSquare } from 'iconsax-react-native';
import Markdown from 'react-native-markdown-display';
import { Colors } from '@/app/shared/constants/Theme';

interface OtherMessageBubbleProps {
  msg: {
    id: string;
    text: string;
    sender: string;
    time: string;
    avatar?: any;
    attachmentName?: string;
  };
  variant: 'group' | 'consultation';
  cardColor: string;
  borderColor: string;
  textColor: string;
  textSecondaryColor: string;
}

export function OtherMessageBubble({
  msg,
  variant,
  cardColor,
  borderColor,
  textColor,
  textSecondaryColor,
}: OtherMessageBubbleProps) {
  const markdownStyles = {
    body: {
      color: textColor,
      fontSize: moderateScale(15),
      lineHeight: moderateScale(22),
    },
    paragraph: {
      marginTop: 0,
      marginBottom: moderateScale(2),
    },
    bullet_list: {
      marginTop: 0,
      marginBottom: moderateScale(4),
    },
    ordered_list: {
      marginTop: 0,
      marginBottom: moderateScale(4),
    },
    list_item: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: 0,
      marginBottom: moderateScale(2),
    },
    heading1: { marginTop: 0, marginBottom: moderateScale(4), fontSize: moderateScale(20) },
    heading2: { marginTop: 0, marginBottom: moderateScale(4), fontSize: moderateScale(18) },
    heading3: { marginTop: 0, marginBottom: moderateScale(4), fontSize: moderateScale(16) },
    heading4: { marginTop: 0, marginBottom: moderateScale(4), fontSize: moderateScale(15) },
    heading5: { marginTop: 0, marginBottom: moderateScale(4), fontSize: moderateScale(15) },
    heading6: { marginTop: 0, marginBottom: moderateScale(4), fontSize: moderateScale(15) },
  } as any;

  if (variant === 'consultation') {
    return (
      <View style={styles.messageGroupLeftConsult}>
        <View style={[styles.bubbleLeft, { backgroundColor: cardColor, borderColor }]}>
          <View style={styles.msgRow}>
            <View style={styles.messageTextLeft}>
              <Markdown style={markdownStyles}>
                {msg.text?.trim() || ""}
              </Markdown>
            </View>
            <Text style={[styles.timeLabelInner, { color: textSecondaryColor }]}>{msg.time}</Text>
          </View>
        </View>
      </View>
    );
  }

  // default 'group' variant
  return (
    <View style={styles.groupMessageRow}>
      <View style={styles.groupAvatarCol}>
        <Image
          source={typeof msg.avatar === 'string' ? { uri: msg.avatar } : msg.avatar || { uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
          style={styles.groupMessageAvatar}
        />
      </View>
      <View style={styles.groupMsgContentCol}>
        <View style={[styles.bubbleLeftGroup, { backgroundColor: cardColor, borderColor }]}>
          <Text style={styles.groupSenderName}>{msg.sender}</Text>
          <View style={styles.msgRow}>
            <View style={styles.messageTextLeft}>
              <Markdown style={markdownStyles}>
                {msg.text?.trim() || ""}
              </Markdown>
            </View>
            <Text style={[styles.timeLabelInner, { color: textSecondaryColor }]}>{msg.time}</Text>
          </View>
          {msg.attachmentName && (
            <View style={[styles.innerAttachmentBlock, { backgroundColor: borderColor }]}>
              <ChartSquare size={moderateScale(16)} color="#065F46" variant="Bold" />
              <Text style={styles.innerAttachmentText}>{msg.attachmentName}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = ScaledSheet.create({
  groupMessageRow: {
    flexDirection: 'row',
    marginBottom: moderateScale(16),
  },
  groupAvatarCol: {
    alignItems: 'center',
    marginRight: moderateScale(8),
  },
  groupMessageAvatar: {
    width: moderateScale(25),
    height: moderateScale(25),
    borderRadius: moderateScale(18),
  },
  groupMsgContentCol: {
    //flex: 1,
    maxWidth: '80%',
  },
  groupSenderName: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: '#0D9488', // Teal/Cyan color for sender name
    marginBottom: moderateScale(2),
  },
  bubbleLeftGroup: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(16),
    borderTopLeftRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    //alignSelf: 'flex-start',
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',



    //flexWrap: 'wrap',
  },
  timeLabelInner: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    marginLeft: moderateScale(8),
    marginBottom: moderateScale(-2),
    alignSelf: 'flex-end',
  },
  messageTextLeft: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22),

    flexShrink: 1,
  },
  innerAttachmentBlock: {
    marginTop: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(12),
  },
  innerAttachmentText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#065F46',
    marginLeft: moderateScale(8),
  },

  // Consultation Layout specific blocks
  messageGroupLeftConsult: {
    marginBottom: moderateScale(16),
    alignItems: 'flex-start',
    maxWidth: '70%',
  },
  bubbleLeft: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(16),
    borderTopLeftRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
  },
});
