import { useMemo, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";

import Title from "@/components/shared/Title";
import MahasiswaTable from "../Mahasiswa/components/MahasiswaTable";
import { useMatakuliahDetail } from "../hooks/useMatakuliahDetail";
import { useMahasiswaByCourse } from "../hooks/useMahasiswaByCourse";

type SortKey = "name_asc" | "name_desc" | "nim_asc" | "nim_desc";

function normalizeText(v: unknown) {
  return String(v ?? "").trim().toLowerCase();
}

function normalizeNim(v: unknown) {
  return String(v ?? "").replace(/\s+/g, "").trim();
}

export default function MahasiswaList() {
  const { id } = useParams<{ id: string }>();

  const { data: course, isLoading: courseLoading, error: courseError } =
    useMatakuliahDetail(id);

  const {
    data: mahasiswa,
    isLoading: mhsLoading,
    error: mhsError,
  } = useMahasiswaByCourse(id);

  const breadcrumbItems = useMemo(
    () => [
      { label: "Courses", href: "/dosen" },
      {
        label: course ? `${course.kodeMatkul} ${course.namaMatkul}` : "Detail",
        href: id ? `/dosen/courses/${id}` : undefined,
      },
      { label: "Mahasiswa" },
    ],
    [course, id]
  );

  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("name_asc");
  const [filterOpen, setFilterOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!filterRef.current) return;
      if (!filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filteredSorted = useMemo(() => {
    const list = (mahasiswa ?? []).slice();

    const query = normalizeText(q);
    const filtered =
      query.length === 0
        ? list
        : list.filter((m) => {
            const nama = normalizeText(m.nama);
            const nim = normalizeText(m.nim ?? m.nrp);
            return nama.includes(query) || nim.includes(query);
          });

    const byName = (a: any, b: any) =>
      String(a.nama ?? "").localeCompare(String(b.nama ?? ""), "id", {
        sensitivity: "base",
      });

    const byNim = (a: any, b: any) =>
      normalizeNim(a.nim ?? a.nrp).localeCompare(
        normalizeNim(b.nim ?? b.nrp),
        "en",
        { numeric: true, sensitivity: "base" }
      );

    filtered.sort((a, b) => {
      switch (sort) {
        case "name_asc":
          return byName(a, b);
        case "name_desc":
          return byName(b, a);
        case "nim_asc":
          return byNim(a, b);
        case "nim_desc":
          return byNim(b, a);
        default:
          return 0;
      }
    });

    return filtered;
  }, [mahasiswa, q, sort]);

  const total = mahasiswa?.length ?? 0;
  const shown = filteredSorted.length;

  if (courseLoading) {
    return <p className="text-sm text-gray-500 text-center">Loading...</p>;
  }

  if (courseError || !course) {
    return (
      <p className="text-sm text-red-600 text-center">
        {courseError ?? "Mata kuliah tidak ditemukan"}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <Title title="Mahasiswa" items={breadcrumbItems} />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div
            className="
              flex items-center
              rounded-xl
              border-2 border-black
              bg-white
              px-3 py-2
              shadow-[4px_4px_0_0_#000]
            "
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              className="w-[220px] sm:w-[280px] bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          <button
            type="button"
            className="
              inline-flex items-center justify-center
              h-[40px] w-[40px]
              rounded-xl
              border-2 border-black
              bg-blue-900
              shadow-[4px_4px_0_0_#000]
              transition
              hover:opacity-95
              active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
            "
            onClick={() => {}}
          >
            <Icon icon="mdi:magnify" className="text-xl text-white" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">
            {mhsLoading ? "Memuat..." : `${shown}/${total}`}
          </p>

          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              className="
                inline-flex items-center gap-2
                rounded-xl
                border-2 border-black
                bg-white
                px-4 py-2
                shadow-[4px_4px_0_0_#000]
                text-sm font-medium text-gray-800
                transition
                active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
              "
            >
              <Icon icon="mdi:filter-variant" className="text-lg text-gray-700" />
              Filter by
            </button>

            {filterOpen && (
              <div
                className="
                  absolute right-0 mt-3 w-56
                  rounded-xl
                  border-2 border-black
                  bg-white
                  shadow-[6px_6px_0_0_#000]
                  overflow-hidden
                  z-50
                "
              >
                <button
                  type="button"
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                  onClick={() => {
                    setSort("name_asc");
                    setFilterOpen(false);
                  }}
                >
                  Nama (A–Z)
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                  onClick={() => {
                    setSort("name_desc");
                    setFilterOpen(false);
                  }}
                >
                  Nama (Z–A)
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                  onClick={() => {
                    setSort("nim_asc");
                    setFilterOpen(false);
                  }}
                >
                  NIM (Kecil–Besar)
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                  onClick={() => {
                    setSort("nim_desc");
                    setFilterOpen(false);
                  }}
                >
                  NIM (Besar–Kecil)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {mhsLoading && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
          Loading mahasiswa...
        </div>
      )}

      {!mhsLoading && mhsError && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-red-600">
          {String(mhsError)}
        </div>
      )}

      {!mhsLoading && !mhsError && filteredSorted.length === 0 && (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <Icon
            icon="mdi:account-group-outline"
            className="text-7xl text-gray-200"
          />

          <p className="mt-6 text-lg font-bold text-blue-900">
            Belum Ada Mahasiswa
          </p>

          <p className="mt-2 text-sm text-gray-500 max-w-sm">
            Mahasiswa yang terdaftar di mata kuliah ini akan muncul di sini.
          </p>
        </div>
      )}


      {!mhsLoading && !mhsError && filteredSorted.length > 0 && (
        <MahasiswaTable data={filteredSorted} />
      )}
    </div>
  );
}
