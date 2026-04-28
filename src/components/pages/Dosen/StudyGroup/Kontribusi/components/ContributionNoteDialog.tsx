import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { StudyGroupMemberDetail } from '@/types/sg';

type AktivitasItem = StudyGroupMemberDetail['aktivitas'][number];

type ContributionNoteDialogProps = {
  activity: AktivitasItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formatTime: (value: number | string | Date) => string;
};

const getReviewStatus = (activity: AktivitasItem) => activity.statusReview ?? (activity.lecturerNote || activity.finalPoints != null || activity.kontribusi > 0 ? 'REVIEWED' : 'PENDING');

const ContributionNoteDialog = ({ activity, open, onOpenChange, formatTime }: ContributionNoteDialogProps) => {
  const status = activity ? getReviewStatus(activity) : 'PENDING';
  const isReviewed = status === 'REVIEWED';
  const finalPoints = activity?.finalPoints ?? activity?.kontribusi ?? 0;
  const lecturerNote = isReviewed ? activity?.lecturerNote || 'Catatan dosen belum tersedia untuk aktivitas ini.' : 'Catatan dosen belum tersedia karena kontribusi ini masih menunggu review.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg rounded-xl bg-white border-accent'>
        <DialogHeader className='gap-2'>
          <div className='flex flex-wrap items-center gap-2 pr-8'>
            <DialogTitle className='text-primary text-base font-bold md:text-lg'>Catatan Kontribusi</DialogTitle>
            <Badge variant={isReviewed ? 'success' : 'outline'} className='shadow-sm'>
              {isReviewed ? 'Reviewed' : 'Pending'}
            </Badge>
          </div>
          <p className='text-xs text-accent md:text-sm'>{activity?.thread ?? '-'}</p>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='rounded-xl border border-accent/70 bg-white p-4 shadow-sm'>
            <p className='text-xs font-semibold uppercase tracking-wider text-accent'>Aktivitas</p>
            <p className='mt-2 text-sm font-semibold text-primary'>{activity?.aktivitas ?? '-'}</p>
            <p className='mt-1 text-xs text-accent'>{activity ? formatTime(activity.timestamp) : '-'}</p>
          </div>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <div className='rounded-xl border border-accent/70 bg-white p-4 shadow-sm'>
              <p className='text-xs font-semibold uppercase tracking-wider text-accent'>Poin Final</p>
              <p className='mt-2 text-xl font-bold text-primary'>{isReviewed ? finalPoints : '-'}</p>
            </div>
            <div className='rounded-xl border border-accent/70 bg-white p-4 shadow-sm'>
              <p className='text-xs font-semibold uppercase tracking-wider text-accent'>Status</p>
              <p className='mt-2 text-sm font-semibold text-primary'>{isReviewed ? 'Sudah dinilai dosen' : 'Menunggu review dosen'}</p>
            </div>
          </div>

          <div className='rounded-xl border border-accent/70 bg-white p-4 shadow-sm'>
            <p className='text-xs font-semibold uppercase tracking-wider text-accent'>Catatan Dosen</p>
            <p className='mt-2 text-sm leading-relaxed text-primary'>{lecturerNote}</p>
          </div>
        </div>

        <DialogFooter>
          <Button type='button' variant='outline' className='border-accent text-primary' onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContributionNoteDialog;
