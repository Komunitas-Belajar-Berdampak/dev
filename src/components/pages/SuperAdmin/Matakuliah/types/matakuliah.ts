export type StatusMatakuliah = "aktif" | "tidak aktif";

export interface Matakuliah {
  id: string;
  kodeMatkul: string;
  namaMatkul: string;
  sks: number;
  kelas: string;
  status: StatusMatakuliah;

  idPeriode: string;
  namaPeriode: string; // hasil mapping (UI)

  idPengajar: string;
  namaPengajar: string; // hasil mapping (UI)

  idMahasiswa: string[];

  deskripsi?: string;
}
