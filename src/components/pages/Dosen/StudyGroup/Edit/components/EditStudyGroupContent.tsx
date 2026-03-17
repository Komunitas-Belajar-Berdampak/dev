import { getCourseById } from '@/api/course';
import { getStudyGroupById, getStudyGroupsByCourse } from '@/api/study-group';
import NoData from '@/components/shared/NoData';
import type { ApiResponse } from '@/types/api';
import type { CourseById } from '@/types/course';
import type { StudyGroupDetail, StudyGroupbyCourse } from '@/types/sg';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import EditStudyGroupForm from './EditStudyGroupForm';
import EditStudyGroupSkeleton from './EditStudyGroupSkeleton';

type EditStudyGroupContentProps = {
  idMatkul: string;
  namaMatkul: string;
  idSg: string;
  namaSg: string;
};

const EditStudyGroupContent = ({ idMatkul, idSg }: EditStudyGroupContentProps) => {
  const { data: courseData, isLoading: isLoadingCourse } = useQuery<ApiResponse<CourseById>, Error, CourseById>({
    queryKey: ['course-by-id', idMatkul],
    queryFn: () => getCourseById(idMatkul),
    select: (res) => res.data,
  });

  const { data: studyGroupData, isLoading: isLoadingSg } = useQuery<ApiResponse<StudyGroupDetail>, Error, StudyGroupDetail>({
    queryKey: ['sg-detail', idSg],
    queryFn: () => getStudyGroupById(idSg),
    select: (res) => res.data,
  });

  const { data: sgByCourse, isLoading: isLoadingSgByCourse } = useQuery<ApiResponse<StudyGroupbyCourse[]>, Error, StudyGroupbyCourse[]>({
    queryKey: ['sg-by-course', idMatkul, 'all-for-edit'],
    queryFn: () => getStudyGroupsByCourse(idMatkul, 1, 200),
    select: (res) => res.data,
  });

  const otherGroupDetails = useQueries({
    queries: (sgByCourse ?? [])
      .filter((sg) => sg.id !== idSg)
      .map((sg) => ({
        queryKey: ['sg-detail', sg.id],
        queryFn: () => getStudyGroupById(sg.id),
        select: (res: ApiResponse<StudyGroupDetail>) => res.data,
      })),
  });

  const blockedMemberIds = useMemo(() => {
    const ids = new Set<string>();
    otherGroupDetails.forEach((q) => {
      q.data?.anggota?.forEach((member) => ids.add(member.id));
    });
    return [...ids];
  }, [otherGroupDetails]);

  const isLoadingOtherMembers = isLoadingSgByCourse || otherGroupDetails.some((q) => q.isLoading);

  if (isLoadingCourse || isLoadingSg || isLoadingOtherMembers) {
    return <EditStudyGroupSkeleton />;
  }

  if (!studyGroupData) {
    return <NoData message='Data Study Group tidak ditemukan.' />;
  }

  return <EditStudyGroupForm idMatkul={idMatkul} idSg={idSg} courseData={courseData} studyGroupData={studyGroupData} blockedMemberIds={blockedMemberIds} />;
};

export default EditStudyGroupContent;
