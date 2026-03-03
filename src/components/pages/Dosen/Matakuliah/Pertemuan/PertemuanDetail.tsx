import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Title from "@/components/shared/Title";
import { useMeetingDetail } from "../hooks/useMeetingDetail";
import { useMaterialsByCourse } from "../hooks/useMaterialsByCourse";
import { useAssignmentsByCourse } from "../hooks/useAssignmentsByCourse";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={["animate-pulse rounded-md bg-gray-200/80", className].join(" ")} />
  );
}

function PertemuanDetailSkeleton() {
  return (
    <div className="space-y-8">
      <SkeletonBlock className="h-6 w-[300px]" />
      <SkeletonBlock className="h-20 w-full rounded-2xl" />
      <SkeletonBlock className="h-4 w-[80%]" />
      <SkeletonBlock className="h-4 w-[65%]" />
      <hr className="border-gray-200" />
      <div className="flex items-start gap-4">
        <SkeletonBlock className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-[200px]" />
          <SkeletonBlock className="h-3 w-[90%]" />
        </div>
      </div>
      <hr className="border-gray-200" />
      <div className="flex items-center gap-4">
        <SkeletonBlock className="w-12 h-12 rounded-full" />
        <SkeletonBlock className="h-4 w-[180px]" />
      </div>
    </div>
  );
}

export default function PertemuanDetail() {
  // Route: /dosen/courses/:id/pertemuan/:pertemuanId
  const { id: idCourse, pertemuanId } = useParams<{
    id: string;
    pertemuanId: string;
  }>();

  const {
    data: pertemuan,
    isLoading,
    error,
    refetch,
  } = useMeetingDetail(pertemuanId, idCourse);

  const { data: materials = [] } = useMaterialsByCourse(idCourse);
  const { data: assignments = [] } = useAssignmentsByCourse(idCourse);

  // Filter materi & tugas yang relevan dengan nomor pertemuan ini
  const pertemuanNum = Number(pertemuan?.pertemuan ?? 0);
  const materiPertemuan = materials.filter(
    (m: any) => Number(m.pertemuan) === pertemuanNum
  );
  const tugasPertemuan = assignments.filter(
    (a: any) => Number(a.pertemuan) === pertemuanNum
  );

  if (isLoading) return <PertemuanDetailSkeleton />;

  if (error) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={() => void refetch()}
          className="px-4 py-2 rounded-lg bg-blue-900 text-white hover:opacity-90 transition text-sm"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (!pertemuan) {
    return (
      <p className="text-sm text-gray-500 text-center">
        Pertemuan tidak ditemukan.
      </p>
    );
  }

  const breadcrumbItems = [
    { label: "Courses", href: "/dosen" },
    {
      label: pertemuan.judul ?? "Detail Matakuliah",
      href: `/dosen/courses/${idCourse}`,
    },
    { label: `Pertemuan ${pertemuan.pertemuan}` },
  ];

  return (
    <div className="space-y-8">
      {/* TITLE + BREADCRUMB */}
      <Title
        title={`Pertemuan ${pertemuan.pertemuan} – ${pertemuan.judul}`}
        items={breadcrumbItems}
      />

      {/* PERTEMUAN TITLE CARD */}
      <div className="rounded-2xl border border-gray-200 bg-white px-8 py-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">
          Pertemuan {pertemuan.pertemuan} – {pertemuan.judul}
        </h2>
      </div>

      {/* DESKRIPSI */}
      {pertemuan.deskripsi && (
        <div className="text-blue-900 text-base max-w-full">
          <p>{pertemuan.deskripsi}</p>
        </div>
      )}

      <hr className="border-gray-200" />

      {/* MATERI */}
      <div className="space-y-4">
        <h3 className="font-semibold text-blue-900 text-lg">Materi</h3>

        {materiPertemuan.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada materi untuk pertemuan ini.</p>
        ) : (
          materiPertemuan.map((m: any, idx: number) => (
            <div key={m.id ?? idx} className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 shrink-0">
                <Icon
                  icon="mdi:file-document-outline"
                  className="text-2xl text-blue-800"
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-blue-900">
                  Materi {idx + 1} – {m.namaFile ?? m.judul ?? "Materi"}
                </h4>
                {m.deskripsi && (
                  <p className="text-sm text-blue-900 max-w-xl">{m.deskripsi}</p>
                )}
                {m.fileUrl && (
                  <a
                    href={m.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Icon icon="mdi:download" />
                    Download
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <hr className="border-gray-200" />

      {/* TUGAS */}
      <div className="space-y-4">
        <h3 className="font-semibold text-blue-900 text-lg">Tugas</h3>

        {tugasPertemuan.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada tugas untuk pertemuan ini.</p>
        ) : (
          tugasPertemuan.map((t: any, idx: number) => (
            <div
              key={t.id ?? idx}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 shrink-0">
                  <Icon
                    icon="mdi:clipboard-check-outline"
                    className="text-2xl text-pink-700"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">
                    Tugas {idx + 1} – {t.judul}
                  </h4>
                  {t.tenggat && (
                    <p className="text-xs text-gray-500">
                      Tenggat: {new Date(t.tenggat).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>

              <button className="text-sm text-blue-900 hover:underline">
                View Submission
              </button>
            </div>
          ))
        )}
      </div>

      {/* NEXT BUTTON */}
      <button className="fixed bottom-12 right-12 z-50 flex items-center gap-2 text-blue-900">
        Next
        <Icon icon="mdi:chevron-right" className="text-xl" />
      </button>
    </div>
  );
}