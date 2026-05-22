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
  comment: string | null;
};

export type SubmissionSummary = {
  totalMahasiswa: number;
  telahSubmit: number;
  butuhPenilaian: number;
  tenggat: string;
  tugasJudul: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
};

export type SubmissionListResponse = {
  data: SubmissionItem[];
  pagination: PaginationMeta;
};

export const SubmissionService = {
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

  async getAll(
    idAssignment: string,
    page = 1,
    limit = 10
  ): Promise<SubmissionListResponse> {
    const res = await api.get<any>(`/submissions/${idAssignment}/all`, {
      params: { page, limit },
    });
    const payload = res.data;
    return {
      data: Array.isArray(payload?.data) ? payload.data : [],
      pagination: payload?.pagination ?? {
        page,
        limit,
        total_items: 0,
        total_pages: 1,
      },
    };
  },

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

  async updateComment(
    idAssignment: string,
    idSubmission: string,
    comment: string | null
  ): Promise<void> {
    await api.patch(
      `/submissions/assignments/${idAssignment}/submissions/${idSubmission}/comment`,
      { comment }
    );
  },
};