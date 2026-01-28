type CircleProps = {
  size?: number;
};

const Circle = ({ size = 12 }: CircleProps) => {
  return <div className={`w-${size} h-${size} shadow-md rounded-full bg-purple`} />;
};

export default Circle;
