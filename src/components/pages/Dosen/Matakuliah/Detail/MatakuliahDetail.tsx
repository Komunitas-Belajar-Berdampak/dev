import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import Title from "@/components/shared/Title";
import MatkulDesc from "./components/MatkulDesc";
import PertemuanList from "../Pertemuan/PertemuanList";

import { useMatakuliahDetail } from "../hooks/useMatakuliahDetail";
import { useMeetingsByCourse } from "../hooks/useMeetingsByCourse";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={["animate-pulse rounded-md bg-gray-200/80", className].join(" ")} />
  );
}

function MatakuliahDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 w-full">
          <SkeletonBlock className="h-7 w-[320px] sm:w-[420px]" />
          <SkeletonBlock className="h-4 w-[220px] sm:w-[280px]" />
        </div>
        <SkeletonBlock className="h-10 w-10 rounded-lg" />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
        <SkeletonBlock className="h-4 w-[200px]" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-[92%]" />
        <SkeletonBlock className="h-4 w-[86%]" />
        <SkeletonBlock className="h-4 w-[72%]" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <SkeletonBlock className="h-5 w-[140px]" />
          <SkeletonBlock className="h-9 w-[110px] rounded-lg" />
        </div>

        <div className="grid gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="rounded-xl border border-gray-200 bg-white p-4 space-y-2"
            >
              <div className="flex items-center justify-between gap-3">
                <SkeletonBlock className="h-4 w-[180px]" />
                <SkeletonBlock className="h-6 w-16 rounded-full" />
              </div>
              <SkeletonBlock className="h-3 w-[88%]" />
              <SkeletonBlock className="h-3 w-[76%]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MatakuliahDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
    refetch: refetchCourse,
  } = useMatakuliahDetail(id);

  const {
    data: meetings,
    isLoading: meetingsLoading,
    error: meetingsError,
    refetch: refetchMeetings,
  } = useMeetingsByCourse(id);

  const breadcrumbItems = useMemo(
    () => [
      { label: "Courses", href: "/dosen" },
      {
        label: course ? `${course.kodeMatkul} ${course.namaMatkul}` : "Detail",
      },
    ],
    [course]
  );

  if (courseLoading) {
    return <MatakuliahDetailSkeleton />;
  }

  if (courseError) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
        <p className="text-sm text-red-600">{courseError}</p>
        <button
          onClick={() => void refetchCourse()}
          className="px-4 py-2 rounded-lg bg-blue-900 text-white hover:opacity-90 transition text-sm"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <p className="text-center text-sm text-gray-500">
        Mata kuliah tidak ditemukan
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-xl sm:text-2xl">
        <Title
          title={`${course.kodeMatkul} – ${course.namaMatkul}`}
          items={breadcrumbItems}
        />
      </div>

      <div className="flex justify-end relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition"
        >
          <Icon icon="mdi:cog-outline" className="text-xl text-blue-900" />
        </button>

        {open && (
          <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-gray-200 bg-white shadow-lg text-sm overflow-hidden">
            <button
              onClick={() => navigate(`/dosen/courses/${id}/materi-tugas`)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50"
            >
              View Materi & Tugas
            </button>
            <button
              onClick={() => navigate(`/dosen/courses/${id}/edit-deskripsi`)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50"
            >
              Edit Deskripsi
            </button>
            <button
              onClick={() => navigate(`/dosen/courses/${id}/dashboard`)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50"
            >
              View Dashboard
            </button>
            <button
              onClick={() => navigate(`/dosen/courses/${id}/mahasiswa`)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50"
            >
              View Mahasiswa
            </button>
          </div>
        )}
      </div>

      <MatkulDesc
        description={course.deskripsi}
        kodeMatkul={course.kodeMatkul}
        namaMatkul={course.namaMatkul}
      />

      <div className="space-y-3">
        {meetingsLoading && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
            Loading pertemuan...
          </div>
        )}

        {!meetingsLoading && meetingsError && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
            <p className="text-sm text-red-600">{meetingsError}</p>
            <button
              onClick={() => void refetchMeetings()}
              className="px-4 py-2 rounded-lg bg-blue-900 text-white hover:opacity-90 transition text-sm"
            >
              Coba lagi
            </button>
          </div>
        )}

        {!meetingsLoading && !meetingsError && (
          <PertemuanList pertemuan={meetings} />
        )}
      </div>
    </div>
  );
}
