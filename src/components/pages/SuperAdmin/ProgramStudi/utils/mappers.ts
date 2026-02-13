import type { ProgramStudiEntity, ProgramStudiTableRow } from "../types/program-studi";

export const toProgramStudiTableRow = (p: ProgramStudiEntity): ProgramStudiTableRow => ({
  id: p.id,
  kodeProdi: p.kodeProdi,
  namaProdi: p.namaProdi,
  namaFakultas: p.namaFakultas ?? "-",
});
