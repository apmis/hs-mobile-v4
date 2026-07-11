import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedView } from '@/app/shared/components/ui/ThemedView';
import { ThemedText } from '@/app/shared/components/ui/ThemedText';
import { Spacing } from '@/app/shared/constants/Theme';
import { useThemeColor } from '@/app/shared/hooks/useThemeColor';
import { styles } from './style';

export default function ChatFilters({ activeFilter, setActiveFilter }: any) {
  const [filters, setFilters] = useState(['All', 'Direct', 'Group', 'Consultation', 'Internal', 'AI Assistant', 'Unread']);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [newFilterText, setNewFilterText] = useState('');

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <>
      {/* Filters Header */}
      <ThemedView style={[styles.filtersWrapper, { marginHorizontal: -Spacing.md }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          {filters.map((f, i) => {
            const isActive = activeFilter === f;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.filterPill, { backgroundColor: cardColor, borderColor }, isActive && [styles.filterPillActive, { backgroundColor: primaryColor, borderColor: primaryColor }]]}
                onPress={() => setActiveFilter?.(f)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, { color: textSecondaryColor }, isActive && styles.filterTextActive]}>{f}</Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[styles.filterPillAdd, { backgroundColor: cardColor, borderColor }]}
            onPress={() => setShowFilterModal(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterTextAdd, { color: textSecondaryColor }]}>+</Text>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>

      <Modal visible={showFilterModal} transparent animationType="fade">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ThemedView style={styles.filterModalContent} variant="card">
            <ThemedText type="h2" style={styles.filterModalTitle}>Add Custom Filter</ThemedText>
            <TextInput
              style={[styles.filterInput, { backgroundColor, borderColor, color: textColor }]}
              placeholder="e.g. ICU, Priority..."
              placeholderTextColor={textSecondaryColor}
              value={newFilterText}
              onChangeText={setNewFilterText}
              autoFocus
            />
            <View style={styles.filterModalActions}>
              <TouchableOpacity style={[styles.filterModalBtn, { backgroundColor: cardColor }]} onPress={() => {
                setShowFilterModal(false);
                setNewFilterText('');
              }}>
                <Text style={[styles.filterModalBtnText, { color: textSecondaryColor }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterModalBtn, { backgroundColor: primaryColor }]} onPress={() => {
                if (newFilterText.trim()) {
                  setFilters([...filters, newFilterText.trim()]);
                  setActiveFilter?.(newFilterText.trim());
                }
                setShowFilterModal(false);
                setNewFilterText('');
              }}>
                <Text style={styles.filterModalBtnTextPrimary}>Add Filter</Text>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
