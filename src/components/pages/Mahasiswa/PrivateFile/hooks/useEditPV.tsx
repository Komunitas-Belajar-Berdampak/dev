import { editPrivateFile } from "@/api/private-file";
import type { EditPrivateFileType } from "@/schemas/private-file";
import type { PrivateFile } from "@/types/private-file";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type editPVParams = {
  id: string;
  payload: EditPrivateFileType;
};

const useEditPV = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, payload }: editPVParams) => editPrivateFile(id, payload),

    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: ["private-file"] });

      const previousQueries = qc.getQueriesData({ queryKey: ["private-file"] });

      qc.setQueriesData<{ data: PrivateFile[] }>(
        { queryKey: ["private-file"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((f) =>
              f.id === id ? { ...f, status: payload.status } : f,
            ),
          };
        },
      );

      return { previousQueries };
    },

    onSuccess: () => {
      toast.success("Private file berhasil diperbarui!");
      qc.invalidateQueries({ queryKey: ["private-file"] });
      navigate("/mahasiswa/private-file");
    },

    onError: (error: any, _payload, context: any) => {
      context?.previousQueries.forEach(([queryKey, data]: [any, any]) => {
        qc.setQueryData(queryKey, data);
      });
      toast.error(error?.message || "Gagal memperbarui private file!");
    },
  });

  return { mutate, isPending };
};

export default useEditPV;
