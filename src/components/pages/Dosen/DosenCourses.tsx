import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Title from "@/components/shared/Title";

import CourseCardArt from "@/components/shared/Courses/CourseCardArt";

import { useCourses } from "./Matakuliah/hooks/useMatakuliahLayout";
import type { DosenCourse } from "./Matakuliah/types";

const breadcrumbItems = [
  { label: "Courses", href: "/dosen" },
];

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={["animate-pulse rounded-md bg-gray-200/80", className].join(
        " "
      )}
    />
  );
}

function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-black bg-white shadow-[5px_5px_0_0_#000] overflow-hidden">
      <div className="h-32 bg-gray-200/80 animate-pulse" />

      <div className="p-4 space-y-3">
        <SkeletonBlock className="h-4 w-[80%]" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-[92%]" />

        <div className="flex flex-wrap gap-3 pt-1">
          <SkeletonBlock className="h-3 w-14" />
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-3 w-28" />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <SkeletonBlock className="h-3 w-4 rounded-full" />
          <SkeletonBlock className="h-3 w-36" />
        </div>
      </div>

      <div className="p-4 pt-0">
        <SkeletonBlock className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

function CoursesSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function DosenCourses() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const { data: matakuliahList, isLoading, error, refetch } = useCourses();

  const filteredMatakuliah = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return matakuliahList;

    return matakuliahList.filter((matkul: DosenCourse) =>
      `${matkul.kodeMatkul} ${matkul.namaMatkul}`.toLowerCase().includes(q)
    );
  }, [matakuliahList, search]);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2 sm:space-y-3">
        <div className="text-xl sm:text-2xl">
          <Title title="Courses" items={breadcrumbItems} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex w-full sm:w-auto gap-2">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 border border-black/20 text-blue-800"
          />
          <Button
            size="icon"
            className="border-2 border-black shadow-[3px_3px_0_0_#000]"
          >
            <Icon icon="mdi:magnify" className="text-lg" />
          </Button>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 border-2 border-black bg-white text-black shadow-[3px_3px_0_0_#000] hover:bg-blue-900 hover:text-white transition"
          >
            <Icon icon="mdi:filter-variant" />
            Filter by
          </Button>

          {showFilter && (
            <div className="absolute right-0 mt-5 w-72 rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0_#000] space-y-4 z-50">
              <Input placeholder="Angkatan" />
              <Input placeholder="Semester" />
              <Input placeholder="Mata Kuliah" />
              <Input placeholder="SKS" />
            </div>
          )}
        </div>
      </div>

      {isLoading && <CoursesSkeletonGrid count={6} />}

      {!isLoading && error && (
        <div className="rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0_#000] space-y-3">
          <p className="text-sm text-red-600">{error}</p>
          <Button
            onClick={() => void refetch()}
            className="bg-blue-900 text-white shadow-[3px_3px_0_0_#000]"
          >
            Coba lagi
          </Button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
          {filteredMatakuliah.map((matkul) => (
            <div
              key={matkul.id}
              className="rounded-2xl border-2 border-black bg-white shadow-[5px_5px_0_0_#000] overflow-hidden"
            >
              <CourseCardArt seed={matkul.id} />

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-sm leading-snug">
                  {matkul.kodeMatkul} - {matkul.namaMatkul}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-3">
                  {matkul.deskripsi || "-"}
                </p>

                <div className="flex flex-wrap gap-3 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <Icon icon="mdi:book-outline" />
                    {matkul.sks} SKS
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon="mdi:account-group-outline" />
                    Kelas {matkul.kelas}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon="mdi:school-outline" />
                    {matkul.periode ?? "-"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <Icon icon="mdi:account-outline" />
                  <span className="line-clamp-1">{matkul.pengajar ?? "-"}</span>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Button
                  onClick={() => navigate(`courses/${matkul.id}`)}
                  className="w-full bg-blue-900 text-white shadow-[3px_3px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition"
                >
                  Continue
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && filteredMatakuliah.length === 0 && (
        <div className="rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0_#000]">
          Tidak ada course yang cocok dengan pencarian.
        </div>
      )}
    </div>
  );
}
