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
  }[];
};
