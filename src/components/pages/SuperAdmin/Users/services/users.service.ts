import { api } from "@/lib/axios";
import type { CreateUserPayload, UpdateUserPayload, UserEntity } from "../types/user";

function normalizeUsers(payload: any): UserEntity[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
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
    const res = await api.get(`/users/${id}`);
    return (res.data?.data ?? res.data) as any;
  },

  async createUser(payload: CreateUserPayload) {
    const res = await api.post<any>("/users", payload);
    return res.data?.data ?? res.data;
  },

  async updateUser(id: string, payload: UpdateUserPayload) {
    const res = await api.put(`/users/${id}`, payload);
    return (res.data?.data ?? res.data) as any;
  },

  async deleteUser(id: string) {
    const res = await api.delete<any>(`/users/${id}`);
    return res.data?.data ?? res.data;
  },
};
