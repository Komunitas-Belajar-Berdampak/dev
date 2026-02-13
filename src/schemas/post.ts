import type { JSONContent } from '@tiptap/react';
import { z } from 'zod';

export const postSchema = z.object({
  konten: z
    .custom<JSONContent>((value) => typeof value === 'object' && value !== null, {
      message: 'Konten tidak valid.',
    })
    .refine((value) => (value as JSONContent | undefined)?.type === 'doc', {
      message: 'Konten tidak valid.',
    }),
});

export type PostSchemaType = z.infer<typeof postSchema>;
