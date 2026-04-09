import Search from '@/components/shared/Search';
import Title from '@/components/shared/Title';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import type { Course } from '@/types/course';
import { Icon } from '@iconify/react';
import { useMemo, useRef, useState } from 'react';
import MhsCourseCard from '../components/MhsCourseCard';
import useFetchMhsCourse from '../hooks/useFetchMhsCourse';
import CoursesSkeletonGrid from './MhsCourseSkeleton';

const breadcrumbItems = [{ label: 'Courses', href: '/mahasiswa/courses' }];

const MhsCoursePage = () => {
  // client-side search
  const [search, setSearch] = useState('');

  // server-side filters
  const [kelas, setKelas] = useState('');
  const [periode, setPeriode] = useState('');
  const [status, setStatus] = useState('');
  const [sks, setSks] = useState('');

  // applied filters (only sent to API on Apply)
  const [appliedFilters, setAppliedFilters] = useState({});

  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);

  const { courses, coursePending } = useFetchMhsCourse(appliedFilters);

  // debounce search - 400ms
  const debouncedSearch = useDebounce(search, 400);

  // client-side search on already-fetched courses
  const filteredCourses = useMemo(() => {
    if (!debouncedSearch.trim()) return courses;
    const q = debouncedSearch.toLowerCase();
    return courses.filter((c) => `${c.kodeMatkul} ${c.namaMatkul}`.toLowerCase().includes(q));
  }, [courses, debouncedSearch]);

  const hasActiveFilter = Object.values(appliedFilters).some(Boolean);

  const handleApply = () => {
    setAppliedFilters({
      ...(kelas && { kelas }),
      ...(periode && { periode }),
      ...(status && { status }),
      ...(sks && { sks }),
    });
    setShowFilter(false);
  };

  const handleReset = () => {
    setKelas('');
    setPeriode('');
    setStatus('');
    setSks('');
    setAppliedFilters({});
    setShowFilter(false);
  };

  return (
    <div className='flex flex-col gap-6 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8'>
      <Title title='Courses' items={breadcrumbItems} />

      {/* Search + Filter */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex w-full sm:w-auto gap-2'>
          <Search
            value={search}
            onChange={(val) => {
              setSearch(val);
            }}
          />
        </div>

        <div className='relative' ref={filterRef}>
          <Button
            variant='outline'
            onClick={() => setShowFilter((v) => !v)}
            className='flex items-center gap-2 border-2 border-black bg-white text-black shadow-[3px_3px_0_0_#000] hover:bg-blue-900 hover:text-white transition'
            type='button'
          >
            <Icon icon='mdi:filter-variant' />
            Filter by
            {hasActiveFilter && <span className='ml-1 rounded-full bg-blue-900 text-white text-[10px] w-4 h-4 flex items-center justify-center'>!</span>}
          </Button>

          {showFilter && (
            <div className='absolute right-0 mt-3 w-60 rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_#000] space-y-4 z-50'>
              <div className='grid gap-3'>
                <Input placeholder='Kelas (ex: A)' value={kelas} onChange={(e) => setKelas(e.target.value)} />
                <Input placeholder='Periode' value={periode} onChange={(e) => setPeriode(e.target.value)} />
              </div>

              <div className='grid gap-3'>
                <div className='h-10 rounded-md border border-black/20 bg-white px-3'>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className='h-full w-full bg-transparent text-sm outline-none text-gray-700'>
                    <option value=''>Status (All)</option>
                    <option value='aktif'>Aktif</option>
                    <option value='nonaktif'>Nonaktif</option>
                  </select>
                </div>
                <Input placeholder='SKS' inputMode='numeric' value={sks} onChange={(e) => setSks(e.target.value)} />
              </div>

              <div className='flex items-center justify-end gap-2 pt-1'>
                <Button variant='outline' className='border-2 border-black shadow-[3px_3px_0_0_#000]' type='button' onClick={handleReset}>
                  Reset
                </Button>
                <Button className='bg-blue-900 text-white shadow-[3px_3px_0_0_#000]' type='button' onClick={handleApply}>
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
      {coursePending && <CoursesSkeletonGrid count={6} />}

      {/* Course Grid */}
      {!coursePending && filteredCourses.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8 max-h-[calc(100vh-200px)] overflow-y-auto'>
          {filteredCourses.map((course: Course) => (
            <MhsCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!coursePending && filteredCourses.length === 0 && (
        <div className='mt-16 flex flex-col items-center justify-center text-center'>
          <Icon icon='mdi:book-search-outline' className='text-7xl text-gray-200' />
          <p className='mt-6 text-lg font-bold text-blue-900'>Course Tidak Ditemukan</p>
          <p className='mt-2 text-sm text-gray-500 max-w-sm'>Coba ubah kata kunci atau atur filter biar ketemu course yang kamu cari.</p>
          {(hasActiveFilter || debouncedSearch) && (
            <Button onClick={handleReset} className='mt-6 bg-blue-900 text-white shadow-[3px_3px_0_0_#000]' type='button'>
              Reset Filter
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MhsCoursePage;
