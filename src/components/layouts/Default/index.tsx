import ChangePasswordModal from '@/components/pages/Dosen/components/ChangePasswordModal';
import AppSidebar from '@/components/shared/AppSidebar';
import Header from '@/components/shared/Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { useDefaultPasswordPrompt } from '@/hooks/use-default-password-prompt';
import { Outlet } from 'react-router-dom';
import AuthBootstrap from '../Auth/AuthBoostrap';

const DefaultLayout = () => {
  const { user, showChangePassword, handlePasswordChanged } = useDefaultPasswordPrompt();

  return (
    <>
      <AuthBootstrap />
      {user && <ChangePasswordModal open={showChangePassword} nrp={user.nrp} userName={user.nama} onSuccess={handlePasswordChanged} />}
      <SidebarProvider>
        <div className='flex min-h-screen w-full'>
          {/* SIDEBAR */}
          <AppSidebar />

          {/* MAIN CONTENT */}
          <main className='flex-1 min-w-0 flex flex-col min-h-screen bg-background'>
            <Header />

            <div
              className='
              flex-1
              w-full
              min-w-0
              px-4 sm:px-6 lg:px-8
              py-4 sm:py-6
            '
            >
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
      <Toaster position='bottom-right' />
    </>
  );
};

export default DefaultLayout;
