import { getSubmissionById } from "@/api/submission";
import { useQuery } from "@tanstack/react-query";

const useFetchSubmission = (tugasId: string) => {
  // fetch existing submission
  const { data: submission, isLoading: submissionLoading } = useQuery({
    queryKey: ["submission", tugasId],
    queryFn: async () => {
      const res = await getSubmissionById(tugasId as string);
      return res.data;
    },
    enabled: !!tugasId,
  });
  return { submission, submissionLoading };
};

export default useFetchSubmission;
