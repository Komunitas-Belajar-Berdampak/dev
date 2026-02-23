import Title from "@/components/shared/Title";
import { Outlet, useParams } from "react-router-dom";

export default function MatakuliahPage() {
  const { id } = useParams();

  const breadcrumbItems = [
    { label: "Home", href: "/admin" },
    { label: "Data Matakuliah", href: "/admin/courses" },
    ...(id ? [{ label: "Detail Pengajar" }] : []),
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      <div className="space-y-2 sm:space-y-3">
        <div className="text-xl sm:text-2xl">
          <Title title="Data Matakuliah" items={breadcrumbItems} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Outlet />
      </div>
    </div>
  );
}