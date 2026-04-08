import { getUserByNrp } from "@/api/profile";
import { getUser } from "@/lib/authStorage";
import { useQuery } from "@tanstack/react-query";

export const useFetchProfile = (id?: string) => {
  const user = getUser();
  const profileId = id ? id : (user?.nrp as string);

  const { data: userData, isPending } = useQuery({
    queryKey: ["profile", profileId],
    queryFn: () => getUserByNrp(profileId),
  });

  const data = userData?.data;

  return { data, isPending };
};
