import { editPost, getPostById } from '@/api/thread-post';
import PostEditor from '@/components/pages/Dosen/StudyGroup/AddPost/components/PostEditor';
import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldError, FieldGroup, FieldSet } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { postSchema, type PostSchemaType } from '@/schemas/post';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { JSONContent } from '@tiptap/react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type EditPostContentProps = {
  idPost: string;
  idTopik: string;
};

const EditPostContent = ({ idPost, idTopik }: EditPostContentProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['post-by-id', idPost],
    queryFn: () => getPostById(idPost),
    enabled: Boolean(idPost),
    select: (res) => res.data,
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

  useEffect(() => {
    const konten = post?.konten;
    if (!konten) return;
    form.reset({ konten });
  }, [form, post?.konten]);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: PostSchemaType) => editPost(idPost, payload),
    onSuccess: async () => {
      toast.success('Discussion berhasil diedit!', { toasterId: 'global' });
      await Promise.all([queryClient.invalidateQueries({ queryKey: ['post-by-id', idPost] }), queryClient.invalidateQueries({ queryKey: ['threads-by-id', idTopik] })]);
      navigate(-1);
    },
    onError: () => {
      toast.error('Gagal mengedit discussion!', { toasterId: 'global' });
    },
  });

  const onSubmit = (data: PostSchemaType) => {
    mutate(data);
  };

  useEffect(() => {
    if (!isError) return;
    toast.error(error?.message || 'Gagal mengambil data discussion.', { toasterId: 'global' });
  }, [error?.message, isError]);

  if (isLoading) {
    return (
      <div className='py-6 space-y-4'>
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-64 w-full' />
      </div>
    );
  }

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
              {isPending ? 'Saving...' : 'Save'}
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

export default EditPostContent;
