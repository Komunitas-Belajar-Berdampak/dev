import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Submission } from "@/types/submission";

// {{base_url}}/api/submissions/:idAssignment
export const getSubmissionById = async (
  assignmentId: string,
): Promise<ApiResponse<Submission>> => {
  const res = await api.get<ApiResponse<Submission>>(
    `/submissions/${assignmentId}`,
  );
  return res.data;
};

// api/submission.ts
export const postSubmission = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post<ApiResponse<Submission>>(
    `/submissions/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res.data;
};

export const updateSubmission = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.patch<ApiResponse<Submission>>(
    `/submissions/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res.data;
};
