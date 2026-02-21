import { useQuery } from "@tanstack/react-query";
import { AssignmentService } from "../services/assignment.service";

export function useAssignmentsByCourse(idCourse?: string) {
  return useQuery({
    queryKey: ["assignments-by-course", idCourse],
    queryFn: () => AssignmentService.getAssignmentsByCourse(idCourse as string),
    enabled: !!idCourse,
  });
}