import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { UsersService } from "../../Users/services/users.service";
import type { UserEntity } from "../../Users/types/user";

function norm(v: unknown) {
  return String(v ?? "").toLowerCase().trim();
}

function pickUserId(u: any): string {
  const id = String(u?.id ?? u?._id ?? "").trim();
  if (!id || id === "undefined" || id === "null") return "";
  return id;
}

export function useDosenOptions() {
  const q = useQuery({
    queryKey: ["users", "dosen"],
    queryFn: () => UsersService.getUsers(),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const users = (q.data ?? []) as UserEntity[];

  const dosen = useMemo(() => {
    return users.filter((u: any) => {
      const r = norm(u.role);
      return r === "dosen" || r.includes("dosen");
    });
  }, [users]);

  const options = useMemo(() => {
    return dosen
      .map((u: any) => {
        const id = pickUserId(u);
        if (!id) return null;

        const nama = String(u.nama ?? "").trim();
        const nrp = String(u.nrp ?? "").trim();
        const label = nama ? (nrp ? `${nama} (${nrp})` : nama) : (nrp ? nrp : id);

        return { id, label };
      })
      .filter(Boolean) as { id: string; label: string }[];
  }, [dosen]);

  return useMemo(
    () => ({
      dosen,
      options,
      loading: q.isLoading,
      error: q.error
        ? (q.error as any)?.response?.data?.message ??
          (q.error as any)?.message ??
          "Gagal memuat data dosen"
        : null,
    }),
    [dosen, options, q.isLoading, q.error],
  );
}
