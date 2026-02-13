import { z } from 'zod';

export const threadSchema = z.object({
  judul: z.string().min(3, 'Judul tidak boleh kosong'),
  idAssignment: z.string().min(1, 'Assignment harus dipilih'),
});

export type ThreadSchemaType = z.infer<typeof threadSchema>;
