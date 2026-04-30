export type StudyGroupbyCourse = {
  id: string;
  nama: string;
  kapasitas: number;
  totalAnggota: number;
  status: boolean;
  totalRequest: number;
  totalKontribusi: number;
};

export type StudyGroupByMembership = {
  id: string;
  nama: string;
  kapasitas: number;
  totalAnggota: number;
  status: boolean;
  deskripsi?: string;
  statusMember?: 'PENDING' | 'APPROVED' | 'REJECTED';
  totalKontribusi: number;
};

export type StudyGroupDetail = {
  id: string;
  nama: string;
  deskripsi?: string;
  kapasitas: number;
  anggota?: AnggotaStudyGroup[];
  status: boolean;
  totalKontribusi: number;
};

export type AnggotaStudyGroup = {
  id: string;
  nrp: string;
  nama: string;
  totalKontribusi: number;
};

export type StudyGroupMemberDetail = {
  id: string;
  totalKontribusi: number;
  mahasiswa: {
    id: string;
    nrp: string;
    nama: string;
  };
  kontribusiTotalByThread: {
    thread: string;
    kontribusi: number;
  }[];
  aktivitas: {
    thread: string;
    aktivitas: string;
    kontribusi: number;
    timestamp: string;
    status?: 'PENDING' | 'REVIEWED';
    catatan?: string | null;
    reviewId?: string;
    statusReview?: 'PENDING' | 'REVIEWED';
    finalPoints?: number | null;
    lecturerNote?: string | null;
  }[];
};

export type StudyGroupAssignmentDashboardAssignment = {
  id: string;
  pertemuan: number;
  judul: string;
};

export type StudyGroupAssignmentDashboardGroup = {
  id: string;
  nama: string;
};

export type StudyGroupAssignmentDashboardStudent = {
  id: string;
  nrp: string;
  nama: string;
  groupId: string;
  groupName: string;
};

export type StudyGroupAssignmentDashboardMatrixItem = {
  studentId: string;
  assignmentId: string;
  points: number;
};

export type StudyGroupAssignmentWeight = {
  assignmentId: string;
  weight: number;
};

export type StudyGroupAssignmentDashboardSummary = {
  totalKontribusi: number;
  topContributor: {
    studentId: string;
    nama: string;
    totalPoints: number;
  } | null;
  assignmentPalingTimpang: {
    assignmentId: string;
    judul: string;
    studentName: string;
    dominancePercentage: number;
  } | null;
  inactiveStudents: number;
};

export type StudyGroupAssignmentDashboard = {
  courseId: string;
  assignments: StudyGroupAssignmentDashboardAssignment[];
  groups: StudyGroupAssignmentDashboardGroup[];
  students: StudyGroupAssignmentDashboardStudent[];
  matrix: StudyGroupAssignmentDashboardMatrixItem[];
  weights: StudyGroupAssignmentWeight[];
  summary: StudyGroupAssignmentDashboardSummary;
};
