import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Sensible defaults for React Native applications
      retry: 2,
      staleTime: 1000 * 60 * 1, // 1 minute
      refetchOnWindowFocus: true, // will work well for web and app state changes if connected
      // refetchOnReconnect: true,
    },
    mutations: {
      retry: 1, // Optional: retry failed mutations once
    },
  },
});
