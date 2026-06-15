import PostEditor from '@/components/pages/Dosen/StudyGroup/AddPost/components/PostEditor';
import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldError, FieldGroup, FieldSet } from '@/components/ui/field';
import type { PostSchemaType } from '@/schemas/post';
import type { ThreadDetail } from '@/types/thread-post';
import type { JSONContent } from '@tiptap/react';
import { X } from 'lucide-react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import ParentPostPreview from './ParentPostPreview';
import { formatMessageTime, toParentPostPreview } from './utils';

type ReplyComposerProps = {
  replyToPost: ThreadDetail;
  form: UseFormReturn<PostSchemaType>;
  onSubmit: (values: PostSchemaType) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isImageUploading: boolean;
};

const ReplyComposer = ({ replyToPost, form, onSubmit, onCancel, isSubmitting, isImageUploading }: ReplyComposerProps) => {
  return (
    <form onSubmit={form.handleSubmit((values) => onSubmit(values))} className='sticky bottom-4 z-30 mt-6 rounded-xl border border-primary/25 bg-white/95 p-3 shadow-lg shadow-primary/10 backdrop-blur md:p-4'>
      <div className='mb-3 flex items-start justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <p className='mb-2 text-xs font-semibold text-primary md:text-sm'>
            Replying to {replyToPost.author.nama} <span className='font-normal text-accent'>- {formatMessageTime(replyToPost.createdAt)}</span>
          </p>
          <ParentPostPreview parentPost={toParentPostPreview(replyToPost)} className='bg-secondary/70' />
        </div>
        <Button type='button' variant='ghost' size='icon-sm' onClick={onCancel} aria-label='Cancel reply' disabled={isSubmitting}>
          <X className='size-4 text-primary' />
        </Button>
      </div>

      <FieldSet>
        <FieldGroup>
          <Controller
            name='konten'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <PostEditor value={field.value as JSONContent} onChange={field.onChange} disabled={isSubmitting} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} className='text-xs' />}
                </FieldContent>
              </Field>
            )}
          />
        </FieldGroup>

        <div className='mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
          <Button type='button' variant='secondary' className='border bg-accent shadow-sm hover:opacity-85' onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type='submit' className='shadow-sm' disabled={isSubmitting || isImageUploading}>
            {isSubmitting ? 'Posting...' : isImageUploading ? 'Uploading image...' : 'Post Reply'}
          </Button>
        </div>
      </FieldSet>
    </form>
  );
};

export default ReplyComposer;
