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
  anggota?: string[];
  status: boolean;
  totalKontribusi: number;
};
