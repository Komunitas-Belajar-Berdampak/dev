import Title from '@/components/shared/Title';

const cobaBreadcrumbItems = [
  {
    label: 'Dashboard',
    href: '/',
  },
  {
    label: 'Courses',
    href: '/courses',
  },
  { label: 'Detail' },
];

const Home = () => {
  return (
    <>
      <Title title='Dashboard' items={cobaBreadcrumbItems} />
    </>
  );
};

export default Home;
