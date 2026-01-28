import type { Role } from '@/types/role';

export const roleHomePath = (role: Role) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return '/admin';
    case 'DOSEN':
      return '/dosen';
    case 'MAHASISWA':
      return '/mahasiswa';
    default:
      return '/auth/login';
  }
};
