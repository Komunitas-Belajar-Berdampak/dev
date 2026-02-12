import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from '@/components/ui/combobox';
import type { AnggotaStudyGroup } from '@/types/sg';
import { useMemo } from 'react';

type MembersMultiSelectProps = {
  value: string[];
  onChange: (value: string[]) => void;
  members: AnggotaStudyGroup[];
  disabled?: boolean;
};

function MembersMultiSelect({ value, onChange, members, disabled }: MembersMultiSelectProps) {
  const anchor = useComboboxAnchor();
  const namaById = useMemo(() => new Map(members.map((m) => [m.id, m.nama])), [members]);
  const items = useMemo(() => members.map((m) => m.id), [members]);

  return (
    <Combobox
      multiple
      autoHighlight
      disabled={disabled}
      items={[...new Set([...(items ?? []), ...((value ?? []) as string[])])]}
      value={value ?? []}
      onValueChange={(nextValue) => {
        if (nextValue == null) {
          onChange([]);
          return;
        }

        if (Array.isArray(nextValue)) {
          onChange(nextValue.map(String));
          return;
        }

        const pickedId = String(nextValue);
        const current = (value ?? []).filter(Boolean);
        if (current.includes(pickedId)) {
          onChange(current.filter((v) => v !== pickedId));
          return;
        }

        onChange([...current, pickedId]);
      }}
    >
      <ComboboxChips ref={anchor} className='w-full'>
        <ComboboxValue>
          {(values) => (
            <>
              {(values as string[]).map((id: string) => (
                <ComboboxChip key={`${id}`}>{namaById.get(id) ?? id}</ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder={members.length === 0 ? 'No members' : 'Pick members'} />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(id) => (
            <ComboboxItem key={id} value={id}>
              {namaById.get(String(id)) ?? String(id)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export default MembersMultiSelect;
