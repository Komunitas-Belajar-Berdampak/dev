import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { ArrowDown, ArrowUp } from 'lucide-react';

type DiscussionScrollButtonsProps = {
  canScrollUp: boolean;
  canScrollDown: boolean;
  hasReplyComposer: boolean;
  onScrollToTop: () => void;
  onScrollToBottom: () => void;
};

const DiscussionScrollButtons = ({ canScrollUp, canScrollDown, hasReplyComposer, onScrollToTop, onScrollToBottom }: DiscussionScrollButtonsProps) => {
  if (!canScrollUp && !canScrollDown) return null;

  return (
    <div className={cn('fixed right-4 z-40 flex flex-col gap-2 md:right-8', hasReplyComposer ? 'bottom-44 md:bottom-52' : 'bottom-6 md:bottom-8')}>
      {canScrollUp && (
        <Button type='button' variant='default' size='icon' onClick={onScrollToTop} className='size-11 rounded-full border bg-primary text-white shadow-lg hover:bg-primary/90 md:size-12' aria-label='Scroll ke atas'>
          <ArrowUp className='size-5' />
        </Button>
      )}

      {canScrollDown && (
        <Button type='button' variant='default' size='icon' onClick={onScrollToBottom} className='size-11 rounded-full border bg-primary text-white shadow-lg hover:bg-primary/90 md:size-12' aria-label='Scroll ke bawah'>
          <ArrowDown className='size-5' />
        </Button>
      )}
    </div>
  );
};

export default DiscussionScrollButtons;
