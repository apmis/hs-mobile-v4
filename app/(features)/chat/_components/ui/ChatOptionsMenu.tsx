import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { moderateScale } from 'react-native-size-matters';
import { useThemeColor } from '@/app/shared/hooks/useThemeColor';

interface ChatOptionsMenuProps {
  onClearChat: () => void;
  onViewDetails?: () => void;
}

export function ChatOptionsMenu({ onClearChat, onViewDetails }: ChatOptionsMenuProps) {
  const [visible, setVisible] = useState(false);
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const cardColor = useThemeColor({}, 'card');

  return (
    <View>
      <TouchableOpacity
        style={{ padding: moderateScale(4), marginLeft: moderateScale(4) }}
        onPress={() => setVisible(true)}
      >
        <MoreVertical size={moderateScale(24)} color={textSecondaryColor} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.menuContainer, { backgroundColor: cardColor }]}>
                {onViewDetails && (
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      setVisible(false);
                      onViewDetails();
                    }}
                  >
                    <Text style={[styles.menuText, { color: textSecondaryColor }]}>View details</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setVisible(false);
                    Alert.alert(
                      "Clear Chat",
                      "Are you sure you want to clear this chat? This action cannot be undone.",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Clear",
                          style: "destructive",
                          onPress: () => onClearChat()
                        }
                      ]
                    );
                  }}
                >
                  <Text style={[styles.menuText, { color: '#EF4444' }]}>Clear chat</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
  },
  menuContainer: {
    position: 'absolute',
    top: moderateScale(50),
    right: moderateScale(16),
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(4),
    minWidth: moderateScale(140),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
  },
  menuText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  }
});
