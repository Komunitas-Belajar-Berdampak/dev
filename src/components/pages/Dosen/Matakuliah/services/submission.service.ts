import { api } from "@/lib/axios";

export type SubmissionItem = {
  id: string;
  mahasiswa: {
    id: string;
    nrp: string;
    nama: string;
  };
  submittedAt: string;
  file: string;
  grade: number | null;
  gradeAt: string | null;
};

export type SubmissionSummary = {
  totalMahasiswa: number;
  telahSubmit: number;
  butuhPenilaian: number;
  tenggat: string;
  tugasJudul: string;
};

export const SubmissionService = {
  // GET /api/submissions/{idAssignment}/summary (dummy — sesuaikan kalau BE ready)
  async getSummary(idAssignment: string): Promise<SubmissionSummary> {
    const res = await api.get<any>(`/submissions/${idAssignment}/summary`);
    const d = res.data?.data ?? res.data;
    return {
      totalMahasiswa: d.totalMahasiswa ?? 0,
      telahSubmit: d.telahSubmit ?? 0,
      butuhPenilaian: d.butuhPenilaian ?? 0,
      tenggat: d.tenggat ?? "",
      tugasJudul: d.tugasJudul ?? "",
    };
  },

  // GET /api/submissions/{idAssignment}/all
  async getAll(idAssignment: string): Promise<SubmissionItem[]> {
    const res = await api.get<any>(`/submissions/${idAssignment}/all`);
    const payload = res.data;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload)) return payload;
    return [];
  },

  // PATCH /api/submissions/assignments/{idAssignment}/submissions/{idSubmission}/grade
  async updateGrade(
    idAssignment: string,
    idSubmission: string,
    nilai: number
  ): Promise<void> {
    await api.patch(
      `/submissions/assignments/${idAssignment}/submissions/${idSubmission}/grade`,
      {
        nilai,
        gradeAt: new Date().toISOString(),
      }
    );
  },
};