import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { TahunAkademikDanSemesterService } from "../services/tahun-akademik-dan-semester.service";

export function useTahunAkademikDanSemesterById(id: string) {
  const query = useQuery({
    queryKey: ["academic-term-by-id", id],
    queryFn: () => TahunAkademikDanSemesterService.getById(id),
    enabled: !!id,
    staleTime: 15_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return useMemo(
    () => ({
      data: query.data ?? null,
      loading: query.isLoading,
      error: query.error
        ? (query.error as any)?.response?.data?.message ??
          (query.error as any)?.message ??
          "Gagal mengambil detail tahun akademik"
        : null,
      refetch: query.refetch,
      isFetching: query.isFetching,
    }),
    [query.data, query.isLoading, query.error, query.refetch, query.isFetching],
  );
}