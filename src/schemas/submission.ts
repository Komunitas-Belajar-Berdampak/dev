import z from "zod";

export const submissionSchema = z.object({
  file: z
    .instanceof(File, { message: "File wajib dipilih" })
    .refine((f) => f.size <= 10 * 1024 * 1024, "Ukuran file maksimal 10MB")
    .refine(
      (f) => ["image/jpeg", "image/png", "application/pdf"].includes(f.type),
      "Format file harus JPG, PNG, atau PDF",
    ),
});

export type SubmissionFormType = z.infer<typeof submissionSchema>;
