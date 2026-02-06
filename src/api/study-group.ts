import { api } from '@/lib/axios';
import type { StudyGroupSchemaType } from '@/schemas/sg';
import type { ApiResponse } from '@/types/api';
import type { StudyGroupbyCourse, StudyGroupDetail, StudyGroupMemberDetail } from '@/types/sg';

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

const getStudyGroupMemberById = async (studyGroupId: string, userId: string): Promise<ApiResponse<StudyGroupMemberDetail>> => {
  // const res = await api.get<ApiResponse<StudyGroupMemberDetail>>(`/sg/${studyGroupId}/user-detail/${userId}`);

  const res = await new Promise<{ data: ApiResponse<StudyGroupMemberDetail> }>((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          status: 'success',
          message: 'Mocked study group member detail fetched successfully.',
          data: {
            id: studyGroupId,
            totalKontribusi: 1000,
            mahasiswa: {
              id: userId,
              nama: 'John Doe',
              nrp: '123456789',
            },
            kontribusiTotalByThread: [
              {
                thread: 'Tugas 1 - Pengantar HTML',
                kontribusi: 600,
              },
              {
                thread: 'Tugas 2 - Dasar CSS',
                kontribusi: 400,
              },
            ],
            aktivitas: [
              {
                thread: 'Tugas 1 - Pengantar HTML',
                aktivitas: 'Mengunggah tugas',
                kontribusi: 600,
                timestamp: '2025-09-23T12:38:00Z',
              },
              {
                thread: 'Tugas 2 - Dasar CSS',
                aktivitas: 'Membuat komentar',
                kontribusi: 400,
                timestamp: '2025-09-25T15:20:00Z',
              },
            ],
          },
        },
      });
    }, 1000);
  });

  return res.data;
};

export { addStudyGroupByCourse, editStudyGroupById, getStudyGroupById, getStudyGroupMemberById, getStudyGroupsByCourse };
