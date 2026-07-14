import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeState {
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
}

// const getKeys = async () => {
//   const keys = await AsyncStorage.getAllKeys();
//   const values = await AsyncStorage.multiGet(keys);
//   console.log(values);
// };

// getKeys();

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themePreference: 'system',
      setThemePreference: (preference) => set({ themePreference: preference }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
