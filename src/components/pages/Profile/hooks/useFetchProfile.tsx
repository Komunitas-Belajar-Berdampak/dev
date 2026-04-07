import { getUserById } from "@/api/profile";
import { getUser } from "@/lib/authStorage";
import { useQuery } from "@tanstack/react-query";

export const useFetchProfile = (id?: string) => {
  const user = getUser();
  const profileId = id ? id : (user?.id as string);

  const { data: userData, isPending } = useQuery({
    queryKey: ["profile", profileId],
    queryFn: () => getUserById(profileId),
  });

  const data = userData?.data;

  return { data, isPending };
};
