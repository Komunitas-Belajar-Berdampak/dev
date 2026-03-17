import { getCourseArtVariant } from '@/lib/course-art-theme';
import { Icon } from '@iconify/react';

export default function CourseCardArt({ seed }: { seed: string }) {
  const v = getCourseArtVariant(seed);

  return (
    <div className={['h-32 flex items-center justify-center relative overflow-hidden', v.wrapper].join(' ')}>
      {/* abstract blobs */}
      <div className='absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/25 blur-sm' />
      <div className='absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-black/10 blur-md' />
      <div className='absolute top-6 left-8 w-16 h-16 rotate-12 rounded-2xl bg-white/20' />
      <div className='absolute bottom-6 right-10 w-10 h-10 rotate-45 rounded-xl bg-white/15' />

      {/* icon */}
      <Icon icon={v.icon} className={v.iconClass} />

      {/* subtle grain pattern */}
      <div className='pointer-events-none absolute inset-0 opacity-[0.10] bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.35)_1px,transparent_1px)] bg-size-[10px_10px]' />
    </div>
  );
}
