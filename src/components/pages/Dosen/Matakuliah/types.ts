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
