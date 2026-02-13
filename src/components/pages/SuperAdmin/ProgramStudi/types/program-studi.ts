export interface ProgramStudiEntity {
  id: string;
  kodeProdi: string;
  namaProdi: string;
  namaFakultas: string | null;
}

export interface ProgramStudiTableRow {
  id: string;
  kodeProdi: string;
  namaProdi: string;
  namaFakultas: string;
}
