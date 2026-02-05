import type { ReactNode } from 'react';

type NoDataProps = {
  message?: string;
  variant?: 'default' | 'border';
  children?: ReactNode;
};

const NoData = ({ message = 'Masih kosong nich', variant = 'default', children }: NoDataProps) => {
  if (variant === 'border') {
    return <div className='flex flex-col p-12 border border-accent rounded-xl mt-8 justify-center items-center'>{children}</div>;
  } else {
    return (
      <div className='w-full py-12 flex flex-col items-center justify-center gap-4'>
        <img src='/img/nodata.png' alt='No Data' className='w-56 h-40 object-cover' />
        <p className='text-accent text-sm'>{message}</p>
      </div>
    );
  }
};

export default NoData;
