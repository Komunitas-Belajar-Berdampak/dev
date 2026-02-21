import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AssignmentService, type CreateAssignmentPayload } from "../services/assignment.service";

export function useCreateAssignment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (vars: {
      idCourse: string;
      pertemuan: number;
      payload: CreateAssignmentPayload;
    }) => {
      return AssignmentService.createAssignmentByCourseMeeting(
        vars.idCourse,
        vars.pertemuan,
        vars.payload
      );
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["assignments-by-course", vars.idCourse] });
    },
  });
}