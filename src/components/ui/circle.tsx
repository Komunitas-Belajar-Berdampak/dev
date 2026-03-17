import { cn } from '@/lib/cn';
import { getCourseArtVariant } from '@/lib/course-art-theme';
import { getStudyGroupVariant } from '@/lib/study-group-theme';
import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';

type CircleProps = {
  size?: number;
  className?: string;
  children?: ReactNode;
  seed?: string;
  theme?: 'default' | 'course-art' | 'study-group';
};

const Circle = ({ size = 12, className = '', children, seed, theme = 'default' }: CircleProps) => {
  if (theme === 'course-art') {
    const variant = getCourseArtVariant(seed ?? 'seed');
    const hasCustomContent = children !== undefined && children !== null;

    return (
      <div className={cn(`w-${size} h-${size}`, 'relative overflow-hidden rounded-full shadow-md', variant.circleWrapper, className)}>
        <div className={cn('absolute -top-2 -right-2 h-6 w-6 rounded-full blur-sm', variant.circleDecorPrimary)} />
        <div className={cn('absolute -bottom-3 -left-3 h-8 w-8 rounded-full blur-sm', variant.circleDecorSecondary)} />
        <div className='relative z-10 flex h-full w-full items-center justify-center'>{hasCustomContent ? children : <Icon icon={variant.icon} className={cn('text-xl', variant.circleIconClass)} />}</div>
      </div>
    );
  }

  if (theme === 'study-group') {
    const variant = getStudyGroupVariant(seed ?? 'seed');
    const hasCustomContent = children !== undefined && children !== null;

    return (
      <div className={cn(`w-${size} h-${size}`, 'relative overflow-hidden rounded-full shadow-md', variant.circleWrapper, className)}>
        <div className={cn('absolute -top-2 -right-2 h-6 w-6 rounded-full blur-sm', variant.circleDecorPrimary)} />
        <div className={cn('absolute -bottom-3 -left-3 h-8 w-8 rounded-full blur-sm', variant.circleDecorSecondary)} />
        <div className='relative z-10 flex h-full w-full items-center justify-center'>{hasCustomContent ? children : <Icon icon={variant.circleIcon} className={cn('text-xl', variant.circleIconClass)} />}</div>
      </div>
    );
  }

  return <div className={`w-${size} h-${size} shadow-md rounded-full bg-purple ${className}`}>{children}</div>;
};

export default Circle;
