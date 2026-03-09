import type { Role } from './role';

export type AuthUser = {
  id: string;
  nrp: string;
  nama: string;
  namaRole: Role;
  isDefaultPassword: boolean;
};

export type LoginResponse = {
  data: { token: string; user: AuthUser };
};

export type MeResponse = {
  user: AuthUser;
};
