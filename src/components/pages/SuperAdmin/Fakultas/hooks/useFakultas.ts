import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FakultasService } from "../services/fakultas.service";
import type { FakultasEntity } from "../types/fakultas";

export function useFakultas() {
  const query = useQuery({
    queryKey: ["fakultas"],
    queryFn: () => FakultasService.getFakultas(),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const fakultas = (query.data ?? []) as FakultasEntity[];

  return useMemo(
    () => ({
      fakultas,
      loading: query.isLoading,
      error: query.error
        ? (query.error as any)?.response?.data?.message ??
          (query.error as any)?.message ??
          "Gagal mengambil data fakultas"
        : null,
      refetch: query.refetch,
      isFetching: query.isFetching,
    }),
    [fakultas, query.isLoading, query.error, query.refetch, query.isFetching],
  );
}
