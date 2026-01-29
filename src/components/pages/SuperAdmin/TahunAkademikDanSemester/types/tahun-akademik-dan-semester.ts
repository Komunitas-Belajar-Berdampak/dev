export type StatusTahunAkademikBE = "aktif" | "tidak aktif";
export type StatusTahunAkademikFE = "Aktif" | "Non Aktif";

export interface TahunAkademikDanSemesterEntity {
  _id: string;
  periode: string;
  startDate: string;
  endDate: string;
  status: StatusTahunAkademikBE;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TahunAkademikDanSemesterTableRow {
  id: string;
  periode: string;
  startDate: string;
  endDate: string;
  status: StatusTahunAkademikFE;
}
