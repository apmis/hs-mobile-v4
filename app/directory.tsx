import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, X } from 'lucide-react-native';
import { MessageText, Call } from 'iconsax-react-native';
import { Colors, Typography, Spacing } from './shared/constants/Theme';
import { useThemeColor } from './shared/hooks/useThemeColor';

const STAFF_LIST = [
  { id: 'staff-0', name: 'Dr. Sarah Jenkins', specialty: 'Cardiology', department: 'Cardiology', image: 'https://randomuser.me/api/portraits/women/44.jpg', isOnline: true },
  { id: 'staff-1', name: 'Marcus Chen, RN', specialty: 'Pediatrics', department: 'Nursing', image: 'https://randomuser.me/api/portraits/men/32.jpg', isOnline: true },
  { id: 'staff-2', name: 'Dr. Robert Miller', specialty: 'Orthopedics', department: 'Orthopedics', image: 'https://randomuser.me/api/portraits/men/46.jpg', isOnline: true },
  { id: 'staff-3', name: 'Dr. Emily Watson', specialty: 'Neurology', department: 'Neurology', image: 'https://randomuser.me/api/portraits/women/68.jpg', isOnline: false },
  { id: 'staff-4', name: 'David Kim, NP', specialty: 'Emergency Med.', department: 'Emergency', image: 'https://randomuser.me/api/portraits/men/22.jpg', isOnline: true },
  { id: 'staff-5', name: 'Dr. Amanda Thorne', specialty: 'General Surgery', department: 'Surgery', image: 'https://randomuser.me/api/portraits/women/33.jpg', isOnline: false },
  { id: 'staff-6', name: 'James Wilson, PT', specialty: 'Physical Therapy', department: 'Rehabilitation', image: 'https://randomuser.me/api/portraits/men/61.jpg', isOnline: true },
  { id: 'staff-7', name: 'Dr. Olivia Patel', specialty: 'Oncology', department: 'Oncology', image: 'https://randomuser.me/api/portraits/women/49.jpg', isOnline: false },
  { id: 'staff-8', name: 'Michael Chang, RT', specialty: 'Respiratory', department: 'Respiratory Therapy', image: 'https://randomuser.me/api/portraits/men/15.jpg', isOnline: true },
  { id: 'staff-9', name: 'Dr. Rachel Green', specialty: 'Anesthesiology', department: 'Anesthesiology', image: 'https://randomuser.me/api/portraits/women/24.jpg', isOnline: true },
];

export default function DirectoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStaff = STAFF_LIST.filter(staff =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor }]}>
      {/* Header */}
      <View style={[styles.headerContainer, { backgroundColor }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={moderateScale(24)} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Staff Directory</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: cardColor, borderColor }]}>
          <Search size={moderateScale(20)} color={textSecondaryColor} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search by name, specialty, or dept..."
            placeholderTextColor={textSecondaryColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={moderateScale(20)} color={textSecondaryColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + moderateScale(40) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultHeader}>
          <Text style={[styles.resultCount, { color: textSecondaryColor }]}>
            {filteredStaff.length} {filteredStaff.length === 1 ? 'member' : 'members'} found
          </Text>
        </View>

        {filteredStaff.map((staff, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.staffCard, { backgroundColor: cardColor, borderColor }]}
            activeOpacity={0.8}
            onPress={() => router.push({
              pathname: `/chat/${staff.id}`,
              params: { fallbackName: staff.name, fallbackAvatar: staff.image }
            })}
          >
            <View style={styles.staffMain}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: staff.image }} style={styles.avatarImg} />
                {staff.isOnline && <View style={[styles.onlineDot, { borderColor: cardColor }]} />}
              </View>

              <View style={styles.staffInfo}>
                <Text style={[styles.staffName, { color: textColor }]} numberOfLines={1}>{staff.name}</Text>
                <Text style={[styles.staffSpecialty, { color: textSecondaryColor }]}>{staff.specialty}</Text>
              </View>
            </View>

            <View style={[styles.actionsRow, { borderTopColor: borderColor }]}>
              <View style={[styles.departmentBadge, { backgroundColor: borderColor }]}>
                <Text style={[styles.departmentText, { color: textSecondaryColor }]}>{staff.department}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.iconCircle, { backgroundColor: borderColor }]}>
                  <Call size={moderateScale(18)} color={textSecondaryColor} variant="Bold" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconCircle, { backgroundColor: primaryColor + '20' }]}
                  onPress={() => router.push({
                    pathname: `/chat/${staff.id}`,
                    params: { fallbackName: staff.name, fallbackAvatar: staff.image }
                  })}
                >
                  <MessageText size={moderateScale(18)} color={primaryColor} variant="Bold" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredStaff.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: textSecondaryColor }]}>No staff members match your search.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
    marginRight: Spacing.sm,
  },
  headerTitle: {
    ...Typography.h2,
    fontSize: '20@ms',
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: '16@ms',
    paddingHorizontal: '16@ms',
    height: '48@vs',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: '12@s',
    fontSize: '15@ms',
    color: Colors.text,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
  },
  resultHeader: {
    marginBottom: '12@vs',
    paddingHorizontal: '4@s',
  },
  resultCount: {
    fontSize: '13@ms',
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  staffCard: {
    backgroundColor: Colors.white,
    borderRadius: '20@ms',
    padding: '16@ms',
    marginBottom: '16@vs',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  staffMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '16@vs',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: '16@s',
  },
  avatarImg: {
    width: '48@ms',
    height: '48@ms',
    borderRadius: '24@ms',
    backgroundColor: '#F3F4F6',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: '14@ms',
    height: '14@ms',
    borderRadius: '7@ms',
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: '16@ms',
    fontWeight: '700',
    color: Colors.text,
    marginBottom: '4@vs',
  },
  staffSpecialty: {
    fontSize: '13@ms',
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: '16@vs',
  },
  departmentBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: '12@s',
    paddingVertical: '6@vs',
    borderRadius: '12@ms',
  },
  departmentText: {
    color: '#4B5563',
    fontSize: '11@ms',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '12@s',
  },
  iconCircle: {
    width: '36@ms',
    height: '36@ms',
    borderRadius: '18@ms',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: '40@vs',
  },
  emptyText: {
    fontSize: '14@ms',
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
