import type { Course } from '@/types/course';

export type CourseSortOption = 'nama-asc' | 'nama-desc' | 'periode-asc' | 'periode-desc';

type SortKey = 'nama' | 'periode';

type SortDir = 'asc' | 'desc';

export const filterCourses = (courses: Course[], search: string) => {
  const keyword = search.trim().toLowerCase();

  return courses.filter((course) => {
    if (course.status !== 'aktif') return false;
    if (!keyword) return true;

    return (course.namaMatkul ?? '').toLowerCase().includes(keyword) || (course.kodeMatkul ?? '').toLowerCase().includes(keyword) || (course.periode ?? '').toLowerCase().includes(keyword);
  });
};

export const sortCourses = (courses: Course[], sort: CourseSortOption, locale: string = 'id') => {
  const collator = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' });
  const [key, dir] = sort.split('-') as [SortKey, SortDir];
  const direction = dir === 'asc' ? 1 : -1;

  const getValue = (course: Course) => {
    if (key === 'periode') return course.periode ?? '';
    return course.namaMatkul ?? '';
  };

  return [...courses].sort((a, b) => direction * collator.compare(getValue(a), getValue(b)));
};

export const getVisibleCourses = (courses: Course[], search: string, sort: CourseSortOption) => {
  return sortCourses(filterCourses(courses, search), sort);
};
