import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { TahunAkademikDanSemesterService } from "../services/tahun-akademik-dan-semester.service";
import type { TahunAkademikDanSemesterEntity } from "../types/tahun-akademik-dan-semester";

export function useTahunAkademikDanSemester() {
  const query = useQuery({
    queryKey: ["academic-terms"],
    queryFn: () => TahunAkademikDanSemesterService.getAll(),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const data = (query.data ?? []) as TahunAkademikDanSemesterEntity[];

  return useMemo(
    () => ({
      academicTerms: data,
      loading: query.isLoading,
      error: query.error
        ? (query.error as any)?.response?.data?.message ??
          (query.error as any)?.message ??
          "Gagal mengambil data tahun akademik & semester"
        : null,
      refetch: query.refetch,
      isFetching: query.isFetching,
    }),
    [data, query.isLoading, query.error, query.refetch, query.isFetching],
  );
}
