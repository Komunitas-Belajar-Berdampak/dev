import { deletePrivateFile } from "@/api/private-file";
import type { PrivateFile } from "@/types/private-file";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useDeletePV = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deletePrivateFile(id),

    onMutate: async (deletedId) => {
      await qc.cancelQueries({ queryKey: ["private-file"] });

      // Snapshot ALL pages
      const previousQueries = qc.getQueriesData({ queryKey: ["private-file"] });

      // Update ALL cached pages optimistically
      qc.setQueriesData<{ data: PrivateFile[] }>(
        { queryKey: ["private-file"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((f) => f.id !== deletedId),
          };
        },
      );

      return { previousQueries };
    },

    onSuccess: () => {
      toast.success("Private file berhasil dihapus!");
      qc.invalidateQueries({ queryKey: ["private-file"] }); // sync with server
      navigate("/mahasiswa/private-file");
    },

    onError: (error: any, _id, context: any) => {
      // Restore ALL pages
      context?.previousQueries.forEach(([queryKey, data]: [any, any]) => {
        qc.setQueryData(queryKey, data);
      });
      toast.error(error?.message || "Gagal menghapus private file!");
    },
  });

  return { mutate, isPending };
};

export default useDeletePV;
