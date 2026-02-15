import { getCourseById } from '@/api/course';
import { getStudyGroupById } from '@/api/study-group';
import NoData from '@/components/shared/NoData';
import type { ApiResponse } from '@/types/api';
import type { CourseById } from '@/types/course';
import type { StudyGroupDetail } from '@/types/sg';
import { useQuery } from '@tanstack/react-query';
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

  if (isLoadingCourse || isLoadingSg) {
    return <EditStudyGroupSkeleton />;
  }

  if (!studyGroupData) {
    return <NoData message='Data Study Group tidak ditemukan.' />;
  }

  return <EditStudyGroupForm idMatkul={idMatkul} idSg={idSg} courseData={courseData} studyGroupData={studyGroupData} />;
};

export default EditStudyGroupContent;
