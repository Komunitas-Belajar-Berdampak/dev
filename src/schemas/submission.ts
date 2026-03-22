import z from "zod";

export const submissionSchema = z.object({
  file: z
    .instanceof(File, { message: "File wajib dipilih" })
    .refine((f) => f.size <= 50 * 1024 * 1024, "Ukuran file maksimal 50MB")
    .refine(
      (f) =>
        [
          "image/jpeg",
          "image/png",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "application/zip",
        ].includes(f.type),
      "Format file tidak didukung",
    ),
});

export type SubmissionFormType = z.infer<typeof submissionSchema>;
