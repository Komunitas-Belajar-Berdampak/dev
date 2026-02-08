import type { ReactNode } from 'react';

type ContentHeaderProps = {
  title?: string;
  children: ReactNode;
};

const ContentHeader = ({ title, children }: ContentHeaderProps) => {
  return (
    <div className='flex flex-col border border-accent rounded-xl p-5 gap-2 items-center'>
      {title && <h1 className='text-primary font-bold text-2xl'>{title}</h1>}
      {children}
    </div>
  );
};
export default ContentHeader;
