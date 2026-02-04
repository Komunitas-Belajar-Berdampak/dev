import type { AcademicTerm } from './academic-terms';
import type { User } from './user';

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

export type CourseById = {
  id: string;
  kodeMatkul: string;
  namaMatkul: string;
  sks: number;
  status: 'aktif' | 'tidak aktif';
  periode: AcademicTerm;
  pengajar: User[];
  mahasiswa: User[];
  kelas: string;
};
