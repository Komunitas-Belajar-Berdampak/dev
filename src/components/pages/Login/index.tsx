import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useIsDesktop } from '@/hooks/use-desktop';
import { CircleDashed, TriangleAlertIcon } from 'lucide-react';
import { Activity, useEffect } from 'react';
import { toast } from 'sonner';

const Login = () => {
  const isDesktop = useIsDesktop();

  useEffect(() => {
    toast.error('Error test', { toasterId: 'auth', richColors: true });
  }, []);

  return (
    <div className='h-screen container mx-auto p-10 flex items-center justify-center gap-20 relative text-primary'>
      <Activity mode={isDesktop ? 'visible' : 'hidden'}>
        <div className='bg-tertiary size-140 rounded-xl flex items-center justify-center'>
          <CircleDashed className='size-80 p-10 text-white' name='Login Illustration' />
        </div>
      </Activity>
      <div className='w-full max-w-xl'>
        <h1 className='font-bold text-4xl leading-normal '>Masuk</h1>
        <p className='font-semibold text-sm '>Selamat datang di LMS Komunitas Belajar Berdampak!</p>

        <form className='mt-4'>
          <FieldSet>
            <FieldGroup className='gap-5'>
              <Field>
                <FieldLabel htmlFor='nrp' className='text-gray-800'>
                  NRP
                </FieldLabel>
                <Input id='nrp' type='text' placeholder='Masukkan NRP Anda' required />
                {/* <FieldError className='text-xs'>*NRP harus diisi</FieldError> */}
              </Field>
              <Field>
                <FieldLabel htmlFor='password' className='text-gray-800'>
                  Password
                </FieldLabel>
                <Input id='password' type='password' placeholder='Masukkan Password Anda' required />
                {/* <FieldError className='text-xs'>*Password harus diisi</FieldError> */}
              </Field>
            </FieldGroup>

            <Button type='submit' className='w-full'>
              Login
            </Button>
          </FieldSet>
        </form>

        <div className='w-full border border-gray-400 rounded-lg p-2 mt-12 flex gap-4'>
          <TriangleAlertIcon className='size-4 mt-1 ms-1' />
          <div className='flex flex-col justify-start gap-2 items-start'>
            <p className='font-semibold text-sm'>Tidak bisa Login?</p>
            <p className='text-xs'>Hubungi admin atau email ke admin@example.com untuk bantuan.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
