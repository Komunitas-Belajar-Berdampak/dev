import type { UserEntity, UserStatusFE, UserTableRow } from "../types/user";

export const statusToFE = (s: UserEntity["status"]): UserStatusFE =>
  s === "aktif" ? "Aktif" : "Non Aktif";

export const toUserTableRow = (u: UserEntity): UserTableRow => ({
  id: u._id,
  nrp: u.nrp,
  nama: u.nama,
  angkatan: u.angkatan ?? "-",
  prodi: u.prodi ?? "-",
  status: statusToFE(u.status),
  role: u.role,
});
