import { api } from "@/lib/axios";

export type DashboardStats = {
  totalUser: number;
  totalMahasiswa: number;
  totalDosen: number;
  totalAdmin: number;
  totalUserPerRole: { role: string; total: number }[];
  statusUser: { aktif: number; tidakAktif: number };
  totalMatakuliah: number;
  totalFakultas: number;
  periodeAktif: {
    id: string;
    periode: string;
    semesterType: string | null;
    startDate: string | null;
    endDate: string | null;
  } | null;
};

export const DashboardService = {
  async getStats(): Promise<DashboardStats> {
    const res = await api.get<any>("/dashboard/stats");
    return res.data?.data ?? res.data;
  },
};