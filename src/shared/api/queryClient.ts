import { QueryClient } from '@tanstack/react-query';


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Sensible defaults for React Native applications
      retry: 2,
      staleTime: 1000 * 60 * 1, // 1 minute
      gcTime: 1000 * 60 * 60 * 24, // 24 hours (keep cache in memory for a day to allow disk persistence)
      refetchOnWindowFocus: true, // will work well for web and app state changes if connected
      // refetchOnReconnect: true,
    },
    mutations: {
      retry: 1, // Optional: retry failed mutations once
    },
  },
});
