import { editPrivateFile } from "@/api/private-file";
import type { EditPrivateFileType } from "@/schemas/private-file";
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
  const { data, mutate, isPending } = useMutation({
    mutationFn: ({ id, payload }: editPVParams) => editPrivateFile(id, payload),
    onSuccess: () => {
      console.log(data);
      toast.success(data?.message || "Private file berhasil diperbarui!");
      qc.invalidateQueries({ queryKey: ["private-file"] });
      navigate("/mahasiswa/private-file");
    },
    onError: () => {
      toast.error(data?.message || "Gagal memperbarui private file!");
    },
  });
  return { mutate, isPending };
};

export default useEditPV;
