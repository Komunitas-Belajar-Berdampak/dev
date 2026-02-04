type NoDataProps = {
  message?: string;
};

const NoData = ({ message = 'Masih kosong nich' }: NoDataProps) => {
  return (
    <div className='w-full py-12 flex flex-col items-center justify-center gap-4'>
      <img src='/img/nodata.png' alt='No Data' className='w-56 h-40 object-cover' />
      <p className='text-accent text-sm'>{message}</p>
    </div>
  );
};

export default NoData;
