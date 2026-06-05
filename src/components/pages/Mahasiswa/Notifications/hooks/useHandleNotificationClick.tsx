import type { Notification } from '@/types/notification';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useNotificationActions from './useNotificationActions';

/**
 * Mengembalikan handler klik notifikasi: menandai dibaca (jika belum) lalu
 * mengarahkan ke `link` notifikasi bila tersedia.
 */
const useHandleNotificationClick = (onBeforeNavigate?: () => void) => {
  const navigate = useNavigate();
  const { markRead } = useNotificationActions();

  return useCallback(
    (notification: Notification) => {
      if (!notification.isRead) {
        markRead(notification.id);
      }

      if (notification.link) {
        onBeforeNavigate?.();
        // dukung link absolut (http) maupun relatif (internal router)
        if (/^https?:\/\//i.test(notification.link)) {
          window.location.assign(notification.link);
        } else {
          // link dari BE relatif tanpa prefix role, mis.
          // "courses/:id/meeting/:id/submission/:id" → "/mahasiswa/courses/..."
          const path = notification.link.replace(/^\/+/, '');
          const target = path.startsWith('mahasiswa/') ? `/${path}` : `/mahasiswa/${path}`;
          navigate(target);
        }
      }
    },
    [markRead, navigate, onBeforeNavigate],
  );
};

export default useHandleNotificationClick;
