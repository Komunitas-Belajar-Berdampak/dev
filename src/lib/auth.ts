import type { Role } from '@/types/role';

export const getCurrentUserRole = (): Role => {
  return 'admin'; // ganti: 'dosen' | 'mahasiswa'
};
