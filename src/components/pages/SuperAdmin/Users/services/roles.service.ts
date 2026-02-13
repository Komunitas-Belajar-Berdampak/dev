import { api } from "@/lib/axios";

export type RoleEntity = {
  id: string;
  nama: string;
};

function normalizeRoles(raw: any): RoleEntity[] {
  const arr =
    raw?.data?.data ??
    raw?.data ??
    raw ??
    [];

  if (!Array.isArray(arr)) return [];

  return arr.map((r: any) => ({
    id: String(r.id ?? r._id ?? ""),
    nama: String(r.nama ?? r.name ?? r.role ?? ""),
  })).filter((r: RoleEntity) => r.id && r.nama);
}

export const RolesService = {
  async getRoles(): Promise<RoleEntity[]> {
    const res = await api.get("/roles");
    return normalizeRoles(res.data);
  },
};
