import { api } from '@/lib/axios';
import type { StudyGroupSchemaType } from '@/schemas/sg';
import type { ApiResponse } from '@/types/api';
import type { StudyGroupbyCourse } from '@/types/sg';

const getStudyGroupsByCourse = async (courseId: string, page: number = 1, limit: number = 20): Promise<ApiResponse<StudyGroupbyCourse[]>> => {
  // const res = await api.get<ApiResponse<StudyGroupbyCourse[]>>(`/sg/${courseId}?page=${page}&limit=${limit}`);

  // pake data dummy dlu sblm benya blum siap
  const res = await new Promise<{ data: ApiResponse<StudyGroupbyCourse[]> }>((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          status: 'success',
          message: 'Success',
          data: [
            {
              id: 'sg1',
              nama: 'Study Group 1',
              totalAnggota: 10,
              kapasitas: 20,
              status: true,
              totalRequest: 2,
              totalKontribusi: 50,
            },
            {
              id: 'sg2',
              nama: 'Study Group 2',
              totalAnggota: 15,
              kapasitas: 25,
              status: true,
              totalRequest: 3,
              totalKontribusi: 75,
            },
          ],
          pagination: {
            page: page,
            limit: limit,
            total_pages: 1,
            total_items: 10,
          },
        },
      });
    }, 1000);
  });

  return res.data;
};

const addStudyGroupByCourse = async (courseId: string, payload: StudyGroupSchemaType): Promise<ApiResponse<StudyGroupbyCourse>> => {
  const res = await api.post<ApiResponse<StudyGroupbyCourse>>(`/sg/${courseId}`, payload);
  return res.data;
};

export { addStudyGroupByCourse, getStudyGroupsByCourse };
