import { z } from 'zod';

export const taskSchema = z.object({
  task: z.string().min(1, 'Task tidak boleh kosong'),
  idMahasiswa: z.array(z.string()).min(1, 'Pilih minimal satu mahasiswa'),
  status: z.enum(['DO', 'IN PROGRESS', 'DONE'], 'Status tidak valid'),
  description: z.string().optional(),
});

export const taskUpdateSchema = z.object({
  task: z.string().min(1, 'Task tidak boleh kosong').optional(),
  idMahasiswa: z.array(z.string()).min(1, 'Pilih minimal satu mahasiswa').optional(),
  status: z.enum(['DO', 'IN PROGRESS', 'DONE'], 'Status tidak valid').optional(),
  description: z.string().optional(),
});

export type TaskUpdateSchemaType = z.infer<typeof taskUpdateSchema>;
export type TaskSchemaType = z.infer<typeof taskSchema>;
