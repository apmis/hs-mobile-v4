import React from 'react';
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { DocumentDownload } from 'iconsax-react-native';

interface FileMessageBubbleProps {
  msg: {
    id: string;
    time: string;
    file: {
      name: string;
      size: string;
    };
  };
  primaryColor: string;
  cardColor: string;
  borderColor: string;
  textColor: string;
  textSecondaryColor: string;
  isSelected?: boolean;
  onLongPress?: () => void;
  onPress?: () => void;
}

export function FileMessageBubble({
  msg,
  primaryColor,
  cardColor,
  borderColor,
  textColor,
  textSecondaryColor,
  isSelected,
  onLongPress,
  onPress
}: FileMessageBubbleProps) {
  return (
    <Pressable 
      style={[
        styles.messageGroupLeftConsult, 
        isSelected && { 
          opacity: 0.7,
          marginHorizontal: -moderateScale(16),
          paddingHorizontal: moderateScale(16)
        }
      ]}
      onLongPress={onLongPress}
      onPress={onPress}
      delayLongPress={300}
    >
      <View style={[styles.fileAttachmentBorder, { backgroundColor: cardColor, borderColor }]}>
        <View style={styles.fileAttachmentCard}>
          <View style={[styles.fileIconBox, { backgroundColor: primaryColor + '20' }]}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/337/337946.png' }}
              style={styles.pdfIcon}
            />
          </View>
          <View style={styles.fileInfo}>
            <Text style={[styles.fileName, { color: textColor }]}>{msg.file.name}</Text>
            <Text style={[styles.fileSize, { color: textSecondaryColor }]}>{msg.file.size}</Text>
          </View>
          <TouchableOpacity style={[styles.downloadBtn, { borderColor }]}>
            <DocumentDownload size={moderateScale(20)} color={primaryColor} variant="Outline" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[styles.timeLabel, { marginTop: moderateScale(4), color: textSecondaryColor }]}>
        {msg.time}
      </Text>
    </Pressable>
  );
}

const styles = ScaledSheet.create({
  messageGroupLeftConsult: {
    marginBottom: moderateScale(4),
    paddingVertical: moderateScale(6),
    alignItems: 'flex-start',
    maxWidth: '85%',
  },
  fileAttachmentBorder: {
    borderRadius: moderateScale(16),
    padding: moderateScale(2),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  fileAttachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
    borderRadius: moderateScale(14),
  },
  fileIconBox: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  pdfIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
    resizeMode: 'contain',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    marginBottom: moderateScale(2),
  },
  fileSize: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  downloadBtn: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: moderateScale(10),
  },
  timeLabel: {
    fontSize: moderateScale(11),
    fontWeight: '500',
  },
});
