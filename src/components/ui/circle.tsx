import type { ReactNode } from 'react';

type CircleProps = {
  size?: number;
  className?: string;
  children?: ReactNode;
};

const Circle = ({ size = 12, className = '', children }: CircleProps) => {
  return <div className={`w-${size} h-${size} shadow-md rounded-full bg-purple ${className}`}>{children}</div>;
};

export default Circle;
