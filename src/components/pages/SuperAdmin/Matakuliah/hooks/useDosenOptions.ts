import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { UsersService } from "../../Users/services/users.service";
import type { UserEntity } from "../../Users/types/user";

function norm(v: unknown) {
  return String(v ?? "").toLowerCase().trim();
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
    return users.filter((u) => {
      const r = norm(u.role);
      // aman untuk variasi "DOSEN", "Dosen", "dosen"
      return r === "dosen" || r.includes("dosen");
    });
  }, [users]);

  const options = useMemo(
    () =>
      dosen
        .map((u) => ({
          id: String(u._id),
          label: `${u.nama} (${u.nrp})`,
        }))
        .filter((x) => x.id),
    [dosen],
  );

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
