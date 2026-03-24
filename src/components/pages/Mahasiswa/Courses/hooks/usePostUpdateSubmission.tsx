import { postSubmission, updateSubmission } from "@/api/submission";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const usePostUpdateSubmission = (
  hasSubmission: boolean,
  tugasId: string,
  onSuccess: () => void, // ← was setSelectedFile before
) => {
  const queryClient = useQueryClient();
  const { mutate: submitTugas, isPending } = useMutation({
    mutationFn: async (file: File) => {
      if (hasSubmission) {
        return await updateSubmission(tugasId, file);
      } else {
        return await postSubmission(tugasId, file);
      }
    },
    onSuccess: () => {
      toast.success(
        hasSubmission
          ? "Submission berhasil diubah!"
          : "Tugas berhasil dikumpulkan!",
      );
      queryClient.invalidateQueries({ queryKey: ["submission", tugasId] });
      onSuccess(); // ← calls form.setValue("file", undefined)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Gagal mengumpulkan tugas.");
    },
  });

  return { submitTugas, isPending };
};

export default usePostUpdateSubmission;
