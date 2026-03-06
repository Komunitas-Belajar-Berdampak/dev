import type { JSONContent } from '@tiptap/react';
import { z } from 'zod';

const hasMeaningfulContent = (node: JSONContent | undefined): boolean => {
  if (!node) return false;

  if (node.type === 'text') {
    return typeof node.text === 'string' && node.text.trim().length > 0;
  }

  if (node.type === 'image' || node.type === 'imageUpload' || node.type === 'horizontalRule') {
    return true;
  }

  return (node.content ?? []).some((child) => hasMeaningfulContent(child));
};

export const postSchema = z.object({
  konten: z
    .custom<JSONContent>((value) => typeof value === 'object' && value !== null, {
      message: 'Konten tidak valid.',
    })
    .refine((value) => (value as JSONContent | undefined)?.type === 'doc', {
      message: 'Konten tidak valid.',
    })
    .refine((value) => hasMeaningfulContent(value as JSONContent), {
      message: '*Konten tidak boleh kosong.',
    }),
});

export type PostSchemaType = z.infer<typeof postSchema>;
