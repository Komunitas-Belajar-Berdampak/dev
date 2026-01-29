import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MatakuliahService } from "../services/matakuliah.service";
import type { Matakuliah, MatakuliahEntity } from "../types/matakuliah";
import { toMatakuliah } from "../utils/mappers";

export function useMatakuliah() {
  const query = useQuery({
    queryKey: ["courses"],
    queryFn: () => MatakuliahService.getMatakuliah(),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const matakuliah: Matakuliah[] = useMemo(() => {
    const entities = (query.data ?? []) as MatakuliahEntity[];
    return entities.map(toMatakuliah);
  }, [query.data]);

  return useMemo(
    () => ({
      matakuliah,
      loading: query.isLoading,
      error: query.error
        ? (query.error as any)?.response?.data?.message ??
          (query.error as any)?.message ??
          "Gagal mengambil data matakuliah"
        : null,
      refetch: query.refetch,
      isFetching: query.isFetching,
    }),
    [matakuliah, query.isLoading, query.error, query.refetch, query.isFetching],
  );
}
