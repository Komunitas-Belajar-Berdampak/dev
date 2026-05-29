export type Submission = {
  file: string;
  grade?: string | null;
  gradeAt?: string | null;
  id: string;
  submittedAt: string;
  isLate?: boolean;
  comment?: string | null;
};
