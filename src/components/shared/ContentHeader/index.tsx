import type { ReactNode } from 'react';

type ContentHeaderProps = {
  title?: string;
  children: ReactNode;
  class?: string;
};

const ContentHeader = ({ title, children, class: className }: ContentHeaderProps) => {
  return (
    <div className={`flex flex-col border border-accent rounded-xl p-5 gap-2 items-center ${className}`}>
      {title && <h1 className='text-primary font-bold text-base md:text-2xl'>{title}</h1>}
      {children}
    </div>
  );
};
export default ContentHeader;
