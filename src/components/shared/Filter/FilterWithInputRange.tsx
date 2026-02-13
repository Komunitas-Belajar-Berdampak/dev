import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/cn';
import { Icon } from '@iconify/react';

export type FilterFieldOption<TField extends string> = {
  label: string;
  value: TField;
};

export type FilterWithInputRangeValue<TField extends string> = {
  field: TField;
  keyword: string;
  fromDate: string;
  toDate: string;
};

type FilterWithInputRangeProps<TField extends string> = {
  value: FilterWithInputRangeValue<TField>;
  onValueChange: (value: FilterWithInputRangeValue<TField>) => void;
  fields: Array<FilterFieldOption<TField>>;
  showFieldSelect?: boolean;
  showKeywordInput?: boolean;
  label?: string;
  className?: string;
  buttonClassName?: string;
  contentClassName?: string;
  widthClassName?: string;
  icon?: string;
};

const FilterWithInputRange = <TField extends string>({
  value,
  onValueChange,
  fields,
  showFieldSelect = true,
  showKeywordInput = true,
  label = 'Filter by..',
  className,
  buttonClassName,
  contentClassName,
  widthClassName = 'w-80',
  icon = 'mdi:filter-variant',
}: FilterWithInputRangeProps<TField>) => {
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

      <DropdownMenuContent className={cn(widthClassName, 'border-accent p-3', contentClassName)} align='end' sideOffset={10}>
        <div className={cn('flex flex-col gap-4 ', className)}>
          {showFieldSelect && (
            <Select value={value.field} onValueChange={(v) => onValueChange({ ...value, field: v as TField })}>
              <SelectTrigger className=' w-full border-accent '>
                <SelectValue placeholder='Jenis topik pembahasan' />
              </SelectTrigger>
              <SelectContent className=' border-accent'>
                {fields.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {showKeywordInput && <Input className=' border-accent' placeholder='Cari (search apapun)' value={value.keyword} onChange={(e) => onValueChange({ ...value, keyword: e.target.value })} />}

          <div className='grid grid-cols-2 gap-2'>
            <Input className=' border-accent' type='date' placeholder='Dari' value={value.fromDate} onChange={(e) => onValueChange({ ...value, fromDate: e.target.value })} />
            <Input className=' border-accent' type='date' placeholder='Sampai' value={value.toDate} onChange={(e) => onValueChange({ ...value, toDate: e.target.value })} />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterWithInputRange;
