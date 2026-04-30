import Search from '@/components/shared/Search';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { StudyGroupAssignmentDashboardAssignment, StudyGroupAssignmentDashboardGroup } from '@/types/sg';
import { Settings2 } from 'lucide-react';
import { ALL_ASSIGNMENTS } from '../utils/constants';
import { formatAssignmentLabel } from '../utils/formatters';
import type { DashboardMode } from '../utils/types';

type DashboardFiltersProps = {
  mode: DashboardMode;
  selectedGroupId: string;
  selectedAssignmentId: string;
  studentSearch: string;
  groups: StudyGroupAssignmentDashboardGroup[];
  assignments: StudyGroupAssignmentDashboardAssignment[];
  onModeChange: (mode: DashboardMode) => void;
  onGroupChange: (groupId: string) => void;
  onAssignmentChange: (assignmentId: string) => void;
  onStudentSearchChange: (value: string) => void;
  onOpenWeightDialog: () => void;
};

const DashboardFilters = ({ mode, selectedGroupId, selectedAssignmentId, studentSearch, groups, assignments, onModeChange, onGroupChange, onAssignmentChange, onStudentSearchChange, onOpenWeightDialog }: DashboardFiltersProps) => {
  return (
    <div className='flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent bg-white p-4 shadow-sm'>
      <Tabs value={mode} onValueChange={(value) => onModeChange(value as DashboardMode)}>
        <TabsList variant='line' className='gap-4'>
          <TabsTrigger value='all' className='text-xs md:text-sm'>
            Seluruh Kelompok
          </TabsTrigger>
          <TabsTrigger value='group' className='text-xs md:text-sm'>
            Per Kelompok
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className='flex w-full flex-wrap items-center gap-3 sm:w-auto'>
        <Button type='button' variant='secondary' className='border bg-white text-xs text-primary shadow-sm hover:bg-secondary md:text-sm' onClick={onOpenWeightDialog}>
          <Settings2 className='size-4' />
          Atur Bobot
        </Button>

        {mode === 'group' && (
          <Select value={selectedGroupId} onValueChange={onGroupChange}>
            <SelectTrigger className='w-full border-accent text-xs md:w-56 md:text-sm'>
              <SelectValue placeholder='Pilih Study Group' />
            </SelectTrigger>
            <SelectContent className='border-accent'>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id} className='text-xs md:text-sm'>
                  {group.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={selectedAssignmentId} onValueChange={onAssignmentChange}>
          <SelectTrigger className='w-full border-accent text-xs md:w-64 md:text-sm'>
            <SelectValue placeholder='Pilih Assignment' />
          </SelectTrigger>
          <SelectContent className='border-accent'>
            <SelectItem value={ALL_ASSIGNMENTS} className='text-xs md:text-sm'>
              Semua Assignment
            </SelectItem>
            {assignments.map((assignment) => (
              <SelectItem key={assignment.id} value={assignment.id} className='text-xs md:text-sm'>
                {formatAssignmentLabel(assignment)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Search value={studentSearch} onChange={onStudentSearchChange} placeholder='Search mahasiswa...' className='w-full sm:w-60' inputClassName='bg-white' showButton={false} />
      </div>
    </div>
  );
};

export default DashboardFilters;
