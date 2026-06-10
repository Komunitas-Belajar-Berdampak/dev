import { cn } from '@/lib/cn';
import type { NotificationType } from '@/types/notification';
import { Icon } from '@iconify/react';
import { NOTIFICATION_TYPE_META } from '../utils';

export type TypeFilter = NotificationType | 'ALL';

type NotificationFiltersProps = {
  activeType: TypeFilter;
  onTypeChange: (type: TypeFilter) => void;
  unreadOnly: boolean;
  onUnreadOnlyChange: (value: boolean) => void;
};

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: 'ALL', label: 'Semua' },
  { value: 'NEW_ASSIGNMENT', label: NOTIFICATION_TYPE_META.NEW_ASSIGNMENT.label },
  { value: 'DEADLINE_SOON', label: NOTIFICATION_TYPE_META.DEADLINE_SOON.label },
  { value: 'LATE_SUBMISSION', label: NOTIFICATION_TYPE_META.LATE_SUBMISSION.label },
];

const NotificationFilters = ({ activeType, onTypeChange, unreadOnly, onUnreadOnlyChange }: NotificationFiltersProps) => {
  return (
    <div className='flex flex-wrap items-center justify-between gap-3'>
      <div className='flex flex-wrap items-center gap-2'>
        {TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type='button'
            onClick={() => onTypeChange(option.value)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              activeType === option.value ? 'border-primary bg-primary text-primary-foreground' : 'border-black/10 text-foreground/70 hover:bg-muted',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button
        type='button'
        onClick={() => onUnreadOnlyChange(!unreadOnly)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
          unreadOnly ? 'border-primary bg-primary/10 text-primary' : 'border-black/10 text-foreground/70 hover:bg-muted',
        )}
      >
        <Icon icon={unreadOnly ? 'mdi:checkbox-marked-circle-outline' : 'mdi:circle-outline'} width={14} />
        Belum dibaca
      </button>
    </div>
  );
};

export default NotificationFilters;
