import type { NotificationType } from '@/types/notification';

type NotificationTypeMeta = {
  label: string;
  icon: string; // iconify id
  badgeVariant: 'default' | 'secondary' | 'success' | 'danger' | 'outline';
  iconClassName: string;
};

export const NOTIFICATION_TYPE_META: Record<NotificationType, NotificationTypeMeta> = {
  DEADLINE_SOON: {
    label: 'Tenggat Dekat',
    icon: 'mdi:clock-alert-outline',
    badgeVariant: 'secondary',
    iconClassName: 'text-amber-600 bg-amber-100',
  },
  NEW_ASSIGNMENT: {
    label: 'Tugas Baru',
    icon: 'fluent:clipboard-task-add-20-regular',
    badgeVariant: 'default',
    iconClassName: 'text-blue-700 bg-blue-100',
  },
  LATE_SUBMISSION: {
    label: 'Terlambat',
    icon: 'mdi:alert-circle-outline',
    badgeVariant: 'danger',
    iconClassName: 'text-red-600 bg-red-100',
  },
};

export const getNotificationMeta = (tipe: NotificationType): NotificationTypeMeta =>
  NOTIFICATION_TYPE_META[tipe] ?? {
    label: tipe,
    icon: 'mdi:bell-outline',
    badgeVariant: 'outline',
    iconClassName: 'text-foreground/70 bg-muted',
  };

/** Waktu relatif dalam Bahasa Indonesia, mis. "5 menit lalu". */
export const formatRelativeTime = (isoLike: string): string => {
  const date = new Date(isoLike);
  if (Number.isNaN(date.getTime())) return isoLike;

  const diffMs = date.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const abs = Math.abs(diffSec);

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
  ];

  if (abs < 60) return 'Baru saja';

  const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'auto' });
  for (const [unit, secondsInUnit] of units) {
    if (abs >= secondsInUnit) {
      return rtf.format(Math.round(diffSec / secondsInUnit), unit);
    }
  }
  return 'Baru saja';
};
