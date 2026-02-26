import z from "zod";

export const updateProfileSchema = z
  .object({
    nama: z
      .string()
      .min(3, "Nama minimal harus terdiri dari 3 karakter")
      .max(100, "Nama maksimal 100 karakter")
      .optional(),
    alamat: z.string().min(3, "Alamat minimal 3 karakter").optional(),
    passwordLama: z
      .string()
      .optional()
      .transform((v) => (v === "" ? undefined : v))
      .pipe(
        z
          .string()
          .min(8, "Password minimal terdiri dari 8 karakter")
          .optional(),
      ),
    passwordBaru: z
      .string()
      .optional()
      .transform((v) => (v === "" ? undefined : v))
      .pipe(
        z
          .string()
          .min(8, "Password minimal terdiri dari 8 karakter")
          .optional(),
      ),
    fotoProfil: z.any().optional(),
  })
  .refine(
    (data) => {
      // If changing password, both fields are required
      if (data.passwordBaru && !data.passwordLama) return false;
      if (data.passwordLama && !data.passwordBaru) return false;
      return true;
    },
    {
      message: "Kedua field password harus diisi untuk mengubah password",
      path: ["passwordLama"],
    },
  );

export type updateProfile = z.infer<typeof updateProfileSchema>;
