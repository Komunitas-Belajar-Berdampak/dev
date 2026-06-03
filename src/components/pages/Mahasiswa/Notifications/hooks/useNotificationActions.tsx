import { deleteNotification, markAllNotificationsRead, markNotificationRead } from '@/api/notification';
import { getApiErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notificationKeys } from './queryKeys';

const useNotificationActions = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: notificationKeys.all });
  };

  const { mutate: markRead, isPending: isMarkingRead } = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: invalidate,
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Gagal menandai notifikasi.'));
    },
  });

  const { mutate: markAllRead, isPending: isMarkingAll } = useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: (res) => {
      toast.success(res?.message ?? 'Semua notifikasi ditandai dibaca!');
      invalidate();
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Gagal menandai semua notifikasi.'));
    },
  });

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: (res) => {
      toast.success(res?.message ?? 'Notifikasi dihapus!');
      invalidate();
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Gagal menghapus notifikasi.'));
    },
  });

  return { markRead, isMarkingRead, markAllRead, isMarkingAll, remove, isDeleting };
};

export default useNotificationActions;
