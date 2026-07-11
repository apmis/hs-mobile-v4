import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import feathersClient, { setAuthInitialized } from './feathers';

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

export const useUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      try {
        //console.log("[useUser] Fetching token from AsyncStorage...");
        const token = await AsyncStorage.getItem('feathers-jwt');
        if (!token) {
          console.log("[useUser] No token found in AsyncStorage! Returning null.");
          setAuthInitialized(true);
          return null;
        }

        //console.log("[useUser] Token found. Calling authenticate explicitly with JWT...");
        const response = await feathersClient.authenticate({
          strategy: 'jwt',
          accessToken: token
        });
        //console.log("[useUser] authenticate SUCCESS.");
        console.log(response.user, "AUTH RESPONSE");

        const currentEmployee = {
          ...response.user.employeeData?.[0] || null,

        };

        // Cache the user for offline/timeout scenarios
        await AsyncStorage.setItem('cached-user', JSON.stringify(currentEmployee));

        setAuthInitialized(true);
        return currentEmployee;
      } catch (error: any) {
        // console.log("[useUser] Error during reAuthenticate:");
        // console.log("  - Name:", error.name);
        // console.log("  - Message:", error.message);
        // console.log("  - Code:", error.code);

        if (error.name === 'NotAuthenticated' || error.code === 401) {
          //console.log("[useUser] Caught 401. Removing token and returning null.");
          // Token expired or invalid
          await AsyncStorage.removeItem('feathers-jwt');
          await AsyncStorage.removeItem('cached-user');
          setAuthInitialized(true);
          return null;
        }

        // It's a network/timeout error! Let's not force the user to login again.
        // Instead, try to return the cached user so they stay logged in while offline.
        try {
          const cachedUserStr = await AsyncStorage.getItem('cached-user');
          if (cachedUserStr) {
            setAuthInitialized(true);
            return JSON.parse(cachedUserStr);
          }
        } catch (e) {
          console.log("Failed to parse cached user");
        }

        // If we can't find a cached user (e.g. first login before we added caching), 
        // return a minimal dummy user so AuthGuard doesn't log them out while the backend wakes up.
        setAuthInitialized(true);
        return { id: "pending_network", _isOffline: true };
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
      try {
        const response = await feathersClient.authenticate(credentials);

        // Manually save the token to guarantee it's stored instantly
        if (response.accessToken) {
          await AsyncStorage.setItem('feathers-jwt', response.accessToken);
        }

        return response;
      } catch (err: any) {
        console.log("ERROR:", err);
        throw err;
      }
    },
    onSuccess: async (data) => {
      const currentEmployee = {
        ...data.user?.employeeData?.[0] || null,
      }

      // Cache the user for future offline/timeout scenarios
      await AsyncStorage.setItem('cached-user', JSON.stringify(currentEmployee));

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
      AsyncStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');

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
      AsyncStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
      AsyncStorage.removeItem('feathers-jwt');
      router.replace('/(auth)/login');
    }
  });
};
