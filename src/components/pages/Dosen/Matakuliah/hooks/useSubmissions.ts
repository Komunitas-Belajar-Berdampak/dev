import { useQuery } from "@tanstack/react-query";
import { SubmissionService } from "../services/submission.service";

export function useSubmissions(idAssignment?: string) {
  return useQuery({
    queryKey: ["submissions", idAssignment],
    queryFn: () => SubmissionService.getAll(idAssignment as string),
    enabled: !!idAssignment,
  });
}