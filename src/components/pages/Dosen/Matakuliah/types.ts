export interface Pertemuan {
  id: string;
  pertemuan: number;
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

export type BEStatus = "HIDE" | "VISIBLE";

export type Material = {
  _id: string;
  id: string;
  idMeeting: string;
  idCourse: string;
  pathFile: string;
  namaFile: string;
  tipe: string;
  status: BEStatus;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

export type Assignment = {
  _id: string;
  id: string;
  idMeeting: string;
  judul: string;
  pertemuan: number;
  statusTugas: boolean;
  tenggat: string;
  status: BEStatus;
  pathLampiran?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};