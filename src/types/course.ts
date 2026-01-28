export type Course = {
  id: string;
  kodeMatkul: string;
  namaMatkul: string;
  sks: number;
  status: 'aktif' | 'tidak aktif';
  periode: string;
  deskripsi: string;
  pengajar: string;
  kelas: string;
};
