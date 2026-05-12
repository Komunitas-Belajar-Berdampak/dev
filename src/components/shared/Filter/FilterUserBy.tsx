import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';
import { Icon } from '@iconify/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type UserFilterField = 'nama' | 'nrp' | 'prodi' | 'role' | 'status';

export type ProgramStudiOption = {
  id: string;
  nama: string;
};

export type RoleOption = {
  id: string;
  nama: string;
};

export type UserFilterValue = {
  field: UserFilterField;
  // for: nama/nrp (keyword), prodi/role/status (selectedId)
  keyword: string;
  selectedId: string;
};

type FilterUserByProps = {
  value: UserFilterValue;
  onValueChange: (value: UserFilterValue) => void;
  programStudiOptions: ProgramStudiOption[];
  roleOptions: RoleOption[];
  label?: string;
  buttonClassName?: string;
  contentClassName?: string;
  widthClassName?: string;
  icon?: string;
  className?: string;
};

const FilterUserBy = ({
  value,
  onValueChange,
  programStudiOptions,
  roleOptions,
  label = 'Filter by..',
  buttonClassName,
  contentClassName,
  widthClassName = 'w-[420px]',
  icon = 'mdi:filter-variant',
  className,
}: FilterUserByProps) => {
  const fieldLabel: Record<UserFilterField, string> = {
    nama: 'Nama',
    nrp: 'NRP',
    prodi: 'Program Studi',
    role: 'Role',
    status: 'Status',
  };

  const isTextField = value.field === 'nama' || value.field === 'nrp';

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
        align='end'
        sideOffset={10}
        className={cn(widthClassName, 'border-accent p-3', contentClassName)}
      >
        <div className={cn('flex flex-col gap-4', className)}>
          {/* Field selector */}
          <div className='flex flex-col gap-2'>
            <span className='text-xs text-primary font-bold'>Field</span>
            <div className='flex flex-wrap gap-2'>
              {(
                [
                  { value: 'nama', label: 'Nama' },
                  { value: 'nrp', label: 'NRP' },
                  { value: 'prodi', label: 'Program Studi' },
                  { value: 'role', label: 'Role' },
                  { value: 'status', label: 'Aktif/Non Aktif' },
                ] as Array<{ value: UserFilterField; label: string }>
              ).map((opt) => {
                const active = value.field === opt.value;
                return (
                  <button
                    key={opt.value}
                    type='button'
                    className={cn(
                      'px-2 py-1 rounded-md text-xs border border-black/20',
                      active
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black/60 hover:bg-black/5',
                    )}
                    onClick={() =>
                      onValueChange({
                        ...value,
                        field: opt.value,
                        // keep keyword/selectedId as-is
                      })
                    }
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input based on field */}
          <div className='flex flex-col gap-2'>
            <span className='text-xs text-primary font-bold'>
              {fieldLabel[value.field]}
            </span>

            {isTextField && (
              <Input
                value={value.keyword}
                onChange={(e) =>
                  onValueChange({
                    ...value,
                    keyword: e.target.value,
                  })
                }
                className='border-accent text-xs md:text-sm'
                placeholder={
                  value.field === 'nama'
                    ? 'Cari nama...'
                    : 'Cari NRP...'
                }
                type={value.field === 'nrp' ? 'number' : 'text'}
                inputMode={value.field === 'nrp' ? 'numeric' : 'text'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.preventDefault();
                }}
              />
            )}

            {value.field === 'prodi' && (
              <Select
                value={value.selectedId}
                onValueChange={(id) =>
                  onValueChange({ ...value, selectedId: id })
                }
              >
                <SelectTrigger className='w-full border-accent text-xs md:text-sm'>
                  <SelectValue placeholder='Pilih Program Studi' />
                </SelectTrigger>
                <SelectContent className='border-accent'>
                  <SelectItem value='all' className='text-xs md:text-sm'>Semua</SelectItem>
                  {programStudiOptions.map((p) => (
                    <SelectItem key={p.id} value={p.id} className='text-xs md:text-sm'>
                      {p.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {value.field === 'role' && (
              <Select
                value={value.selectedId}
                onValueChange={(id) =>
                  onValueChange({ ...value, selectedId: id })
                }
              >
                <SelectTrigger className='w-full border-accent text-xs md:text-sm'>
                  <SelectValue placeholder='Pilih Role' />
                </SelectTrigger>
                <SelectContent className='border-accent'>
                  <SelectItem value='all'>Semua</SelectItem>
                  {roleOptions.map((r) => (
                    <SelectItem key={r.id} value={r.id} className='text-xs md:text-sm'>
                      {r.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {value.field === 'status' && (
              <Select
                value={value.selectedId}
                onValueChange={(id) =>
                  onValueChange({ ...value, selectedId: id })
                }
              >
                <SelectTrigger className='w-full border-accent text-xs md:text-sm'>
                  <SelectValue placeholder='Pilih Status' />
                </SelectTrigger>
                <SelectContent className='border-accent'>
                  <SelectItem value='all'>Semua</SelectItem>
                  <SelectItem value='aktif' className='text-xs md:text-sm'>
                    Aktif
                  </SelectItem>
                  <SelectItem value='tidak aktif' className='text-xs md:text-sm'>
                    Tidak Aktif
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterUserBy;

