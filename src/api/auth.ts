import { api } from '@/lib/axios';
import type { LoginResponse, MeResponse } from '@/types/auth';

const login = async (nrp: string, password: string) => {
  const res = await api.post<LoginResponse>('/auth/login', { nrp, password });
  return res.data;
};

const me = async () => {
  const res = await api.get<MeResponse>('/auth/me');
  return res.data;
};

const logout = async () => {
  await api.post('/auth/logout');
};

export { login, logout, me };
