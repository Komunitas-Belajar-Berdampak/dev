import { getMhsGrade } from "@/api/grade";
import { useQuery } from "@tanstack/react-query";

const useMhsGrade = () => {
  const { data, isPending } = useQuery({
    queryKey: ["mhs-grades"],
    queryFn: getMhsGrade,
  });
  return { data, isPending };
};

export default useMhsGrade;
