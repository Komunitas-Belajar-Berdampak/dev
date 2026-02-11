import { api } from '@/lib/axios';
import type { StudyGroupQuickEditSchemaType, StudyGroupSchemaType } from '@/schemas/sg';
import type { ApiResponse } from '@/types/api';
import type { StudyGroupbyCourse, StudyGroupByMembership, StudyGroupDetail, StudyGroupMemberDetail } from '@/types/sg';

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

const quickEditStudyGroupById = async (studyGroupId: string, payload: StudyGroupQuickEditSchemaType): Promise<ApiResponse<null>> => {
  const res = await api.put<ApiResponse<null>>(`/sg/${studyGroupId}`, payload);
  return res.data;
};

const getStudyGroupMemberById = async (studyGroupId: string, userId: string): Promise<ApiResponse<StudyGroupMemberDetail>> => {
  const res = await api.get<ApiResponse<StudyGroupMemberDetail>>(`/sg/${studyGroupId}/user-detail/${userId}`);

  return res.data;
};

const getStudyGroupsByMembership = async (_courseId: string, _page: number = 1, _limit: number = 10): Promise<ApiResponse<StudyGroupByMembership[]>> => {
  void _courseId;
  void _page;
  void _limit;
  // const res = await api.get<ApiResponse<StudyGroupByMembership[]>>(`/sg/course-memberships/${courseId}?page=${page}&limit=${limit}`);

  const res = await new Promise<{ data: ApiResponse<StudyGroupByMembership[]> }>((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          status: 'success',
          message: 'Mocked data',
          data: [
            {
              id: 'sg-1',
              nama: 'Study Group A',
              kapasitas: 10,
              totalAnggota: 8,
              status: true,
              totalKontribusi: 150,
            },
            {
              id: 'sg-2',
              nama: 'Study Group B',
              kapasitas: 10,
              totalAnggota: 8,
              status: true,
              statusMember: 'APPROVED',
              totalKontribusi: 150,
            },
            {
              id: 'sg-3',
              nama: 'Study Group C',
              kapasitas: 10,
              totalAnggota: 8,
              status: true,
              statusMember: 'PENDING',
              totalKontribusi: 150,
            },
            {
              id: 'sg-4',
              nama: 'Study Group D',
              kapasitas: 10,
              totalAnggota: 8,
              status: true,
              statusMember: 'REJECTED',
              totalKontribusi: 150,
            },
          ],
        },
      });
    }, 1000);
  });

  return res.data;
};

export { addStudyGroupByCourse, editStudyGroupById, getStudyGroupById, getStudyGroupMemberById, getStudyGroupsByCourse, getStudyGroupsByMembership, quickEditStudyGroupById };
