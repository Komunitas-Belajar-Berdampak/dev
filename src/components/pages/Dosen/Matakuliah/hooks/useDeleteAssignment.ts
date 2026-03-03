import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AssignmentService } from "../services/assignment.service";

export function useDeleteAssignment(idCourse?: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (idAssignment: string) => AssignmentService.deleteAssignment(idAssignment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assignments-by-course", idCourse] });
    },
  });
}