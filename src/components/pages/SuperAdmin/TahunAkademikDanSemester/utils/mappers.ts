import type {
  TahunAkademikDanSemesterEntity,
  TahunAkademikDanSemesterTableRow,
  StatusTahunAkademikFE,
} from "../types/tahun-akademik-dan-semester";

const toStatusFE = (
  s: TahunAkademikDanSemesterEntity["status"],
): StatusTahunAkademikFE => (s === "aktif" ? "Aktif" : "Non Aktif");

const fmt = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const toTahunAkademikDanSemesterTableRow = (
  t: TahunAkademikDanSemesterEntity,
): TahunAkademikDanSemesterTableRow => ({
  id: String(t.id ?? (t as any)._id ?? ""),
  periode: t.periode,
  startDate: fmt(t.startDate),
  endDate: fmt(t.endDate),
  status: toStatusFE(t.status),
});
