import { useLocation } from 'react-router-dom';

const ErrorPage = () => {
  const { pathname } = useLocation();

  return (
    // buat not found simple dlu ya
    <div className='min-h-screen flex'>
      <div className='flex items-center justify-center  flex-col mx-auto'>
        <div className='w-72'>
          <img className='object-fill w-full h-full' src='/img/error.png' alt='Error Image' />
        </div>
        <div className='flex flex-col items-center'>
          <code className='text-4xl font-bold mb-4 '>Not Found</code>
          <code className='text-xl text-center font-medium'>
            The requested URL <span className='font-bold text-primary'>{pathname}</span> was not found on this server.
          </code>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
