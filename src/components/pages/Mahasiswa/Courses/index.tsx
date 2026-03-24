import { Outlet } from "react-router-dom";

const MhsCourseLayout = () => {
  return (
    <div
      className="
        w-full
        max-w-[1400px]
        mx-auto
        px-4 sm:px-6 lg:px-8
        space-y-6 sm:space-y-8
        h-full
        relative
      "
    >
      <Outlet />
    </div>
  );
};

export default MhsCourseLayout;
