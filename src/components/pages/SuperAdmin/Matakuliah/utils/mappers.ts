import type { Matakuliah, MatakuliahEntity } from "../types/matakuliah";

export type MatakuliahTableRow = {
  id: string;
  kodeMatkul: string;
  namaMatkul: string;
  sks: number;
  kelas: string;
  status: "Aktif" | "Tidak Aktif";
  namaPeriode: string;
  namaPengajar: string;
};

export const toMatakuliah = (e: MatakuliahEntity): Matakuliah => ({
  id: e.id,
  kodeMatkul: e.kodeMatkul,
  namaMatkul: e.namaMatkul,
  sks: e.sks,
  kelas: e.kelas,
  status: e.status,

  idPeriode: "",
  namaPeriode: e.periode ?? "-",

  idPengajar: "",
  namaPengajar: e.pengajar ?? "-",

  idMahasiswa: [],

  deskripsi: e.deskripsi ?? undefined,
});

export const toMatakuliahTableRow = (m: Matakuliah): MatakuliahTableRow => ({
  id: m.id,
  kodeMatkul: m.kodeMatkul,
  namaMatkul: m.namaMatkul,
  sks: m.sks,
  kelas: m.kelas,
  status: m.status === "aktif" ? "Aktif" : "Tidak Aktif",
  namaPeriode: m.namaPeriode || "-",
  namaPengajar: m.namaPengajar || "-",
});
