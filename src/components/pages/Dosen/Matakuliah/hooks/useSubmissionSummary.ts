import { useQuery } from "@tanstack/react-query";
import { SubmissionService } from "../services/submission.service";

export function useSubmissionSummary(idAssignment?: string) {
  return useQuery({
    queryKey: ["submission-summary", idAssignment],
    queryFn: () => SubmissionService.getSummary(idAssignment as string),
    enabled: !!idAssignment,
  });
}