export type StatusPeriode = "aktif" | "tidak aktif";

export interface TahunAkademikDanSemester {
  id: string;
  periode: string;
  startDate?: string;
  endDate?: string;
  status: StatusPeriode;
}
