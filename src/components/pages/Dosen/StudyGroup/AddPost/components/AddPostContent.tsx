import { addPost } from '@/api/thread-post';
import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldError, FieldGroup, FieldSet } from '@/components/ui/field';
import { postSchema, type PostSchemaType } from '@/schemas/post';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { JSONContent } from '@tiptap/react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PostEditor from './PostEditor';

type AddPostContentProps = {
  idTopik: string;
};

const AddPostContent = ({ idTopik }: AddPostContentProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: PostSchemaType) => addPost(idTopik, payload),
    onSuccess: async () => {
      toast.success('Discussion baru berhasil ditambahkan!', { toasterId: 'global' });
      form.reset();

      await queryClient.invalidateQueries({ queryKey: ['threads-by-id', idTopik] });
      navigate(-1);
    },
    onError: () => {
      toast.error('Gagal menambahkan discussion!', { toasterId: 'global' });
    },
  });

  const form = useForm<PostSchemaType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      konten: {
        type: 'doc',
        content: [{ type: 'paragraph' }],
      } satisfies JSONContent,
    },
  });

  const onSubmit = (data: PostSchemaType) => {
    mutate(data);
  };

  return (
    <div className='py-6'>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FieldSet>
          <FieldGroup>
            <Controller
              name='konten'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <PostEditor value={field.value as JSONContent} onChange={field.onChange} disabled={isPending} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className='text-xs' />}
                  </FieldContent>
                </Field>
              )}
            />
          </FieldGroup>

          <Field orientation={'horizontal'} className='flex w-full justify-end gap-4'>
            <Button type='submit' size={'lg'} className='mt-6 shadow-sm' disabled={isPending}>
              {isPending ? 'Posting...' : 'Post Discussion'}
            </Button>

            <Button variant={'secondary'} size={'lg'} type='button' className='mt-6 shadow-sm border bg-accent hover:opacity-85' onClick={() => navigate(-1)} disabled={isPending}>
              Cancel
            </Button>
          </Field>
        </FieldSet>
      </form>
    </div>
  );
};

export default AddPostContent;
