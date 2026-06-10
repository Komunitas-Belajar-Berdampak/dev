import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import NotificationItem from '@/components/pages/Mahasiswa/Notifications/components/NotificationItem';
import useHandleNotificationClick from '@/components/pages/Mahasiswa/Notifications/hooks/useHandleNotificationClick';
import useNotificationActions from '@/components/pages/Mahasiswa/Notifications/hooks/useNotificationActions';
import useNotifications from '@/components/pages/Mahasiswa/Notifications/hooks/useNotifications';
import useUnreadCount from '@/components/pages/Mahasiswa/Notifications/hooks/useUnreadCount';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const PREVIEW_LIMIT = 6;

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const { totalUnread } = useUnreadCount();
  // hanya fetch daftar saat panel dibuka
  const { items, isPending } = useNotifications({ page: 1, limit: PREVIEW_LIMIT }, open);
  const { markAllRead, isMarkingAll } = useNotificationActions();
  const handleClick = useHandleNotificationClick(() => setOpen(false));

  const badge = totalUnread > 99 ? '99+' : totalUnread;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='relative shadow-none' aria-label='Notifikasi'>
          <Icon icon='mdi:bell-outline' className='text-primary' width={20} />
          {totalUnread > 0 && (
            <span className='absolute -right-1.5 -top-1.5 flex min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-[18px] text-white'>{badge}</span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='center' className='w-80 p-0 sm:w-96'>
        <div className='flex items-center justify-between border-b border-black/5 px-3 py-2.5'>
          <p className='text-sm font-semibold text-foreground'>Notifikasi</p>
          {totalUnread > 0 && (
            <button type='button' disabled={isMarkingAll} onClick={() => markAllRead()} className='text-xs font-medium text-primary hover:underline disabled:opacity-60'>
              Tandai semua dibaca
            </button>
          )}
        </div>

        <div className='max-h-96 overflow-y-auto'>
          {isPending ? (
            <div className='flex flex-col gap-2 p-3'>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className='h-16 w-full' />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className='flex flex-col items-center justify-center gap-2 px-4 py-10 text-center'>
              <Icon icon='mdi:bell-sleep-outline' width={36} className='text-foreground/30' />
              <p className='text-sm text-foreground/60'>Belum ada notifikasi</p>
            </div>
          ) : (
            items.map((notification) => <NotificationItem key={notification.id} notification={notification} variant='compact' onClick={handleClick} />)
          )}
        </div>

        <div className='border-t border-black/5 p-2'>
          <Button asChild variant='ghost' className='w-full text-sm text-primary'>
            <Link to='/mahasiswa/notifications' onClick={() => setOpen(false)}>
              Lihat semua notifikasi
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
