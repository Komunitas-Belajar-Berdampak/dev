import z from "zod";

export const createPrivateFileSchema = z.object({
  filePath: z.string().min(1, "File path is required"),
  fileSize: z.string().min(1, "File size is required"), // e.g. "1.9 MB"
  status: z.enum(["VISIBLE", "PRIVATE"]),
  tipe: z.string().min(1, "File type is required"), // e.g. "application/pdf"
});

export const editPrivateFileSchema = z.object({
  status: z.enum(["VISIBLE", "PRIVATE"]),
});

export type CreatePrivateFileType = z.infer<typeof createPrivateFileSchema>;
export type EditPrivateFileType = z.infer<typeof editPrivateFileSchema>;
