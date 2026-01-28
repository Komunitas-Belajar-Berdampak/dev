type TitleSubtitleProps = {
  title: string;
  subtitle: string;
};

const TitleSubtitle = ({ title, subtitle }: TitleSubtitleProps) => {
  return (
    <div className='flex flex-col'>
      <p className='text-primary font-bold text-sm'>{title}</p>
      <p className='text-accent text-sm'>{subtitle}</p>
    </div>
  );
};
export default TitleSubtitle;
