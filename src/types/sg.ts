export type StudyGroupbyCourse = {
  id: string;
  nama: string;
  kapasitas: number;
  totalAnggota: number;
  status: boolean;
  totalRequest: number;
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
