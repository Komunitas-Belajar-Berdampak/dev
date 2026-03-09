import { useState } from "react";
import { MeetingService } from "../services/meeting.service";

export function useUpdateMeeting() {
  const [loading, setLoading] = useState(false);

  const updateMeeting = async (idPertemuan: string, judul: string) => {
    setLoading(true);
    try {
      return await MeetingService.updateMeeting(idPertemuan, { judul });
    } finally {
      setLoading(false);
    }
  };

  return { updateMeeting, loading };
}