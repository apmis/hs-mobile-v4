import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
//import { feathersClient } from './feathers';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import feathersClient from './feathers';

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

export const useUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      try {
        // Attempt to re-authenticate using the stored token
        const response = await feathersClient.reAuthenticate();

        const currentEmployee = {
          ...response.user.employeeData?.[0] || null,
        };
        return currentEmployee;
      } catch (error: any) {
        // If not authenticated (no token or expired), just return null 
        // instead of throwing an error so the UI can gracefully show the login screen.
        if (error.name === 'NotAuthenticated' || error.code === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false, // Don't retry auth checks if they fail
    staleTime: Infinity, // Keep the session valid in cache indefinitely until mutated
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // credentials typically look like: { strategy: 'local', email: '...', password: '...' }
    mutationFn: async (credentials: Record<string, any>) => {
      //console.log("LOGIN CREDENTIALS:", credentials);
      try {
        const response = await feathersClient.authenticate(credentials);
        return response;
      } catch (err: any) {
        console.log("ERROR:", err);
        throw err;
      }
    },
    onSuccess: (data) => {
      // Optimistically update the cache so `useUser()` instantly has the user
      const currentEmployee = {
        ...data.user.employeeData?.[0] || null,
      }
      //queryClient.setQueryData(authKeys.user(), data.user);
      queryClient.setQueryData(authKeys.user(), currentEmployee);
      console.log('user data: ', currentEmployee);

      Toast.show({
        type: 'success',
        text1: 'Welcome Back',
        text2: 'You have successfully logged in.',
      });

      // Automatically redirect to the dashboard/tabs
      router.replace('/(tabs)');
    },
    onError: (error: any) => {
      console.error("FULL STACK:", error, error.stack);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message || 'Please check your credentials and try again.',
      });
    }
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await feathersClient.logout();

      // Cleanup AsyncStorage just to be absolutely certain
      await AsyncStorage.removeItem('feathers-jwt');
      await AsyncStorage.removeItem('user');
    },
    onSuccess: () => {
      // 🚨 CRITICAL: Clear the entire React Query cache so no sensitive data is left behind!
      queryClient.clear();

      Toast.show({
        type: 'info',
        text1: 'Logged Out',
        text2: 'You have been securely logged out.',
      });

      // Redirect back to the login screen
      router.replace('/(auth)/login');
    },
    onError: () => {
      // Even if server logout fails, we should still clear local state
      queryClient.clear();
      AsyncStorage.removeItem('feathers-jwt');
      router.replace('/(auth)/login');
    }
  });
};
