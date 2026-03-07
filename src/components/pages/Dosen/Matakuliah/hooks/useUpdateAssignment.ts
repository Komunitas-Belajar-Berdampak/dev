import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AssignmentService, type UpdateAssignmentPayload } from "../services/assignment.service";

export function useUpdateAssignment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { idAssignment: string; payload: UpdateAssignmentPayload }) =>
      AssignmentService.updateAssignment(vars.idAssignment, vars.payload),
    onSuccess: (_data, ctx: any) => {
      qc.invalidateQueries({ queryKey: ["assignments-by-course", ctx?.idCourse] });
    },
  });
}