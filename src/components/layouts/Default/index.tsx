import Header from '@/components/shared/Header';
import { Outlet } from 'react-router-dom';

const DefaultLayout = () => {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default DefaultLayout;
