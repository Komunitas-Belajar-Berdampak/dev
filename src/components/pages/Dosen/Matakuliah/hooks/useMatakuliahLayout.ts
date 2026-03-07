import { useEffect, useMemo, useState } from "react";
import type { DosenCourse } from "../types";
import { MatakuliahService } from "@/components/pages/SuperAdmin/Matakuliah/services/matakuliah.service";

type UseCoursesState = {
  data: DosenCourse[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function parseDeskripsi(raw: unknown): string | null {
  if (!raw) return null;

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    return trimmed || null;
  }

  if (typeof raw === "object") {
    const content = (raw as Record<string, unknown>)?.content;
    if (typeof content === "string") {
      const stripped = content.replace(/<[^>]*>/g, "").trim();
      return stripped || null;
    }
  }

  return null;
}

function mapToDosenCourse(raw: any): DosenCourse {
  const pengajar =
    Array.isArray(raw?.pengajar)
      ? raw.pengajar
          .map((p: any) => p?.nama)
          .filter(Boolean)
          .join(", ")
      : typeof raw?.pengajar === "object" && raw?.pengajar !== null
        ? String(raw.pengajar?.nama ?? "")
        : String(raw?.pengajar ?? "");

  return {
    id: raw.id,
    kodeMatkul: raw.kodeMatkul,
    namaMatkul: raw.namaMatkul,
    sks: Number(raw.sks),
    status: raw.status,
    periode: raw.periode,
    deskripsi: parseDeskripsi(raw.deskripsi),
    pengajar,
    kelas: raw.kelas,
  };
}

export function useCourses(): UseCoursesState {
  const [data, setData] = useState<DosenCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetcher = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const list = await MatakuliahService.getMatakuliah();
      setData(list.map(mapToDosenCourse));
    } catch (e: any) {
      setData([]);
      setError(
        e?.response?.data?.message ||
        e?.message ||
        "Gagal mengambil data courses."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetcher();
  }, []);

  return useMemo(
    () => ({ data, isLoading, error, refetch: fetcher }),
    [data, isLoading, error]
  );
}