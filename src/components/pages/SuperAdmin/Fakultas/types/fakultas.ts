export interface ProdiRingkas {
  id: string;
  kodeProdi: string;
  namaProdi: string;
}

export interface FakultasEntity {
  id: string;
  namaFakultas: string;
  kodeFakultas: string | null;
  prodi: ProdiRingkas[];
}

export interface FakultasTableRow {
  id: string;
  kodeFakultas: string;
  namaFakultas: string;
  programStudi: string[];
}

export type UpdateFakultasPayload = {
  kodeFakultas?: string;
  namaFakultas?: string;
};

