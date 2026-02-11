import { z } from 'zod';

export const studyGroupSchema = z
  .object({
    nama: z.string().min(3, 'Nama study group tidak boleh kosong'),
    kapasitas: z.number().min(1, 'Kapasitas minimal adalah 1'),
    deskripsi: z.string().optional(),
    status: z.boolean(),
    idMahasiswa: z.array(z.string()).optional(),
  })
  .superRefine((values, ctx) => {
    const selected = values.idMahasiswa ?? [];
    if (selected.length <= values.kapasitas) return;

    ctx.addIssue({
      code: 'custom',
      path: ['idMahasiswa'],
      message: `Jumlah anggota tidak boleh melebihi kapasitas (${values.kapasitas}).`,
    });
  });

export type StudyGroupSchemaType = z.infer<typeof studyGroupSchema>;
