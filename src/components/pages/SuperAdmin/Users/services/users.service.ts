import { api } from "@/lib/axios";
import type { UserEntity } from "../types/user";

function normalizeUsers(payload: any): UserEntity[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.users)) return payload.users;
  return [];
}

export const UsersService = {
  async getUsers() {
    const res = await api.get<any>("/users");
    return normalizeUsers(res.data);
  },

  async getUserById(id: string) {
    const res = await api.get<UserEntity>(`/users/${id}`);
    return res.data;
  },

  async createUser(payload: Partial<UserEntity>) {
    const res = await api.post(`/users`, payload);
    return res.data;
  },

  async updateUser(id: string, payload: Partial<UserEntity>) {
    const res = await api.put(`/users/${id}`, payload);
    return res.data;
  },

  async deleteUser(id: string) {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};
