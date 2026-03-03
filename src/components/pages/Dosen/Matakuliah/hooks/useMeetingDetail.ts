import { useEffect, useMemo, useState } from "react";
import { MeetingService, type MeetingEntity } from "../services/meeting.service";

type UseMeetingDetailState = {
  data: MeetingEntity | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useMeetingDetail(
  pertemuanId?: string,
  idCourse?: string
): UseMeetingDetailState {
  const [data, setData] = useState<MeetingEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetcher = async () => {
    if (!pertemuanId || !idCourse) {
      setData(null);
      setError("Parameter pertemuan atau idCourse tidak tersedia.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const meetings = await MeetingService.getMeetingsByCourseId(idCourse);

      const found = meetings.find((m) => m.id === pertemuanId) ?? null;

      if (!found) {
        setError("Pertemuan tidak ditemukan.");
        setData(null);
      } else {
        setData(found);
      }
    } catch (e: any) {
      setData(null);
      setError(
        e?.response?.data?.message ??
          e?.message ??
          "Gagal mengambil detail pertemuan."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetcher();
  }, [pertemuanId, idCourse]);

  return useMemo(
    () => ({ data, isLoading, error, refetch: fetcher }),
    [data, isLoading, error]
  );
}