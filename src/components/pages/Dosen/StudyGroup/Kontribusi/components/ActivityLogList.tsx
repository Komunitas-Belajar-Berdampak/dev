import { Badge } from '@/components/ui/badge';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemSeparator, ItemTitle } from '@/components/ui/item';
import type { StudyGroupMemberDetail } from '@/types/sg';

type AktivitasItem = StudyGroupMemberDetail['aktivitas'][number];

type ActivityLogListProps = {
  grouped: Array<[number, AktivitasItem[]]>;
  formatDateOnly: (value: number | string | Date) => string;
  formatTimeOnly: (value: number | string | Date) => string;
};

const ActivityLogList = ({ grouped, formatDateOnly, formatTimeOnly }: ActivityLogListProps) => {
  return (
    <>
      <p className='text-sm uppercase tracking-wider font-semibold text-primary'>Log Aktivitas</p>

      <div className='space-y-5'>
        {grouped.map(([dateKey, items]) => (
          <div key={dateKey} className='space-y-3'>
            <Badge variant='outline' className='px-3 py-1 text-xs font-semibold text-primary shadow-sm'>
              {formatDateOnly(dateKey)}
            </Badge>

            <ItemGroup className='rounded-lg border border-accent/70 bg-white shadow-sm'>
              {items.map((a, idx) => (
                <div key={`${a.thread}-${a.timestamp}-${idx}`}>
                  <Item size='sm' className='rounded-none border-none'>
                    <ItemContent>
                      <ItemHeader>
                        <ItemTitle className='text-primary'>{a.aktivitas}</ItemTitle>
                      </ItemHeader>
                      <ItemDescription className='text-xs text-accent'>{a.thread}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Badge className='shadow-sm' variant={a.kontribusi > 0 ? 'default' : a.kontribusi < 0 ? 'danger' : 'outline'}>
                        {a.kontribusi > 0 ? `+${a.kontribusi}` : a.kontribusi === 0 ? '0' : a.kontribusi} points
                      </Badge>
                      <Badge variant='outline' className='text-xs text-primary/80 font-semibold shadow-sm'>
                        {formatTimeOnly(a.timestamp)}
                      </Badge>
                    </ItemActions>
                  </Item>
                  {idx < items.length - 1 ? <ItemSeparator className='bg-accent/70' /> : null}
                </div>
              ))}
            </ItemGroup>
          </div>
        ))}
      </div>
    </>
  );
};

export default ActivityLogList;
