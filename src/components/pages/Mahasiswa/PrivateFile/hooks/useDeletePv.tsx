import { deletePrivateFile } from "@/api/private-file";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useDeletePV = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, mutate, isPending } = useMutation({
    mutationFn: (payload: string) => deletePrivateFile(payload),
    onSuccess: () => {
      console.log(data);
      toast.success(data?.message || "Private file berhasil dihapus!");
      qc.invalidateQueries({ queryKey: ["private-file"] });
      navigate("/mahasiswa/private-file");
    },
    onError: () => {
      toast.error(data?.message || "Gagal menghapus private file!");
    },
  });
  return { mutate, isPending };
};

export default useDeletePV;
