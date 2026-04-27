import { api } from '@/lib/axios';
import type { StudyGroupQuickEditSchemaType, StudyGroupSchemaType } from '@/schemas/sg';
import type { ApiResponse } from '@/types/api';
import type { StudyGroupAssignmentDashboard, StudyGroupAssignmentDashboardSummary, StudyGroupbyCourse, StudyGroupByMembership, StudyGroupDetail, StudyGroupMemberDetail } from '@/types/sg';

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

const getStudyGroupsByMembership = async (courseId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<StudyGroupByMembership[]>> => {
  const res = await api.get<ApiResponse<StudyGroupByMembership[]>>(`/sg/course-membership/${courseId}?page=${page}&limit=${limit}`);
  return res.data;
};

const calculateAssignmentDashboardSummary = (data: StudyGroupAssignmentDashboard): StudyGroupAssignmentDashboardSummary => {
  const totalByStudent = data.students.map((student) => {
    const totalPoints = data.matrix.filter((item) => item.studentId === student.id).reduce((sum, item) => sum + item.points, 0);
    return { studentId: student.id, nama: student.nama, totalPoints };
  });

  const topContributor = totalByStudent.reduce<(typeof totalByStudent)[number] | null>((top, current) => {
    if (!top || current.totalPoints > top.totalPoints) return current;
    return top;
  }, null);

  const assignmentPalingTimpang = data.assignments.reduce<StudyGroupAssignmentDashboardSummary['assignmentPalingTimpang']>((top, assignment) => {
    const assignmentItems = data.matrix.filter((item) => item.assignmentId === assignment.id);
    const assignmentTotal = assignmentItems.reduce((sum, item) => sum + item.points, 0);
    if (assignmentTotal === 0) return top;

    const dominantItem = assignmentItems.reduce((dominant, item) => (item.points > dominant.points ? item : dominant), assignmentItems[0]);
    const student = data.students.find((s) => s.id === dominantItem.studentId);
    const dominancePercentage = Math.round((dominantItem.points / assignmentTotal) * 100);

    if (!student) return top;
    if (!top || dominancePercentage > top.dominancePercentage) {
      return {
        assignmentId: assignment.id,
        judul: assignment.judul,
        studentName: student.nama,
        dominancePercentage,
      };
    }
    return top;
  }, null);

  return {
    totalKontribusi: totalByStudent.reduce((sum, student) => sum + student.totalPoints, 0),
    topContributor,
    assignmentPalingTimpang,
    inactiveStudents: totalByStudent.filter((student) => student.totalPoints === 0).length,
  };
};

const getStudyGroupAssignmentDashboard = async (courseId: string): Promise<ApiResponse<StudyGroupAssignmentDashboard>> => {
  const data: StudyGroupAssignmentDashboard = {
    courseId,
    assignments: [
      { id: 'assignment-1', pertemuan: 1, judul: 'Analisis Kebutuhan Sistem' },
      { id: 'assignment-2', pertemuan: 2, judul: 'Desain Database' },
      { id: 'assignment-3', pertemuan: 3, judul: 'Prototype Fitur Utama' },
      { id: 'assignment-4', pertemuan: 4, judul: 'Evaluasi dan Presentasi' },
    ],
    groups: [
      { id: 'sg-alpha', nama: 'Study Group Alpha' },
      { id: 'sg-beta', nama: 'Study Group Beta' },
      { id: 'sg-gamma', nama: 'Study Group Gamma' },
    ],
    students: [
      { id: 'mhs-1', nrp: '5025211001', nama: 'Andi Pratama', groupId: 'sg-alpha', groupName: 'Study Group Alpha' },
      { id: 'mhs-2', nrp: '5025211002', nama: 'Bella Maharani', groupId: 'sg-alpha', groupName: 'Study Group Alpha' },
      { id: 'mhs-3', nrp: '5025211003', nama: 'Citra Amelia', groupId: 'sg-alpha', groupName: 'Study Group Alpha' },
      { id: 'mhs-4', nrp: '5025211004', nama: 'Dimas Arya', groupId: 'sg-beta', groupName: 'Study Group Beta' },
      { id: 'mhs-5', nrp: '5025211005', nama: 'Eka Putri', groupId: 'sg-beta', groupName: 'Study Group Beta' },
      { id: 'mhs-6', nrp: '5025211006', nama: 'Fajar Nugroho', groupId: 'sg-beta', groupName: 'Study Group Beta' },
      { id: 'mhs-7', nrp: '5025211007', nama: 'Gita Anindya', groupId: 'sg-gamma', groupName: 'Study Group Gamma' },
      { id: 'mhs-8', nrp: '5025211008', nama: 'Hana Safira', groupId: 'sg-gamma', groupName: 'Study Group Gamma' },
      { id: 'mhs-9', nrp: '5025211009', nama: 'Irfan Maulana', groupId: 'sg-gamma', groupName: 'Study Group Gamma' },
    ],
    matrix: [
      { studentId: 'mhs-1', assignmentId: 'assignment-1', points: 42 },
      { studentId: 'mhs-1', assignmentId: 'assignment-2', points: 56 },
      { studentId: 'mhs-1', assignmentId: 'assignment-3', points: 80 },
      { studentId: 'mhs-1', assignmentId: 'assignment-4', points: 65 },
      { studentId: 'mhs-2', assignmentId: 'assignment-1', points: 24 },
      { studentId: 'mhs-2', assignmentId: 'assignment-2', points: 18 },
      { studentId: 'mhs-2', assignmentId: 'assignment-3', points: 14 },
      { studentId: 'mhs-2', assignmentId: 'assignment-4', points: 20 },
      { studentId: 'mhs-3', assignmentId: 'assignment-1', points: 8 },
      { studentId: 'mhs-3', assignmentId: 'assignment-2', points: 6 },
      { studentId: 'mhs-3', assignmentId: 'assignment-3', points: 0 },
      { studentId: 'mhs-3', assignmentId: 'assignment-4', points: 4 },
      { studentId: 'mhs-4', assignmentId: 'assignment-1', points: 30 },
      { studentId: 'mhs-4', assignmentId: 'assignment-2', points: 44 },
      { studentId: 'mhs-4', assignmentId: 'assignment-3', points: 38 },
      { studentId: 'mhs-4', assignmentId: 'assignment-4', points: 22 },
      { studentId: 'mhs-5', assignmentId: 'assignment-1', points: 28 },
      { studentId: 'mhs-5', assignmentId: 'assignment-2', points: 35 },
      { studentId: 'mhs-5', assignmentId: 'assignment-3', points: 41 },
      { studentId: 'mhs-5', assignmentId: 'assignment-4', points: 30 },
      { studentId: 'mhs-6', assignmentId: 'assignment-1', points: 0 },
      { studentId: 'mhs-6', assignmentId: 'assignment-2', points: 12 },
      { studentId: 'mhs-6', assignmentId: 'assignment-3', points: 6 },
      { studentId: 'mhs-6', assignmentId: 'assignment-4', points: 0 },
      { studentId: 'mhs-7', assignmentId: 'assignment-1', points: 15 },
      { studentId: 'mhs-7', assignmentId: 'assignment-2', points: 18 },
      { studentId: 'mhs-7', assignmentId: 'assignment-3', points: 24 },
      { studentId: 'mhs-7', assignmentId: 'assignment-4', points: 20 },
      { studentId: 'mhs-8', assignmentId: 'assignment-1', points: 52 },
      { studentId: 'mhs-8', assignmentId: 'assignment-2', points: 50 },
      { studentId: 'mhs-8', assignmentId: 'assignment-3', points: 46 },
      { studentId: 'mhs-8', assignmentId: 'assignment-4', points: 62 },
      { studentId: 'mhs-9', assignmentId: 'assignment-1', points: 4 },
      { studentId: 'mhs-9', assignmentId: 'assignment-2', points: 0 },
      { studentId: 'mhs-9', assignmentId: 'assignment-3', points: 8 },
      { studentId: 'mhs-9', assignmentId: 'assignment-4', points: 5 },
    ],
    weights: [
      { assignmentId: 'assignment-1', weight: 25 },
      { assignmentId: 'assignment-2', weight: 25 },
      { assignmentId: 'assignment-3', weight: 25 },
      { assignmentId: 'assignment-4', weight: 25 },
    ],
    summary: {
      totalKontribusi: 0,
      topContributor: null,
      assignmentPalingTimpang: null,
      inactiveStudents: 0,
    },
  };

  data.summary = calculateAssignmentDashboardSummary(data);

  await new Promise((resolve) => setTimeout(resolve, 450));

  return {
    status: 'success',
    message: 'Mock dashboard kontribusi assignment berhasil dimuat.',
    data,
  };
};

export { addStudyGroupByCourse, editStudyGroupById, getStudyGroupAssignmentDashboard, getStudyGroupById, getStudyGroupMemberById, getStudyGroupsByCourse, getStudyGroupsByMembership, quickEditStudyGroupById };
