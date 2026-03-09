import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import Title from "@/components/shared/Title";
import { useMatakuliahDetail } from "../hooks/useMatakuliahDetail";

export default function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: course } = useMatakuliahDetail(id);

  const breadcrumbItems = useMemo(
    () => [
      { label: "Courses", href: "/dosen" },
      {
        label: course ? `${course.kodeMatkul} ${course.namaMatkul}` : "Detail",
        href: `/dosen/courses/${id}`,
      },
      { label: "View Dashboard" },
    ],
    [course, id]
  );

  return (
    <div className="space-y-6">
      <div className="text-xl sm:text-2xl">
        <Title
          title={course ? `${course.kodeMatkul} – ${course.namaMatkul}` : ""}
          items={breadcrumbItems}
        />
      </div>

      <div className="space-y-3">
        <button
          onClick={() => navigate(`/dosen/courses/${id}/dashboard/all`)}
          className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-5 text-left hover:bg-gray-50 transition"
        >
          <span className="text-xl font-bold text-primary">
            View Dashboard Seluruh Pertemuan
          </span>
        </button>

        <button
          onClick={() => navigate(`/dosen/courses/${id}/dashboard/per-pertemuan`)}
          className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-5 text-left hover:bg-gray-50 transition"
        >
          <span className="text-xl font-bold text-primary">
            View Dashboard Per Pertemuan
          </span>
        </button>
      </div>
    </div>
  );
}