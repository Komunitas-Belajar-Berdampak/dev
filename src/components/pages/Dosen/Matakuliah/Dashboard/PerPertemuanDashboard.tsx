import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import Title from "@/components/shared/Title";
import { useMatakuliahDetail } from "../hooks/useMatakuliahDetail";
import { useMeetingsByCourse } from "../hooks/useMeetingsByCourse";

// Dummy fallback — dipakai sebelum data dari API tersedia
const dummyPertemuanList = Array.from({ length: 4 }, (_, i) => ({
  id: String(i + 1),
  label: `Pertemuan ${i + 1}`,
}));

export default function PerPertemuanDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: course } = useMatakuliahDetail(id);
  const { data: meetings, isLoading } = useMeetingsByCourse(id);

  const breadcrumbItems = useMemo(
    () => [
      { label: "Courses", href: "/dosen" },
      {
        label: course ? `${course.kodeMatkul} ${course.namaMatkul}` : "Detail",
        href: `/dosen/courses/${id}`,
      },
      { label: "View Dashboard", href: `/dosen/courses/${id}/dashboard` },
      { label: "View Dashboard Per Pertemuan" },
    ],
    [course, id]
  );

  const pertemuanList =
    meetings && meetings.length > 0
      ? meetings.map((m, idx) => ({
          id: m.id,
          label: `Pertemuan ${idx + 1}`,
        }))
      : dummyPertemuanList;

  return (
    <div className="space-y-6">
      <div className="text-xl sm:text-2xl">
        <Title
          title={course ? `${course.kodeMatkul} – ${course.namaMatkul}` : ""}
          items={breadcrumbItems}
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="animate-pulse rounded-2xl border border-gray-200 bg-white px-6 py-5"
            >
              <div className="h-5 w-48 rounded-md bg-gray-200" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {pertemuanList.map((p) => (
            <button
              key={p.id}
              onClick={() =>
                navigate(`/dosen/courses/${id}/dashboard/per-pertemuan/${p.id}`)
              }
              className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-5 text-left transition hover:bg-gray-50"
            >
              <span className="text-xl font-bold text-primary">
                View Dashboard {p.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}