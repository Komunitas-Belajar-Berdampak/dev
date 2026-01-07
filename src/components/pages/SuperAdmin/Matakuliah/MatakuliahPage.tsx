import Title from '@/components/shared/Title';
// import UserTable from "./UserTable";
import MatakuliahTable from './MatakuliahTable';

const breadcrumbItems = [{ label: 'Home', href: '/admin' }, { label: 'Data Matakuliah' }];

const UserPage = () => {
  return (
    <div
      className='
        w-full
        max-w-[1400px]
        mx-auto
        px-4 sm:px-6 lg:px-8
        space-y-6 sm:space-y-8
      '
    >
      {/* TITLE + BREADCRUMB */}
      <div className='space-y-2 sm:space-y-3'>
        {/* TITLE RESPONSIVE */}
        <div className='text-xl sm:text-2xl'>
          <Title title='Data Matakuliah' items={breadcrumbItems} />
        </div>
      </div>

      {/* TABLE */}
      <div className='overflow-x-auto'>
        <MatakuliahTable />
      </div>
    </div>
  );
};

export default UserPage;
