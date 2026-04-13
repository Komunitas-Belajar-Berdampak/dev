import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';
import { Icon } from '@iconify/react';

type SearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  onSearch?: () => void;
  showButton?: boolean;
};

const Search = ({ value, onChange, placeholder = 'Search...', className, inputClassName, buttonClassName, onSearch, showButton = true }: SearchProps) => {
  return (
    <div className={cn('flex w-full sm:w-auto items-center', showButton ? 'gap-2' : 'gap-0', className)}>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cn('text-xs md:text-sm w-full border border-accent', inputClassName)} />
      {showButton && (
        <Button size='icon' className={cn('shadow-sm', buttonClassName)} type='button' onClick={onSearch}>
          <Icon icon='mdi:magnify' className='text-lg' />
        </Button>
      )}
    </div>
  );
};

export default Search;
