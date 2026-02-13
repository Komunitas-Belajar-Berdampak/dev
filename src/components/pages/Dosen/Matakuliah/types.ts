export interface Pertemuan {
  id: string;
  pertemuanKe: number;
  judul: string;
  deskripsi?: string;
}

export interface MatakuliahDetail {
  id: string;
  kodeMatkul: string;
  namaMatkul: string;
  deskripsi: string;
  sks: number;
  kelas: string;
  pertemuan: Pertemuan[];
  namaPengajar?: string;
  namaPeriode?: string;
}

export type DosenCourseStatus = "aktif" | "nonaktif";

export interface DosenCourse {
  id: string;
  kodeMatkul: string;
  namaMatkul: string;
  sks: number;
  status: DosenCourseStatus;
  periode: string;
  deskripsi?: string | null;
  pengajar: string;
  kelas: string;
}

