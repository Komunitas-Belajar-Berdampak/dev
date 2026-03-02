import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeskripsiService } from "../services/deskripsi.service";
import { useMatakuliahDetail } from "./useMatakuliahDetail";

export function useDeskripsi(id?: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useMatakuliahDetail(id);

  const mutation = useMutation({
    mutationFn: (deskripsi: string) =>
      DeskripsiService.updateDeskripsi(id!, deskripsi),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matakuliah", id] });
    },
  });

  async function save(htmlContent: string) {
    await mutation.mutateAsync(htmlContent);
  }

  return {
    data,
    isLoading,
    error,
    isSaving: mutation.isPending,
    isError: mutation.isError,
    save,
  };
}