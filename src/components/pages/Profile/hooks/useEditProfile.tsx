import { updateProfile } from "@/api/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useEditProfile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, data, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(data?.message || "Profile updated successfully", {
        toasterId: "global",
      });
      navigate("/profile");
    },
    onError: (error) => {
      console.error(error);
      toast.error(data?.message || "Failed to update profile", {
        toasterId: "global",
      });
    },
  });
  return { mutate, data, isPending };
};

export default useEditProfile;
