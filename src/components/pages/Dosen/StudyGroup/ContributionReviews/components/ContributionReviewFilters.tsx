import Search from '@/components/shared/Search';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { statusOptions } from '../utils/constants';
import type { ReviewFilter } from '../utils/types';

type ContributionReviewFiltersProps = {
  statusFilter: ReviewFilter;
  searchKeyword: string;
  onStatusFilterChange: (value: ReviewFilter) => void;
  onSearchKeywordChange: (value: string) => void;
};

const ContributionReviewFilters = ({ statusFilter, searchKeyword, onStatusFilterChange, onSearchKeywordChange }: ContributionReviewFiltersProps) => (
  <Card className='border-accent bg-white py-4 shadow-sm'>
    <CardContent className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
      <div className='flex flex-wrap gap-2'>
        {statusOptions.map((option) => {
          const isActive = statusFilter === option.value;

          return (
            <Button key={option.value} type='button' variant={isActive ? 'default' : 'outline'} className='text-xs shadow-sm md:text-sm' onClick={() => onStatusFilterChange(option.value)}>
              {option.label}
            </Button>
          );
        })}
      </div>
      <Search value={searchKeyword} onChange={onSearchKeywordChange} placeholder='Search mahasiswa/thread...' showButton={false} className='w-full md:w-auto' inputClassName='md:w-80' />
    </CardContent>
  </Card>
);

export default ContributionReviewFilters;
