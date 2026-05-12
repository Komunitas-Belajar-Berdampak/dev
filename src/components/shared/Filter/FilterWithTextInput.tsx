import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';
import { Icon } from '@iconify/react';

export type FilterWithTextInputValue<TField extends string> = {
  field: TField;
  keyword: string;
};

export type FilterFieldOption<TField extends string> = {
  label: string;
  value: TField;
};

type FilterWithTextInputProps<TField extends string> = {
  value: FilterWithTextInputValue<TField>;
  onValueChange: (value: FilterWithTextInputValue<TField>) => void;
  fields: Array<FilterFieldOption<TField>>;
  label?: string;
  className?: string;
  buttonClassName?: string;
  contentClassName?: string;
  widthClassName?: string;
  icon?: string;
};

const FilterWithTextInput = <TField extends string>({
  value,
  onValueChange,
  fields,
  label = 'Filter by..',
  className,
  buttonClassName,
  contentClassName,
  widthClassName = 'w-72',
  icon = 'mdi:filter-variant',
}: FilterWithTextInputProps<TField>) => {
  const selectedField = fields.find((f) => f.value === value.field) ?? fields[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className={cn(
            `
            flex items-center gap-2 border border-black/20 bg-white text-black/30 shadow-sm hover:bg-primary 
            hover:text-white text-xs md:text-sm
            h-10
            `,
            buttonClassName,
          )}
        >
          <Icon icon={icon} />
          {label}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn(widthClassName, 'border-accent p-3', contentClassName)}
        align='end'
        sideOffset={10}
      >
        <div className={cn('flex flex-col gap-3', className)}>
          <div className='flex flex-col gap-2'>
            <span className='text-xs text-primary font-bold'>Field</span>
            <div className='flex flex-wrap gap-2'>
              {fields.map((f) => {
                const isActive = f.value === value.field;
                return (
                  <button
                    key={f.value}
                    type='button'
                    className={cn(
                      'px-2 py-1 rounded-md text-xs border border-black/20',
                      isActive
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black/60 hover:bg-black/5',
                    )}
                    onClick={() => onValueChange({ ...value, field: f.value })}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <span className='text-xs text-primary font-bold'>{selectedField?.label ?? 'Keyword'}</span>
            <Input
              value={value.keyword}
              onChange={(e) => onValueChange({ ...value, keyword: e.target.value })}
              className='border-accent text-xs md:text-sm'
              placeholder={`Cari ${selectedField?.label ?? ''}...`}
              onKeyDown={(e) => {
                // prevent some browsers from submitting forms
                if (e.key === 'Enter') e.preventDefault();
              }}
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterWithTextInput;

