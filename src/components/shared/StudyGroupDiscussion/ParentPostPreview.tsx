import { cn } from '@/lib/cn';
import { renderHighlightedText } from '@/lib/discussion-search';
import type { ThreadParentPostPreview } from '@/types/thread-post';
import { MessageSquareReply } from 'lucide-react';

type ParentPostPreviewProps = {
  parentPost: ThreadParentPostPreview | null | undefined;
  keyword?: string;
  className?: string;
  onJump?: () => void;
};

const ParentPostPreview = ({ parentPost, keyword = '', className, onJump }: ParentPostPreviewProps) => {
  if (!parentPost) return null;

  const baseClassName = cn('block w-full rounded-lg border border-accent bg-white/70 px-3 py-2 text-left text-xs md:text-sm', className);

  const inner = (
    <>
      <div className='mb-1 flex flex-wrap items-center gap-2'>
        <span className='h-8 w-1 rounded-full bg-primary' />
        <MessageSquareReply className='size-3.5 text-primary/80' />
        <span className='font-semibold text-primary'>{parentPost.author ? renderHighlightedText(parentPost.author.nama, keyword) : 'Post dihapus'}</span>
        {parentPost.author?.nrp && <span className='text-accent'>{renderHighlightedText(parentPost.author.nrp, keyword)}</span>}
      </div>
      <p className='line-clamp-2 text-primary/75'>{renderHighlightedText(parentPost.kontenPreview, keyword)}</p>
    </>
  );

  if (onJump) {
    return (
      <button
        type='button'
        onClick={onJump}
        aria-label='Lihat pesan asli'
        title='Lihat pesan asli'
        className={cn(baseClassName, 'cursor-pointer transition-colors hover:border-primary hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary')}
      >
        {inner}
      </button>
    );
  }

  return <div className={baseClassName}>{inner}</div>;
};

export default ParentPostPreview;
