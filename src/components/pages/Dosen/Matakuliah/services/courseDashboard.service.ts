import { api } from "@/lib/axios";

export type ProgressTugasItem = {
  id: string;
  nama: string;
  selesai: number;
  total: number;
};

export type KontribusiMingguanItem = {
  minggu: number;
  submitted: number;
  total: number;
};

export type HeatmapItem = {
  nama: string;
  data: number[];
};

export type ScatterItem = {
  x: number;
  y: number;
  nama: string;
};

export type CourseDashboardData = {
  totalMahasiswa: number;
  totalPertemuan: number;
  progressTugas: ProgressTugasItem[];
  kontribusiMingguan: KontribusiMingguanItem[];
  heatmap: HeatmapItem[];
  donut: { selesai: number; terlambat: number; belum: number };
  scatter: ScatterItem[];
};

export type MahasiswaTugasItem = {
  id: string;
  nama: string;
  selesai: number;
  total: number;
};

export type TimelineItem = {
  jam: string;
  jumlah: number;
};

export type MeetingDashboardData = {
  pertemuan: number;
  totalMahasiswa: number;
  donut: { tepat: number; terlambat: number; belum: number };
  mahasiswaTugas: MahasiswaTugasItem[];
  timeline: TimelineItem[];
  perbandingan: {
    labels: string[];
    sebelumnya: number[];
    sekarang: number[];
  } | null;
};

export const CourseDashboardService = {
  async getCourseDashboard(idCourse: string): Promise<CourseDashboardData> {
    const res = await api.get<any>(`/course-dashboard/${idCourse}`);
    return res.data?.data ?? res.data;
  },

  async getMeetingDashboard(idCourse: string, pertemuan: number | string): Promise<MeetingDashboardData> {
    const res = await api.get<any>(`/course-dashboard/${idCourse}/pertemuan/${pertemuan}`);
    return res.data?.data ?? res.data;
  },
};