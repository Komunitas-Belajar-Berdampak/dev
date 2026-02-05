import { api } from '@/lib/axios';
import type { StudyGroupSchemaType } from '@/schemas/sg';
import type { ApiResponse } from '@/types/api';
import type { StudyGroupbyCourse, StudyGroupDetail } from '@/types/sg';

const getStudyGroupsByCourse = async (courseId: string, page: number = 1, limit: number = 20): Promise<ApiResponse<StudyGroupbyCourse[]>> => {
  const res = await api.get<ApiResponse<StudyGroupbyCourse[]>>(`/sg/course/${courseId}?page=${page}&limit=${limit}`);

  return res.data;
};

const getStudyGroupById = async (studyGroupId: string): Promise<ApiResponse<StudyGroupDetail>> => {
  const res = await api.get<ApiResponse<StudyGroupDetail>>(`/sg/group/${studyGroupId}`);
  return res.data;
};

const addStudyGroupByCourse = async (courseId: string, payload: StudyGroupSchemaType): Promise<ApiResponse<null>> => {
  const res = await api.post<ApiResponse<null>>(`/sg/${courseId}`, payload);
  return res.data;
};

const editStudyGroupById = async (studyGroupId: string, payload: StudyGroupSchemaType): Promise<ApiResponse<null>> => {
  const res = await api.put<ApiResponse<null>>(`/sg/${studyGroupId}`, payload);
  return res.data;
};

export { addStudyGroupByCourse, editStudyGroupById, getStudyGroupById, getStudyGroupsByCourse };
