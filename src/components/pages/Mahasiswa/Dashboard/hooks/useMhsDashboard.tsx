import { getMhsDashboard } from "@/api/dashboard";
import { useQuery } from "@tanstack/react-query";

const useMhsDashboard = () => {
  const { data, isPending } = useQuery({
    queryKey: ["mhs-dashboard"],
    queryFn: getMhsDashboard,
  });
  return { data, isPending };
};

export default useMhsDashboard;
