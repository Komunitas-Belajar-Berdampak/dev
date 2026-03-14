import { api } from "@/lib/axios";
import type {
  CreatePrivateFileType,
  EditPrivateFileType,
} from "@/schemas/private-file";
import type { ApiResponse } from "@/types/api";
import type { PrivateFile } from "@/types/private-file";

export const getPrivateFiles = async ({
  page,
  // limit,
}: {
  page?: number;
  // limit?: number;
}) => {
  const res = await api.get<ApiResponse<PrivateFile[]>>("/private-files", {
    params: {
      ...(page && { page }),
      // ...(limit && { limit }),
    },
  });
  return res.data;
};

export const createPrivateFile = async (payload: CreatePrivateFileType) => {
  const formData = new FormData();
  formData.append("file", payload.file);
  if (payload.status) {
    formData.append("status", payload.status);
  }
  const res = await api.post<ApiResponse<PrivateFile>>(
    "/private-files",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return res.data;
};

export const deletePrivateFile = async (id: string) => {
  const res = await api.delete<ApiResponse<null>>(`/private-files/${id}`);
  return res.data;
};

export const editPrivateFile = async (
  id: string,
  payload: EditPrivateFileType,
) => {
  const res = await api.patch<ApiResponse<null>>(
    `/private-files/${id}`,
    payload,
  );
  return res.data;
};
