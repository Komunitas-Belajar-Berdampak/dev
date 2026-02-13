import { useEffect, useMemo, useState } from "react";
import { MeetingService, type MeetingEntity } from "../services/meeting.service";

type UseMeetingsState = {
  data: MeetingEntity[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useMeetingsByCourse(courseId?: string): UseMeetingsState {
  const [data, setData] = useState<MeetingEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetcher = async () => {
    if (!courseId) {
      setData([]);
      setError("ID course tidak ada.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const meetings = await MeetingService.getMeetingsByCourseId(courseId);
      const sorted = [...meetings].sort(
        (a, b) => a.pertemuan - b.pertemuan
        );
      setData(sorted);
    } catch (e: any) {
      setData([]);
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Gagal mengambil data pertemuan."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetcher();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  return useMemo(
    () => ({ data, isLoading, error, refetch: fetcher }),
    [data, isLoading, error]
  );
}
