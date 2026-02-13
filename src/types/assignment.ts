export type Assignment = {
  id: string;
  pertemuan: number;
  judul: string;
  status: 'HIDE' | 'VISIBLE';
  statusTenggat: boolean;
  tenggat: string;
};
