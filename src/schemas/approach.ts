import z from "zod";

export const updateApproachSchema = z.object({
  gayaBelajar: z
    .array(z.string())
    .min(1, "Pilih minimal satu gaya belajar")
    .optional(),
});

export type updateApproachType = z.infer<typeof updateApproachSchema>;
