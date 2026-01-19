import { Outlet } from "react-router-dom";
import Title from "@/components/shared/Title";

const breadcrumbItems = [
  { label: "Courses", href: "/dosen" },
  { label: "IN213 Web Dasar" },
];

export default function MatakuliahLayout() {

  return (
    <div
      className="
        w-full
        max-w-[1400px]
        mx-auto
        px-4 sm:px-6 lg:px-8
        space-y-6 sm:space-y-8
      "
    >
      {/* TITLE + BREADCRUMB */}
      <div className="flex items-start justify-between gap-4">
        {/* LEFT */}
        <div className="text-xl sm:text-2xl">
          <Title
            title="IN213 – Web Dasar"
            items={breadcrumbItems}
          />
        </div>
      </div>

      {/* CONTENT */}
      <Outlet />
    </div>
  );
}
