import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

export function useChatDraft(chatId: string | undefined) {
  const [draft, setDraft] = useState('');

  // Load draft from storage when the chat opens
  useEffect(() => {
    if (!chatId) return;
    
    const loadDraft = async () => {
      try {
        const savedDraft = await AsyncStorage.getItem(`@chat_draft_${chatId}`);
        if (savedDraft) {
          setDraft(savedDraft);
        }
      } catch (error) {
        console.error('Error loading chat draft:', error);
      }
    };

    loadDraft();
  }, [chatId]);

  // Update state and save to storage
  const updateDraft = async (text: string) => {
    setDraft(text);
    
    if (!chatId) return;
    try {
      if (text.trim() === '') {
        await AsyncStorage.removeItem(`@chat_draft_${chatId}`);
      } else {
        await AsyncStorage.setItem(`@chat_draft_${chatId}`, text);
      }
    } catch (error) {
      console.error('Error saving chat draft:', error);
    }
  };

  // Clear draft entirely (useful after sending a message)
  const clearDraft = async () => {
    setDraft('');
    
    if (!chatId) return;
    try {
      await AsyncStorage.removeItem(`@chat_draft_${chatId}`);
    } catch (error) {
      console.error('Error clearing chat draft:', error);
    }
  };

  return {
    draft,
    setDraft: updateDraft,
    clearDraft,
  };
}

// Hook to get all drafts at once (useful for chat list)
export function useAllChatDrafts() {
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const loadDrafts = useCallback(async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const draftKeys = keys.filter(key => key.startsWith('@chat_draft_'));
      if (draftKeys.length === 0) {
        setDrafts({});
        return;
      }
      
      const pairs = await AsyncStorage.multiGet(draftKeys);
      const newDrafts: Record<string, string> = {};
      pairs.forEach(([key, value]) => {
        if (value) {
          const chatId = key.replace('@chat_draft_', '');
          newDrafts[chatId] = value;
        }
      });
      setDrafts(newDrafts);
    } catch (e) {
      console.error('Error loading all drafts:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDrafts();
    }, [loadDrafts])
  );

  return drafts;
}
