import { useQuery } from "@tanstack/react-query";
import { SubmissionService } from "../services/submission.service";

export function useSubmissions(idAssignment?: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: ["submissions", idAssignment, page, limit],
    queryFn: () =>
      SubmissionService.getAll(idAssignment as string, page, limit),
    enabled: !!idAssignment,
    placeholderData: (prev) => prev, // keep previous page data while fetching next
  });
}