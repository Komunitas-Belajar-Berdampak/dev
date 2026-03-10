import { updateProfile } from "@/api/profile";
import { createLearningApproach, updateLearningApproach } from "@/api/approach";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { updateProfile as updateProfileType } from "@/schemas/profile";

type editProfileType = {
  payload: updateProfileType;
  gayaBelajarExists: boolean;
};

const useEditProfile = (userId: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, data, isPending } = useMutation({
    mutationFn: async ({ payload, gayaBelajarExists }: editProfileType) => {
      const { gayaBelajar, ...profilePayload } = payload;

      await Promise.all([
        updateProfile(profilePayload),
        gayaBelajar && gayaBelajarExists
          ? updateLearningApproach(userId, { gayaBelajar })
          : createLearningApproach(userId, { gayaBelajar }),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully", { toasterId: "global" });
      navigate("/profile");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update profile", { toasterId: "global" });
    },
  });

  return { mutate, data, isPending };
};

export default useEditProfile;
