import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Colors, Spacing } from '@/app/shared/constants/Theme';
import { Bell, Camera, MoreVertical, Search, X } from 'lucide-react-native';
import { ArrowLeft } from 'iconsax-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LOCATIONS = ['HQ Hospital:Lagos', 'North Wing: Abuja', 'East Wing: Port Harcourt', 'Pediatrics Center: Kano', 'Emergency Bay: Ibadan'];
const DEFAULT_MORE_OPTIONS = ['Create', 'List', 'Find', 'View details', 'Edit', 'Delete'];

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showIcons?: boolean;
  searchQuery?: string;
  setSearchQuery?: (text: string) => void;
  showSearch?: boolean;
  showLocation?: boolean;
  showMoreOptions?: boolean;
  moreOptions?: string[];
  onOptionPress?: (option: string) => void;
}

export default function AppHeader({
  title = "HealthStack",
  showBack = false,
  showIcons = true,
  searchQuery,
  setSearchQuery,
  showSearch = true,
  showLocation = false,
  showMoreOptions = false,
  moreOptions = DEFAULT_MORE_OPTIONS,
  onOptionPress
}: AppHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);

  return (
    <View style={styles.mainHeader}>
      <View style={styles.headerTitleRow}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={moderateScale(24)} color={Colors.text} variant="Linear" />
            </TouchableOpacity>
          )}
          <View>
            <Text style={styles.mainHeaderTitle}>{title}</Text>
            {showLocation && (
              <Pressable onPress={() => setShowLocationSheet(true)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.locationText}>@{selectedLocation}</Text>
              </Pressable>
            )}
          </View>
        </View>

        {showIcons && (
          <View style={styles.headerRightIcons}>
            <TouchableOpacity style={styles.iconBtn}>
              <Bell size={moderateScale(24)} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Camera size={moderateScale(24)} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => showMoreOptions ? setShowMoreMenu(true) : null}>
              <MoreVertical size={moderateScale(24)} color="#1F2937" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {showSearch && setSearchQuery !== undefined && (
        <View style={styles.searchBarContainer}>
          <Search size={moderateScale(20)} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Ask Copilot"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== undefined && searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.closeSearchBtn}>
              <X size={moderateScale(20)} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Location Bottom Sheet */}
      <Modal
        visible={showLocationSheet}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLocationSheet(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowLocationSheet(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.bottomSheet}>
                <View style={styles.sheetIndicator} />
                <Text style={styles.sheetTitle}>Select Location</Text>

                {LOCATIONS.map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={[
                      styles.locationItem,
                      selectedLocation === loc && styles.locationItemActive
                    ]}
                    onPress={() => {
                      setSelectedLocation(loc);
                      setShowLocationSheet(false);
                    }}
                  >
                    <Text style={[
                      styles.locationItemText,
                      selectedLocation === loc && styles.locationItemTextActive
                    ]}>{loc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Dropdown Menu Modal */}
      <Modal
        visible={showMoreMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMoreMenu(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowMoreMenu(false)}>
          <View style={styles.dropdownOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.dropdownMenu, { top: insets.top + moderateScale(45) }]}>
                {moreOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownItem,
                      index !== moreOptions.length - 1 && styles.dropdownItemBorder
                    ]}
                    onPress={() => {
                      setShowMoreMenu(false);
                      if (onOptionPress) onOptionPress(option);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      (option === 'Delete' || option === 'Logout') && styles.dropdownItemTextDanger
                    ]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = ScaledSheet.create({
  mainHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    // backgroundColor: Colors.white,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateScale(16),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  mainHeaderTitle: {
    fontSize: moderateScale(20),
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
  },
  iconBtn: {
    padding: moderateScale(4),
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    height: moderateScale(48),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateScale(8),
    fontSize: moderateScale(14),
    color: Colors.text,
  },
  closeSearchBtn: {
    padding: moderateScale(4),
  },
  locationText: {
    fontSize: moderateScale(14),
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    paddingHorizontal: Spacing.md,
    paddingBottom: moderateScale(40),
    paddingTop: moderateScale(12),
  },
  sheetIndicator: {
    width: moderateScale(40),
    height: moderateScale(5),
    backgroundColor: '#E5E7EB',
    borderRadius: moderateScale(3),
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  sheetTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  locationItem: {
    paddingVertical: moderateScale(14),
    paddingHorizontal: Spacing.md,
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(8),
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  locationItemActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  locationItemText: {
    fontSize: moderateScale(15),
    fontWeight: '500',
    color: '#4B5563',
  },
  locationItemTextActive: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  dropdownOverlay: {
    flex: 1,
  },
  dropdownMenu: {
    position: 'absolute',
    right: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: moderateScale(12),
    width: moderateScale(160),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    zIndex: 100,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: moderateScale(12),
    paddingHorizontal: Spacing.md,
  },
  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: moderateScale(14),
    color: '#4B5563',
    fontWeight: '500',
  },
  dropdownItemTextDanger: {
    color: '#EF4444',
  },
});
