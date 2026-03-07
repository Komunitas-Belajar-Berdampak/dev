import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

export type MahasiswaOption = {
  id: string;
  label: string;
};

function normalizeMahasiswa(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

export function useMahasiswaOptions() {
  const [options, setOptions] = useState<MahasiswaOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    api
      .get<any>("/users", { params: { role: "mahasiswa", limit: 1000, page: 1 } })
      .then((res) => {
        if (cancelled) return;

        console.log("[useMahasiswaOptions] raw response:", res.data);
        const list = normalizeMahasiswa(res.data);
        console.log("[useMahasiswaOptions] normalized list:", list);

        const mapped: MahasiswaOption[] = list
          .map((m: any) => {
            const id = String(m?.id ?? m?._id ?? "").trim();
            const nim = String(m?.nim ?? m?.nrp ?? m?.nip ?? "").trim();
            const nama = String(m?.nama ?? m?.name ?? "").trim();
            const label = nim && nama ? `${nim} – ${nama}` : nama || nim || id;
            return { id, label };
          })
          .filter((m) => m.id);

        console.log("[useMahasiswaOptions] mapped options:", mapped);
        setOptions(mapped);
      })
      .catch((err) => {
        console.error("[useMahasiswaOptions] error:", err);
        if (!cancelled) setOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { options, loading };
}