import z from "zod";

export const createPrivateFileSchema = z.object({
  file: z.instanceof(File, { message: "File wajib disertakan" }),
  status: z.enum(["VISIBLE", "PRIVATE"]),
});

export const editPrivateFileSchema = z.object({
  status: z.enum(["VISIBLE", "PRIVATE"]),
});

export type CreatePrivateFileType = z.output<typeof createPrivateFileSchema>;
export type EditPrivateFileType = z.infer<typeof editPrivateFileSchema>;
