import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/cn';
import { getInitials } from '@/lib/utils';

type UserInitialAvatarProps = {
  name: string;
  className?: string;
};

const UserInitialAvatar = ({ name, className }: UserInitialAvatarProps) => {
  return (
    <Avatar className={cn('size-10 md:size-12 shadow-md ring-1 ring-black/10', className)}>
      <AvatarFallback className='text-xs md:text-sm bg-purple text-primary font-semibold tracking-wide'>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
};

export default UserInitialAvatar;
