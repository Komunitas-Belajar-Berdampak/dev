import { getUserById } from "@/api/profile";
import { getUser } from "@/lib/authStorage";
import { useQuery } from "@tanstack/react-query";

export const useFetchProfile = () => {
  const user = getUser();

  const { data: userData, isPending } = useQuery({
    queryKey: ["profile", user?.id as string],
    queryFn: () => getUserById(user?.id as string),
  });

  const data = userData?.data;

  return { data, isPending };
};
