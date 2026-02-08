export type UserStatusBE = "aktif" | "tidak aktif";
export type JenisKelamin = "pria" | "wanita";

export type RoleKey = "SUPER_ADMIN" | "ADMIN" | "DOSEN" | "MAHASISWA";

export interface UserEntity {
  _id: string;
  nrp: string;
  nama: string;
  angkatan: string | null;
  idProdi: string | null;
  prodi: string | null;
  status: UserStatusBE;
  role: string;
  fotoProfil?: string | null;
  email?: string;
  alamat?: string | null;
  jenisKelamin?: JenisKelamin;
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

export interface CreateUserPayload {
  nrp: string;
  idRole: string;
  idProdi: string;
  nama: string;
  angkatan: string;
  email: string;
  alamat?: string;
  jenisKelamin: JenisKelamin;
  status: UserStatusBE;
  password: string;
  fotoProfil?: string;
}

export interface UpdateUserPayload {
  idRole?: string;
  idProdi?: string;
  nama?: string;
  angkatan?: string;
  email?: string;
  alamat?: string;
  jenisKelamin?: JenisKelamin;
  status?: UserStatusBE;
  fotoProfil?: string;
}

