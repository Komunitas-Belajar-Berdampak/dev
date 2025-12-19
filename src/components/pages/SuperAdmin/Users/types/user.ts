// === BACKEND-LIKE ENTITY (nanti dari API) ===
export type UserStatusBE = "aktif" | "tidak aktif";
export type JenisKelamin = "pria" | "wanita";

export interface UserEntity {
  _id: string;
  nrp: string;
  nama: string;
  angkatan?: string;
  idProdi: string;        // ObjectId (string di frontend)
  email: string;
  alamat?: string;
  jenisKelamin: JenisKelamin;
  status: UserStatusBE;
  roleId: string[];       // ObjectId role
  fotoProfil?: string;
}

// === FRONTEND TABLE (UI FRIENDLY) ===
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
