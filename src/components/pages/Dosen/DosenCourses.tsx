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
  { label: "Home", href: "/dosen" },
  { label: "Courses" },
];

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
      {/* TITLE + BREADCRUMB */}
      <div className="space-y-2 sm:space-y-3">
        <div className="text-xl sm:text-2xl">
          <Title title="Courses" items={breadcrumbItems} />
        </div>
      </div>

      {/* SEARCH & FILTER */}
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

      {/* LOADING */}
      {isLoading && (
        <div className="rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0_#000]">
          Loading courses...
        </div>
      )}

      {/* ERROR */}
      {!isLoading && error && (
        <div className="rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0_0_#000] space-y-3">
          <p className="text-sm text-red-600">{error}</p>
          <Button
            onClick={() => void refetch()}
            className="bg-blue-900 text-white shadow-[3px_3px_0_0_#000]"
          >
            Coba lagi
          </Button>
        </div>
      )}

      {/* GRID */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
          {filteredMatakuliah.map((matkul) => (
            <div
              key={matkul.id}
              className="rounded-2xl border-2 border-black bg-white shadow-[5px_5px_0_0_#000] overflow-hidden"
            >
              <CourseCardArt seed={matkul.id} />

              {/* CONTENT */}
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

                {/* optional: tampilkan pengajar */}
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <Icon icon="mdi:account-outline" />
                  <span className="line-clamp-1">{matkul.pengajar ?? "-"}</span>
                </div>
              </div>

              {/* ACTION */}
              <div className="p-4 pt-0">
                <Button
                  onClick={() => navigate(`/dosen/matakuliah/${matkul.id}`)}
                  className="w-full bg-blue-900 text-white shadow-[3px_3px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition"
                >
                  Continue
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!isLoading && !error && filteredMatakuliah.length === 0 && (
        <div className="rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0_#000]">
          Tidak ada course yang cocok dengan pencarian.
        </div>
      )}
    </div>
  );
}
