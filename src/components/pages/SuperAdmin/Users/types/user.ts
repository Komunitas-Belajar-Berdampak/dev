export type UserStatusBE = "aktif" | "tidak aktif";
export type JenisKelamin = "pria" | "wanita";

export interface UserEntity {
  _id: string;
  nrp: string;
  nama: string;
  angkatan: string | null;
  idProdi: string | null;
  prodi: string | null;
  email: string;
  alamat?: string;
  jenisKelamin: JenisKelamin;
  status: UserStatusBE;
  roleIds: string[];
  role: string;
  fotoProfil?: string | null;
}

export type UserStatusFE = "Aktif" | "Non Aktif";

export interface UserTableRow {
  id: string;
  nrp: string;
  nama: string;
  angkatan: string;
  prodi: string;
  status: UserStatusFE;
  role: string;
}
