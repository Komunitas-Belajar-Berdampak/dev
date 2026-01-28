import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/cn';
import { Icon } from '@iconify/react';

export type FilterOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type FilterProps<TValue extends string> = {
  value: TValue;
  onValueChange: (value: TValue) => void;
  options: Array<FilterOption<TValue>>;
  label?: string;
  className?: string;
  buttonClassName?: string;
  contentClassName?: string;
  widthClassName?: string;
  icon?: string;
};

const Filter = <TValue extends string>({ value, onValueChange, options, label = 'Filter by..', className, buttonClassName, contentClassName, widthClassName = 'w-52', icon = 'mdi:filter-variant' }: FilterProps<TValue>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className={cn(
            `
            flex items-center gap-2 border border-black/20 bg-white text-black/30 shadow-sm hover:bg-primary 
            hover:text-white
			`,
            buttonClassName,
          )}
        >
          <Icon icon={icon} />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn(widthClassName, 'border-accent', contentClassName)} align='end' sideOffset={10}>
        <DropdownMenuRadioGroup value={value} onValueChange={(v) => onValueChange(v as TValue)} className={className}>
          {options.map((opt) => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value}>
              {opt.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Filter;
