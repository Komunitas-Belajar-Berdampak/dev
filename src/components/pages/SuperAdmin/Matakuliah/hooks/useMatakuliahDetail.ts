import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MatakuliahService } from "../services/matakuliah.service";
import type { MatakuliahEntity } from "../types/matakuliah";

export function useMatakuliahDetail(id?: string) {
  const query = useQuery({
    queryKey: ["course", id],
    queryFn: () => MatakuliahService.getMatakuliahById(id!),
    enabled: !!id,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const detail = useMemo(() => {
    return (query.data ?? null) as MatakuliahEntity | null;
  }, [query.data]);

  const pengajar = useMemo(() => {
    const p: any = (detail as any)?.pengajar;

    if (Array.isArray(p)) {
      return p
        .map((x) => ({
          id: String(x?.id ?? x?._id ?? "").trim(),
          nama: String(x?.nama ?? x?.label ?? "").trim(),
        }))
        .filter((x) => x.id || x.nama);
    }

    if (typeof p === "string") {
      const nama = p.trim();
      return nama ? [{ id: "", nama }] : [];
    }

    return [];
  }, [detail]);

  return useMemo(
    () => ({
      detail,
      pengajar,
      loading: query.isLoading,
      error: query.error
        ? (query.error as any)?.response?.data?.message ??
          (query.error as any)?.message ??
          "Gagal mengambil detail matakuliah"
        : null,
      refetch: query.refetch,
      isFetching: query.isFetching,
    }),
    [detail, pengajar, query.isLoading, query.error, query.refetch, query.isFetching],
  );
}