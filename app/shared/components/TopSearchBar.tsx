import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Search, X, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '../hooks/useThemeColor';

interface TopSearchBarProps {
  searchQuery?: string;
  setSearchQuery?: (text: string) => void;
  hideAskAI?: boolean;
}

export default function TopSearchBar({ searchQuery, setSearchQuery, hideAskAI }: TopSearchBarProps) {
  const router = useRouter();

  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');

  if (searchQuery === undefined || setSearchQuery === undefined) return null;

  return (
    <View style={[styles.searchBarContainer, { backgroundColor: cardColor, borderColor }]}>
      <Search size={moderateScale(20)} color={textSecondaryColor} />
      <TextInput
        style={[styles.searchInput, { color: textColor }]}
        placeholder={hideAskAI ? "Search" : "Ask Copilot or Search"}
        placeholderTextColor={textSecondaryColor}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery.length > 0 && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(8) }}>
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.closeSearchBtn}>
            <X size={moderateScale(20)} color={textSecondaryColor} />
          </TouchableOpacity>
          {!hideAskAI && (
            <TouchableOpacity
              style={styles.askPillBtn}
              onPress={() => {
                router.push(`/chat/copilot?initialQuery=${encodeURIComponent(searchQuery)}`);
              }}
            >
              <Sparkles size={moderateScale(14)} color="#D8B4FE" />
              <Text style={styles.askPillText}>Ask</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = ScaledSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    height: moderateScale(48),
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateScale(8),
    fontSize: moderateScale(14),
  },
  closeSearchBtn: {
    padding: moderateScale(4),
  },
  askPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(16),
    gap: moderateScale(4),
  },
  askPillText: {
    color: '#FFFFFF',
    fontSize: moderateScale(13),
    fontWeight: '600',
  },
});
