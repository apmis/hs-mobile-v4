import React from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { queryClient } from '../api/queryClient';

const CHUNK_SIZE = 1000000; // ~1MB chunks to avoid Android's 2MB SQLite limit

const chunkedAsyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const metadataStr = await AsyncStorage.getItem(`${key}_meta`);
      if (!metadataStr) return await AsyncStorage.getItem(key);
      
      const metadata = JSON.parse(metadataStr);
      let fullString = '';
      for (let i = 0; i < metadata.chunks; i++) {
        const chunk = await AsyncStorage.getItem(`${key}_chunk_${i}`);
        if (chunk) fullString += chunk;
      }
      return fullString;
    } catch (e) {
      console.log('Error reading chunked storage', e);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (value.length <= CHUNK_SIZE) {
        await AsyncStorage.removeItem(`${key}_meta`);
        await AsyncStorage.setItem(key, value);
        return;
      }
      const numChunks = Math.ceil(value.length / CHUNK_SIZE);
      const chunkPromises = [];
      for (let i = 0; i < numChunks; i++) {
        const chunk = value.substring(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        chunkPromises.push(AsyncStorage.setItem(`${key}_chunk_${i}`, chunk));
      }
      await Promise.all(chunkPromises);
      await AsyncStorage.setItem(`${key}_meta`, JSON.stringify({ chunks: numChunks }));
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.log('Error writing chunked storage', e);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      const metadataStr = await AsyncStorage.getItem(`${key}_meta`);
      if (metadataStr) {
        const metadata = JSON.parse(metadataStr);
        const chunkPromises = [];
        for (let i = 0; i < metadata.chunks; i++) {
          chunkPromises.push(AsyncStorage.removeItem(`${key}_chunk_${i}`));
        }
        await Promise.all(chunkPromises);
        await AsyncStorage.removeItem(`${key}_meta`);
      }
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.log('Error removing chunked storage', e);
    }
  }
};

const asyncStoragePersister = createAsyncStoragePersister({
  storage: chunkedAsyncStorage,
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
