import NoData from '@/components/shared/NoData';
import Pagination from '@/components/shared/Pagination';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { NotificationQuery } from '@/types/notification';
import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import useHandleNotificationClick from '../hooks/useHandleNotificationClick';
import useNotificationActions from '../hooks/useNotificationActions';
import useNotifications from '../hooks/useNotifications';
import NotificationFilters, { type TypeFilter } from './NotificationFilters';
import NotificationItem from './NotificationItem';

const PAGE_LIMIT = 10;

const NotificationContent = () => {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const query = useMemo<NotificationQuery>(
    () => ({
      page,
      limit: PAGE_LIMIT,
      ...(typeFilter !== 'ALL' && { tipe: typeFilter }),
      ...(unreadOnly && { isRead: false }),
    }),
    [page, typeFilter, unreadOnly],
  );

  const { items, totalUnread, pagination, isPending } = useNotifications(query);
  const { markAllRead, isMarkingAll, remove } = useNotificationActions();
  const handleClick = useHandleNotificationClick();

  const resetToFirstPage = () => setPage(1);

  return (
    <div className='flex grow flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-foreground/70'>
          {totalUnread > 0 ? (
            <>
              <span className='font-semibold text-primary'>{totalUnread}</span> notifikasi belum dibaca
            </>
          ) : (
            'Semua notifikasi sudah dibaca'
          )}
        </p>

        {totalUnread > 0 && (
          <Button variant='outline' size='sm' disabled={isMarkingAll} onClick={() => markAllRead()}>
            <Icon icon='mdi:check-all' width={16} />
            Tandai semua dibaca
          </Button>
        )}
      </div>

      <NotificationFilters
        activeType={typeFilter}
        onTypeChange={(type) => {
          setTypeFilter(type);
          resetToFirstPage();
        }}
        unreadOnly={unreadOnly}
        onUnreadOnlyChange={(value) => {
          setUnreadOnly(value);
          resetToFirstPage();
        }}
      />

      <div className='grow overflow-hidden rounded-lg border border-black/10'>
        {isPending ? (
          <div className='flex flex-col gap-2 p-3'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='h-16 w-full' />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className='flex h-full min-h-60 items-center justify-center'>
            <NoData message='Belum ada notifikasi' />
          </div>
        ) : (
          items.map((notification) => <NotificationItem key={notification.id} notification={notification} variant='full' onClick={handleClick} onDelete={remove} />)
        )}
      </div>

      {pagination && pagination.totalPages > 1 && <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />}
    </div>
  );
};

export default NotificationContent;
