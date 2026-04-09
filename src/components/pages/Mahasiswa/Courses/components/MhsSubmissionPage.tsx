import { useMeetingDetail } from '@/components/pages/Dosen/Matakuliah/hooks/useMeetingDetail';
import Title from '@/components/shared/Title';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { formatDate } from '@/lib/utils';
import { submissionSchema, type SubmissionFormType } from '@/schemas/submission';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import useFetchAssignment from '../hooks/useFetchAssignment';
import useFetchSubmission from '../hooks/useFetchSubmission';
import usePostUpdateSubmission from '../hooks/usePostUpdateSubmission';
import { FilePreviewModalMhs } from './FilePreviewModalMhs';

const MhsSubmissionPage = () => {
  const {
    idMatkul: idCourse,
    idMeeting,
    idAssignment: tugasId,
  } = useParams<{
    idMatkul: string;
    idMeeting: string;
    idAssignment: string;
  }>();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [openFileModal, setOpenFileModal] = useState(false);

  const form = useForm<SubmissionFormType>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const selectedFile = form.watch('file');

  const { data: pertemuan } = useMeetingDetail(idMeeting, idCourse);
  const { submission, submissionLoading } = useFetchSubmission(tugasId as string);
  const { assignment } = useFetchAssignment(tugasId as string, idCourse as string);

  const hasSubmission = !!submission?.id;
  const isPastDeadline = assignment?.tenggat ? new Date() > new Date(assignment.tenggat) : false;

  const { submitTugas, isPending } = usePostUpdateSubmission(hasSubmission, tugasId as string, () => form.setValue('file', undefined as any));

  const handleSubmit = form.handleSubmit((values) => {
    submitTugas(values.file);
  });

  const breadcrumbItems = [
    { label: 'Courses', href: '/mahasiswa/courses' },
    {
      label: pertemuan?.judul ?? 'Detail Matakuliah',
      href: `/mahasiswa/courses/${idCourse}`,
    },
    {
      label: `Pertemuan ${pertemuan?.pertemuan}`,
      href: `/mahasiswa/courses/${idCourse}/meeting/${idMeeting}`,
    },
    {
      label: assignment?.judul ?? 'Submit Tugas',
      href: `/mahasiswa/courses/${idCourse}/meeting/${idMeeting}/submission/${tugasId}`,
    },
  ];

  return (
    <div className='space-y-6'>
      <Title title={assignment?.judul ?? 'Submit Tugas'} items={breadcrumbItems} />

      {/* Assignment Info */}
      <div className='rounded-2xl border-2 border-black bg-white shadow-[5px_5px_0_0_#000] overflow-hidden'>
        <div className='bg-blue-900 px-6 py-4 text-center'>
          <h2 className='text-xl font-bold text-white'>{assignment?.judul ?? '...'}</h2>
        </div>
        <div className='px-6 py-4 flex flex-col gap-2 text-sm'>
          {assignment?.tenggat && (
            <div className='flex items-center gap-2'>
              <Icon icon='mdi:clock-outline' className='text-blue-900 shrink-0' />
              <span className='text-gray-500'>Due:</span>
              <span className={`font-medium ${isPastDeadline ? 'text-red-600' : 'text-blue-900'}`}>
                {formatDate(assignment.tenggat)}
                {isPastDeadline && ' (Lewat tenggat)'}
              </span>
            </div>
          )}
          {assignment?.statusTugas !== undefined && (
            <div className='flex items-center gap-2'>
              <Icon icon='mdi:account-group-outline' className='text-blue-900 shrink-0' />
              <span className='text-gray-500'>Tipe:</span>
              <span className='font-medium text-blue-900'>{assignment.statusTugas ? 'Kelompok' : 'Individu'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Existing Submission */}
      {!submissionLoading && hasSubmission && (
        <div className='rounded-2xl border-2 border-green-500 bg-green-50 shadow-[4px_4px_0_0_#22c55e] px-6 py-4 flex items-center gap-4'>
          <div className='w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0'>
            <Icon icon='mdi:check' className='text-white text-xl' />
          </div>
          <div className='flex-1'>
            <p className='font-semibold text-green-800'>Tugas sudah dikumpulkan</p>
            <p className='text-xs text-green-700'>Dikumpulkan: {formatDate(submission?.submittedAt)}</p>
            {submission?.grade !== null && submission?.grade !== undefined && <p className='text-xs text-green-700 font-medium'>Nilai: {submission?.grade}</p>}
          </div>
          {submission?.file && (
            <button onClick={() => setOpenFileModal(true)} className='text-sm text-green-700 hover:underline flex items-center gap-1'>
              <Icon icon='mdi:file-outline' />
              Lihat file
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Upload Area */}
        {!isPastDeadline ? (
          <Controller
            control={form.control}
            name='file'
            render={({ fieldState }) => (
              <Field>
                <FieldLabel className='font-semibold text-blue-900'>
                  {hasSubmission ? 'Ubah Submission' : 'Upload Submission'}
                  <span className='text-red-500'>*</span>
                </FieldLabel>

                <div
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) form.setValue('file', file, { shouldValidate: true });
                  }}
                  className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center gap-3 transition-colors ${
                    isDragging ? 'border-blue-900 bg-blue-50' : selectedFile ? 'border-green-500 bg-green-50' : 'border-black bg-white hover:bg-gray-50'
                  }`}
                >
                  <Icon icon={selectedFile ? 'mdi:file-check-outline' : 'mdi:cloud-upload-outline'} className={`text-5xl ${selectedFile ? 'text-green-600' : 'text-blue-900'}`} />

                  {selectedFile ? (
                    <>
                      <p className='font-semibold text-green-700'>{selectedFile.name}</p>
                      <p className='text-xs text-gray-500'>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button
                        type='button'
                        onClick={(e) => {
                          e.stopPropagation();
                          form.setValue('file', undefined as any, {
                            shouldValidate: true,
                          });
                          if (inputRef.current) inputRef.current.value = '';
                        }}
                        className='text-xs text-red-500 hover:underline'
                      >
                        Hapus
                      </button>
                    </>
                  ) : (
                    <>
                      <p className='font-medium text-blue-900'>Pilih file atau drag and drop di sini</p>
                      <p className='text-xs text-gray-400'>JPG, PNG, PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, CSV, ZIP — maks. 50MB</p>
                      <Button type='button' variant='outline' className='border-2 border-black bg-white text-black shadow-[3px_3px_0_0_#000] hover:bg-blue-900 hover:text-white transition'>
                        Select File
                      </Button>
                    </>
                  )}

                  <input
                    ref={inputRef}
                    type='file'
                    accept='.jpg,.jpeg,.png,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.xlsm,.xlsb,.csv,.zip'
                    className='hidden'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) form.setValue('file', file, { shouldValidate: true });
                    }}
                  />
                </div>

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        ) : (
          <div className='rounded-2xl border-2 border-red-300 bg-red-50 px-6 py-4 flex items-center gap-3'>
            <Icon icon='mdi:lock-outline' className='text-red-500 text-xl shrink-0' />
            <p className='text-sm text-red-600 font-medium'>Tenggat waktu sudah lewat. Pengumpulan tugas tidak dapat dilakukan.</p>
          </div>
        )}

        {/* Actions */}
        <div className='flex items-center justify-between'>
          <Button variant='outline' type='button' onClick={() => navigate(-1)} className='border-2 border-black shadow-[3px_3px_0_0_#000]'>
            Kembali
          </Button>

          {!isPastDeadline && (
            <Button type='submit' disabled={!selectedFile || isPending} className='bg-blue-900 text-white shadow-[3px_3px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed'>
              {isPending ? (
                <span className='flex items-center gap-2'>
                  <Icon icon='mdi:loading' className='animate-spin' />
                  Mengumpulkan...
                </span>
              ) : hasSubmission ? (
                'Update Submission'
              ) : (
                'Kumpulkan Tugas'
              )}
            </Button>
          )}
        </div>
      </form>
      {openFileModal && submission?.file && <FilePreviewModalMhs open={openFileModal} onOpenChange={setOpenFileModal} file={submission?.file || ''} />}
    </div>
  );
};

export default MhsSubmissionPage;
