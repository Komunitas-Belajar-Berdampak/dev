import TiptapReadonlyContent from '@/components/shared/TiptapReadonlyContent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ContributionReview } from '@/types/contribution-review';
import { Sparkles } from 'lucide-react';

type ContributionReviewDialogProps = {
  review: ContributionReview | null;
  finalPoints: string;
  lecturerNote: string;
  isSaving: boolean;
  onOpenChange: (open: boolean) => void;
  onFinalPointsChange: (value: string) => void;
  onLecturerNoteChange: (value: string) => void;
  onUseAiSuggestion: () => void;
  onSaveReview: () => void;
};

const ContributionReviewDialog = ({ review, finalPoints, lecturerNote, isSaving, onOpenChange, onFinalPointsChange, onLecturerNoteChange, onUseAiSuggestion, onSaveReview }: ContributionReviewDialogProps) => (
  <Dialog open={Boolean(review)} onOpenChange={onOpenChange}>
    <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-3xl'>
      {review && (
        <>
          <DialogHeader>
            <DialogTitle className='text-primary'>Review Points</DialogTitle>
            <DialogDescription>
              {review.student.nama} - {review.threadTitle}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-5'>
            <div className='rounded-xl border border-accent bg-white p-4 shadow-sm'>
              <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-primary'>Konten Diskusi</p>
              <TiptapReadonlyContent content={review.post.konten} className='text-xs text-primary md:text-sm' />
            </div>

            <div className='rounded-xl border border-accent bg-secondary p-4'>
              <div className='mb-2 flex items-center gap-2'>
                <Sparkles className='size-4 text-primary' />
                <p className='text-xs font-semibold uppercase tracking-wide text-primary'>Rekomendasi AI</p>
              </div>
              <p className='text-sm font-bold text-primary'>{review.aiSuggestedPoints} points</p>
              <p className='mt-2 text-xs leading-relaxed text-primary md:text-sm'>{review.aiReason}</p>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-[180px_1fr]'>
              <label className='space-y-2'>
                <span className='text-xs font-semibold text-primary md:text-sm'>Final Points</span>
                <Input type='number' min={0} value={finalPoints} onChange={(event) => onFinalPointsChange(event.target.value)} disabled={review.status === 'REVIEWED' || isSaving} className='border-accent' />
              </label>

              <label className='space-y-2'>
                <span className='text-xs font-semibold text-primary md:text-sm'>Catatan Dosen</span>
                <Textarea value={lecturerNote} onChange={(event) => onLecturerNoteChange(event.target.value)} disabled={review.status === 'REVIEWED' || isSaving} className='min-h-24 border-accent text-xs md:text-sm' />
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' className='shadow-sm' onClick={() => onOpenChange(false)} disabled={isSaving}>
              Tutup
            </Button>
            {review.status === 'PENDING' && (
              <>
                <Button type='button' variant='secondary' className='border border-accent bg-secondary shadow-sm' onClick={onUseAiSuggestion} disabled={isSaving}>
                  Gunakan Rekomendasi AI
                </Button>
                <Button type='button' className='shadow-sm' onClick={onSaveReview} disabled={isSaving}>
                  {isSaving ? 'Menyimpan...' : 'Simpan Review'}
                </Button>
              </>
            )}
          </DialogFooter>
        </>
      )}
    </DialogContent>
  </Dialog>
);

export default ContributionReviewDialog;
