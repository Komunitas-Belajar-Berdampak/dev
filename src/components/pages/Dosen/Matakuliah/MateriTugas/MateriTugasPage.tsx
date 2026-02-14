import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";

import Title from "@/components/shared/Title";
import { useMatakuliahDetail } from "../hooks/useMatakuliahDetail";
import { useMeetingsByCourse } from "../hooks/useMeetingsByCourse";

import MateriTugasPertemuanCard from "./components/MateriTugasPertemuanCard";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "animate-pulse rounded-md bg-gray-200/80",
        className,
      ].join(" ")}
    />
  );
}

function PertemuanCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
      <div className="space-y-2">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-6 w-48" />
      </div>
    </div>
  );
}

export default function MateriTugasPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useMatakuliahDetail(id);

  const {
    data: meetings,
    isLoading: meetingsLoading,
    error: meetingsError,
  } = useMeetingsByCourse(id);

  const breadcrumbItems = useMemo(
    () => [
      { label: "Courses", href: "/dosen" },
      {
        label: course ? `${course.kodeMatkul} ${course.namaMatkul}` : "Detail",
        href: id ? `/dosen/courses/${id}` : undefined,
      },
      { label: "Materi & Tugas" },
    ],
    [course, id]
  );

  if (courseLoading) {
    return (
      <div className="space-y-6">
        <SkeletonBlock className="h-7 w-[320px] sm:w-[420px]" />
        <div className="grid gap-3">
          {[1, 2, 3].map((n) => (
            <PertemuanCardSkeleton key={n} />
          ))}
        </div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <p className="text-sm text-red-600">
        {courseError ?? "Mata kuliah tidak ditemukan"}
      </p>
    );
  }

  const sortedMeetings = (meetings ?? [])
    .slice()
    .sort((a, b) => a.pertemuan - b.pertemuan);

  return (
    <div className="space-y-6">
      <div className="text-xl sm:text-2xl">
        <Title
          title={`${course.kodeMatkul} – ${course.namaMatkul}`}
          items={breadcrumbItems}
        />
      </div>

      <div className="space-y-3">
        {meetingsLoading && (
          <div className="grid gap-3">
            {[1, 2, 3].map((n) => (
              <PertemuanCardSkeleton key={n} />
            ))}
          </div>
        )}

        {!meetingsLoading && meetingsError && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-red-600">
            {meetingsError}
          </div>
        )}

        {!meetingsLoading && !meetingsError && sortedMeetings.length === 0 && (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <Icon
              icon="mdi:calendar-blank-outline"
              className="text-7xl text-gray-200"
            />
            <p className="mt-6 text-lg font-bold text-blue-900">
              Belum Ada Pertemuan
            </p>
            <p className="mt-2 text-sm text-gray-500 max-w-sm">
              Pertemuan yang dibuat untuk mata kuliah ini akan muncul di sini.
            </p>
          </div>
        )}

        {!meetingsLoading && !meetingsError && sortedMeetings.length > 0 && (
          <div className="grid gap-3">
            {sortedMeetings.map((m) => (
              <MateriTugasPertemuanCard key={m.id} data={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
