import { Outlet, useMatch } from "react-router-dom";
import Title from "@/components/shared/Title";

export default function TahunAkademikDanSemesterPage() {
  const detailMatch = useMatch("/admin/academic-terms/:id");

  const breadcrumbItems = [
    { label: "Home", href: "/admin" },
    { label: "Data Tahun Akademik dan Semester", href: "/admin/academic-terms" },
    ...(detailMatch ? [{ label: "Detail Tahun Akademik dan Semester" }] : []),
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      <div className="space-y-2 sm:space-y-3">
        <div className="text-xl sm:text-2xl">
          <Title
            title="Data Tahun Akademik dan Semester"
            items={breadcrumbItems}
          />
        </div>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
}