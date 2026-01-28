import type { FakultasEntity, FakultasTableRow } from "../types/fakultas";

export const toFakultasTableRow = (f: FakultasEntity): FakultasTableRow => ({
  id: f.id,
  kodeFakultas: f.kodeFakultas ?? "-",
  namaFakultas: f.namaFakultas,
  programStudi: (f.prodi ?? []).map((p) => p.namaProdi),
});
