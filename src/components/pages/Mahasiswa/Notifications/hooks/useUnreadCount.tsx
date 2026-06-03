import { getUnreadCount } from '@/api/notification';
import { useQuery } from '@tanstack/react-query';
import { notificationKeys } from './queryKeys';

const useUnreadCount = (enabled = true) => {
  const { data, isPending } = useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const res = await getUnreadCount();
      return res.data;
    },
    enabled,
    // refresh badge secara berkala selagi tab aktif
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
  });

  return { totalUnread: data?.totalUnread ?? 0, isPending };
};

export default useUnreadCount;
