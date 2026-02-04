import { z } from 'zod';

export const studyGroupSchema = z.object({
  nama: z.string().min(3, 'Nama study group tidak boleh kosong'),
  kapasitas: z.number().min(1, 'Kapasitas minimal adalah 1'),
  deskripsi: z.string().optional(),
  status: z.boolean(),
  anggota: z.array(z.string()).optional(),
});

export type StudyGroupSchemaType = z.infer<typeof studyGroupSchema>;
