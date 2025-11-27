import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 menit
      gcTime: 10 * 60 * 1000, // 10 menit
      retry: (failureCount, error) => {
        if (error.message.includes('404') || error.message.includes('400')) {
          return false;
        }
        return failureCount < 3; // maksimal 3 kali retry
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      // sementara aja ini hehe nnti gnti pke sonner aja
      onError: () => {
        alert('Sebuah kesalahan terjadi');
      },
    },
  },
});
