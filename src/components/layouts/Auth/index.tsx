import { Toaster } from '@/components/ui/sonner';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <main className='min-h-screen w-screen bg-secondary'>
      <Toaster position='top-right' id='auth' />
      <Outlet />
    </main>
  );
};

export default AuthLayout;
