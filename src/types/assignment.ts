export type Assignment = {
  id: string;
  pertemuan: number;
  judul: string;
  status: "HIDE" | "VISIBLE";
  statusTugas: boolean;
  statusTenggat: boolean;
  tenggat: string;
};
