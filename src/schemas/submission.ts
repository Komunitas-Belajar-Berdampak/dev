import z from "zod";

const ACCEPTED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".xlsm",
  ".xlsb",
  ".csv",
  ".zip",
];

export const submissionSchema = z.object({
  file: z
    .instanceof(File, { message: "File wajib dipilih" })
    .refine((f) => f.size <= 50 * 1024 * 1024, "Ukuran file maksimal 50MB")
    .refine(
      (f) =>
        ACCEPTED_EXTENSIONS.some((ext) => f.name.toLowerCase().endsWith(ext)),
      "Format file tidak didukung",
    ),
});

export type SubmissionFormType = z.infer<typeof submissionSchema>;
