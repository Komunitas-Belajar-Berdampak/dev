import { getNotifications } from '@/api/notification';
import type { NotificationQuery } from '@/types/notification';
import { useQuery } from '@tanstack/react-query';
import { notificationKeys } from './queryKeys';

const useNotifications = (query: NotificationQuery = {}, enabled = true) => {
  const { data, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: notificationKeys.list(query),
    queryFn: async () => {
      const res = await getNotifications(query);
      return res.data;
    },
    enabled,
  });

  return {
    items: data?.items ?? [],
    totalUnread: data?.totalUnread ?? 0,
    pagination: data?.pagination,
    isPending,
    isFetching,
    isError,
    refetch,
  };
};

export default useNotifications;
