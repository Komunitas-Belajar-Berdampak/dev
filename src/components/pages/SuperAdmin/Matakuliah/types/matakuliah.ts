export type StatusMatakuliah = "aktif" | "tidak aktif";

export interface MatakuliahEntity {
  id: string;
  kodeMatkul: string;
  namaMatkul: string;
  sks: number;
  status: StatusMatakuliah;
  periode: string | null;
  pengajar: string | null;
  kelas: string;
  deskripsi: string | null;
}

export interface Matakuliah {
  id: string;
  kodeMatkul: string;
  namaMatkul: string;
  sks: number;
  kelas: string;
  status: StatusMatakuliah;

  idPeriode: string;
  namaPeriode: string;

  idPengajar: string;
  namaPengajar: string;

  idMahasiswa: string[];

  deskripsi?: string;
}
