import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { FakultasService } from "../../Fakultas/services/fakultas.service";

type FakultasLike = {
  _id?: string;
  id?: string;
  namaFakultas?: string;
  nama?: string;
  kodeFakultas?: string;
};

async function fetchFakultas(): Promise<FakultasLike[]> {
  const svc: any = FakultasService;

  const candidates = [
    "getFakultas",
    "getFaculties",
    "getFakultasList",
    "listFakultas",
    "fetchFakultas",
  ];

  for (const name of candidates) {
    const fn = svc?.[name];
    if (typeof fn === "function") {
      const res = await fn.call(svc);

      // normalisasi response (biar aman)
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.data?.data)) return res.data.data;
      if (Array.isArray(res?.items)) return res.items;
      return [];
    }
  }

  throw new Error(
    `FakultasService tidak punya method fetch yang dikenal. Tambahkan salah satu: ${candidates.join(
      ", ",
    )}`,
  );
}

export function useFakultasOptions() {
  const q = useQuery({
    queryKey: ["fakultas"],
    queryFn: fetchFakultas,
    staleTime: 5 * 60 * 1000,
  });

  const fakultas = (q.data ?? []) as FakultasLike[];

  const options = useMemo(
    () =>
      fakultas
        .map((f) => ({
          id: String(f._id ?? f.id ?? ""),
          label: String(f.namaFakultas ?? f.nama ?? "-"),
        }))
        .filter((x) => x.id && x.label && x.label !== "-"),
    [fakultas],
  );

  return {
    fakultas,
    options,
    loading: q.isLoading,
    error: q.error
      ? (q.error as any)?.response?.data?.message ??
        (q.error as any)?.message ??
        "Gagal memuat fakultas"
      : null,
  };
}
