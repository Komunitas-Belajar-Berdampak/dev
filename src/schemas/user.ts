import { z } from 'zod';

export const userSchema = z.object({
  nrp: z.string().min(1, 'NRP tidak boleh kosong'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/, 'Password harus mengandung huruf besar, huruf kecil, angka, dan simbol'),
});

export type UserSchemaType = z.infer<typeof userSchema>;
