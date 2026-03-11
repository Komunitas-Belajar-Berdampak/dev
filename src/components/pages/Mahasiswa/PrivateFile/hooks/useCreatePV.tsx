import { createPrivateFile } from "@/api/private-file";
import type { CreatePrivateFileType } from "@/schemas/private-file";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useCreatePV = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, mutate, isPending } = useMutation({
    mutationFn: (payload: CreatePrivateFileType) => createPrivateFile(payload),
    onSuccess: () => {
      toast.success(data?.message || "Private file berhasil dibuat!");
      qc.invalidateQueries({ queryKey: ["private-file"] });
      navigate("/mahasiswa/private-file");
    },
    onError: () => {
      toast.error(data?.message || "Gagal membuat private file!");
    },
  });
  return { mutate, isPending };
};

export default useCreatePV;
