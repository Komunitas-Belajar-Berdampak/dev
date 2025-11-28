import AppSidebar from '@/components/shared/AppSidebar';
import Header from '@/components/shared/Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';

const DefaultLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className='flex-1 min-h-screen'>
        <Header />

        <div className='py-5 px-5 md:px-12 container'>
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default DefaultLayout;
