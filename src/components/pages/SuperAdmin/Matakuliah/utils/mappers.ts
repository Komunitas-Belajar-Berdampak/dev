import { type ReactNode } from "react";
import type { Matakuliah, MatakuliahEntity } from "../types/matakuliah";

export type MatakuliahTableRow = {
  deskripsi: ReactNode;
  id: string;
  kodeMatkul: string;
  namaMatkul: string;
  sks: number;
  kelas: string;
  status: "Aktif" | "Tidak Aktif";
  namaPeriode: string;
  namaPengajar: string;
};

function parsePengajar(p: MatakuliahEntity["pengajar"]) {
  // API baru: array object
  if (Array.isArray(p)) {
    return {
      idPengajar: p?.[0]?.id ?? "",
      namaPengajar:
        p.length > 0
          ? p
              .map((x) => x?.nama)
              .filter(Boolean)
              .join(", ")
          : "-",
    };
  }

  if (typeof p === "string") {
    return {
      idPengajar: "",
      namaPengajar: p.trim() ? p : "-",
    };
  }

  return {
    idPengajar: "",
    namaPengajar: "-",
  };
}

export const toMatakuliah = (e: MatakuliahEntity): Matakuliah => {
  const pj = parsePengajar(e.pengajar);

  return {
    id: e.id,
    kodeMatkul: e.kodeMatkul,
    namaMatkul: e.namaMatkul,
    sks: e.sks,
    kelas: e.kelas,
    status: e.status,
    idPeriode: "",
    namaPeriode: e.periode ?? "-",
    idPengajar: pj.idPengajar,
    namaPengajar: pj.namaPengajar,
    idMahasiswa: [],
    deskripsi: e.deskripsi ?? undefined,
  };
};

export const toMatakuliahTableRow = (m: Matakuliah): MatakuliahTableRow => ({
  id: m.id,
  kodeMatkul: m.kodeMatkul,
  namaMatkul: m.namaMatkul,
  sks: m.sks,
  kelas: m.kelas,
  status: m.status === "aktif" ? "Aktif" : "Tidak Aktif",
  namaPeriode: m.namaPeriode || "-",
  namaPengajar: m.namaPengajar || "-",
  deskripsi: m.deskripsi,
});