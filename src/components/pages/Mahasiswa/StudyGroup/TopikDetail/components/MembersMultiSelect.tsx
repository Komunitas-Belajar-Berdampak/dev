import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from '@/components/ui/combobox';
import { getStudyGroupMemberName, isStudyGroupMemberMatch } from '@/components/shared/StudyGroupMembersField/utils';
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
  const memberById = useMemo(() => new Map(members.map((m) => [m.id, { nama: m.nama, nrp: m.nrp }])), [members]);
  const items = useMemo(() => members.map((m) => m.id), [members]);

  return (
    <Combobox
      multiple
      autoHighlight
      disabled={disabled}
      items={[...new Set([...(items ?? []), ...((value ?? []) as string[])])]}
      value={value ?? []}
      filter={(id, query) => isStudyGroupMemberMatch(String(id), query, memberById)}
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
      <ComboboxChips ref={anchor} className='w-full min-w-0'>
        <ComboboxValue>
          {(values) => (
            <>
              {(values as string[]).map((id: string) => (
                <ComboboxChip key={`${id}`} className='max-w-full'>
                  <span className='block max-w-full truncate'>{getStudyGroupMemberName(id, memberById)}</span>
                </ComboboxChip>
              ))}
              <ComboboxChipsInput className={'min-w-0 text-xs md:text-sm'} placeholder={members.length === 0 ? 'No members' : 'Pick members'} />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(id) => (
            <ComboboxItem key={id} value={id} className={' text-xs md:text-sm'}>
              <div className='flex min-w-0 flex-col'>
                <span className='truncate'>{getStudyGroupMemberName(String(id), memberById)}</span>
                {memberById.get(String(id))?.nrp && <span className='text-xs text-accent'>{memberById.get(String(id))?.nrp}</span>}
              </div>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export default MembersMultiSelect;
