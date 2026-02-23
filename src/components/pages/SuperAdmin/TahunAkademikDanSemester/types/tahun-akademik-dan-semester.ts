export type StatusTahunAkademikBE = "aktif" | "tidak aktif";
export type StatusTahunAkademikFE = "Aktif" | "Non Aktif";

export type SemesterType = "Ganjil" | "Genap";

export interface TahunAkademikDanSemesterEntity {
  id: string;
  _id?: string;
  periode: string;
  semesterType: SemesterType;
  semesters: number[];
  startDate: string;
  endDate: string;
  status: StatusTahunAkademikBE;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface TahunAkademikDanSemesterTableRow {
  id: string;
  periode: string;
  semesterType: SemesterType;
  startDate: string;
  endDate: string;
  status: StatusTahunAkademikFE;
}