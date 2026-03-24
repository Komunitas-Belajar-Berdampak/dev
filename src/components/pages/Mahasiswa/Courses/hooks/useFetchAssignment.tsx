import { getAssignmentsByCourse } from "@/api/assignment";
import { useQuery } from "@tanstack/react-query";

const useFetchAssignment = (tugasId: string, idCourse: string) => {
  // fetch assignment detail
  const { data: assignment, isPending: assignmentLoading } = useQuery({
    queryKey: ["assignment", tugasId],
    queryFn: async () => {
      const res = await getAssignmentsByCourse(idCourse as string);
      const payload = res.data.find((a) => a.id === tugasId);
      return payload;
    },
    enabled: !!tugasId,
  });
  return { assignment, assignmentLoading };
};

export default useFetchAssignment;
