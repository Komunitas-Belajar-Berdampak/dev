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
};

const Search = ({ value, onChange, placeholder = 'Search...', className, inputClassName, buttonClassName, onSearch }: SearchProps) => {
  return (
    <div className={cn('flex w-full sm:w-auto gap-2', className)}>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cn('w-full border border-accent', inputClassName)} />
      <Button size='icon' className={cn('shadow-sm', buttonClassName)} type='button' onClick={onSearch}>
        <Icon icon='mdi:magnify' className='text-lg' />
      </Button>
    </div>
  );
};

export default Search;
