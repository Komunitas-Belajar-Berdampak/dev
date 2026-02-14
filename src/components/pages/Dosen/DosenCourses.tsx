import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Title from "@/components/shared/Title";

import CourseCardArt from "@/components/shared/Courses/CourseCardArt";

import { useCourses } from "./Matakuliah/hooks/useMatakuliahLayout";
import type { DosenCourse } from "./Matakuliah/types";

const breadcrumbItems = [{ label: "Courses", href: "/dosen" }];

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={["animate-pulse rounded-md bg-gray-200/80", className].join(" ")} />
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

function norm(v: unknown) {
  return String(v ?? "").trim().toLowerCase();
}

function toNum(v: unknown) {
  const s = String(v ?? "").trim();
  if (!s) return NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

function normalizeCourses(payload: any): DosenCourse[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

export default function DosenCourses() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const [kelas, setKelas] = useState("");
  const [periode, setPeriode] = useState("");
  const [status, setStatus] = useState<"" | "aktif" | "nonaktif">("");
  const [sks, setSks] = useState("");

  const { data: matakuliahRaw, isLoading, error, refetch } = useCourses();

  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!filterRef.current) return;
      if (!filterRef.current.contains(e.target as Node)) setShowFilter(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const list = useMemo(() => normalizeCourses(matakuliahRaw), [matakuliahRaw]);

  const filteredMatakuliah = useMemo(() => {
    const q = norm(search);
    const k = norm(kelas);
    const p = norm(periode);
    const st = norm(status);
    const sksN = toNum(sks);

    return list.filter((matkul) => {
      if (q) {
        const hay = norm(`${matkul.kodeMatkul} ${matkul.namaMatkul}`);
        if (!hay.includes(q)) return false;
      }

      if (k) {
        const mk = norm(matkul.kelas);
        if (!mk.includes(k)) return false;
      }

      if (p) {
        const mp = norm(matkul.periode);
        if (!mp.includes(p)) return false;
      }

      if (st) {
        const ms = norm(matkul.status);
        if (ms !== st) return false;
      }

      if (!Number.isNaN(sksN)) {
        if (Number(matkul.sks) !== sksN) return false;
      }

      return true;
    });
  }, [list, search, kelas, periode, status, sks]);

  const hasActiveFilter =
    search.trim() ||
    kelas.trim() ||
    periode.trim() ||
    status.trim() ||
    sks.trim();

  function resetFilters() {
    setSearch("");
    setKelas("");
    setPeriode("");
    setStatus("");
    setSks("");
    setShowFilter(false);
  }

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
            className="w-full sm:w-64 border border-black/20 text-blue-800 placeholder:text-gray-400"
          />
          <Button
            size="icon"
            className="border-2 border-black shadow-[3px_3px_0_0_#000]"
            type="button"
          >
            <Icon icon="mdi:magnify" className="text-lg" />
          </Button>
        </div>

        <div className="relative" ref={filterRef}>
          <Button
            variant="outline"
            onClick={() => setShowFilter((v) => !v)}
            className="flex items-center gap-2 border-2 border-black bg-white text-black shadow-[3px_3px_0_0_#000] hover:bg-blue-900 hover:text-white transition"
            type="button"
          >
            <Icon icon="mdi:filter-variant" />
            Filter by
          </Button>

          {showFilter && (
            <div className="absolute left-0 mt-3 w-60 rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_#000] space-y-4 z-50">
              <div className="grid gap-3">
                <Input
                  placeholder="Kelas (ex: A)"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                />
                <Input
                  placeholder="Periode"
                  value={periode}
                  onChange={(e) => setPeriode(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <div className="h-10 rounded-md border border-black/20 bg-white px-3">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="h-full w-full bg-transparent text-sm outline-none text-gray-700"
                  >
                    <option value="">Status (All)</option>
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>

                <Input
                  placeholder="SKS"
                  inputMode="numeric"
                  value={sks}
                  onChange={(e) => setSks(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-gray-500">
                  {hasActiveFilter ? `${filteredMatakuliah.length} hasil` : ""}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="border-2 border-black shadow-[3px_3px_0_0_#000]"
                    type="button"
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                  <Button
                    className="bg-blue-900 text-white shadow-[3px_3px_0_0_#000]"
                    type="button"
                    onClick={() => setShowFilter(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading && <CoursesSkeletonGrid count={6} />}

      {!isLoading && error && (
        <div className="rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0_#000] space-y-3">
          <p className="text-sm text-red-600">{String(error)}</p>
          <Button
            onClick={() => void refetch()}
            className="bg-blue-900 text-white shadow-[3px_3px_0_0_#000]"
            type="button"
          >
            Coba lagi
          </Button>
        </div>
      )}

      {!isLoading && !error && filteredMatakuliah.length > 0 && (
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
                  type="button"
                >
                  Continue
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && filteredMatakuliah.length === 0 && (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <Icon icon="mdi:book-search-outline" className="text-7xl text-gray-200" />
          <p className="mt-6 text-lg font-bold text-blue-900">
            Course Tidak Ditemukan
          </p>
          <p className="mt-2 text-sm text-gray-500 max-w-sm">
            Coba ubah kata kunci atau atur filter biar ketemu course yang kamu cari.
          </p>

          {hasActiveFilter ? (
            <Button
              onClick={resetFilters}
              className="mt-6 bg-blue-900 text-white shadow-[3px_3px_0_0_#000]"
              type="button"
            >
              Reset Filter
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
