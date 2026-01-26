import { login } from '@/api/auth';
import Announcement from '@/components/shared/Announcement';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useIsDesktop } from '@/hooks/use-desktop';
import { setToken, setUser } from '@/lib/authStorage';
import { roleHomePath } from '@/lib/homepath';
import { userSchema, type UserSchemaType } from '@/schemas/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CircleDashed } from 'lucide-react';
import { Activity } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Login = () => {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();

  const form = useForm<UserSchemaType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nrp: '',
      password: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: UserSchemaType) => login(payload.nrp, payload.password),
    onSuccess: (data) => {
      const { token, user } = data.data;

      console.log(user.namaRole);
      setToken(token);
      setUser(user);

      toast.success('Login berhasil', { toasterId: 'auth' });
      form.reset();

      navigate(roleHomePath(user.namaRole), { replace: true });
    },
    onError: () => {
      toast.error('Login gagal', { toasterId: 'auth' });
    },
  });

  const onSubmit = (data: UserSchemaType) => {
    mutate(data);
  };

  return (
    <div className='h-screen container mx-auto p-10 flex items-center justify-center gap-20 relative text-primary'>
      {/* bagian kiri */}
      <Activity mode={isDesktop ? 'visible' : 'hidden'}>
        <div className='bg-tertiary lg:size-120 xl:size-130 rounded-xl flex items-center justify-center'>
          <CircleDashed className='size-80 p-10 text-white' name='Login Illustration' />
        </div>
      </Activity>

      {/* bagian kanan */}
      <div className='w-full max-w-md xl:max-w-xl'>
        <h1 className='font-bold text-4xl leading-normal'>Masuk</h1>
        <p className='font-semibold text-sm '>Selamat datang di LMS Komunitas Belajar Berdampak!</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4'>
          <FieldSet>
            <FieldGroup className='gap-5'>
              <Controller
                name='nrp'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className='text-gray-800'>
                      NRP
                    </FieldLabel>
                    <Input {...field} id={field.name} aria-invalid={fieldState.invalid} type='text' placeholder='Masukkan NRP Anda' className='text-xs md:text-sm text-black' />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className='text-xs' />}
                  </Field>
                )}
              />

              <Controller
                name='password'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className='text-gray-800'>
                      Password
                    </FieldLabel>
                    <Input {...field} className='text-xs md:text-sm text-black' id={field.name} aria-invalid={fieldState.invalid} type='password' placeholder='Masukkan Password Anda' required />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className='text-xs' />}
                  </Field>
                )}
              />
            </FieldGroup>
            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? 'Logging in...' : 'Login'}
            </Button>
          </FieldSet>
        </form>

        <Announcement />
      </div>
    </div>
  );
};

export default Login;
