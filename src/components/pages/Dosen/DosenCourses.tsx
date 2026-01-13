import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Title from "@/components/shared/Title";

import type { Matakuliah } from "../SuperAdmin/Matakuliah/types/matakuliah";

/* =======================
   BREADCRUMB
======================= */
const breadcrumbItems = [
  { label: "Home", href: "/dosen" },
  { label: "Courses" },
];

/* =======================
   DUMMY DATA
======================= */
const matakuliahList: Matakuliah[] = [
  {
    id: "1",
    kodeMatkul: "IN212",
    namaMatkul: "WEB DASAR (TEORI)",
    sks: 4,
    kelas: "A",
    status: "aktif",
    namaPeriode: "2025/2026 - Ganjil",
    namaPengajar: "Dosen Pengampu",
    deskripsi:
      "Fundamental pengembangan web menggunakan HTML, CSS, dan JavaScript.",
    idPeriode: "1",
    idPengajar: "1",
    idMahasiswa: ["1", "2", "3"],
  },
  {
    id: "2",
    kodeMatkul: "IN301",
    namaMatkul: "JARINGAN KOMPUTER",
    sks: 3,
    kelas: "B",
    status: "aktif",
    namaPeriode: "2025/2026 - Ganjil",
    namaPengajar: "Dosen Pengampu",
    deskripsi:
      "Mempelajari konsep jaringan komputer, protokol, dan arsitektur jaringan.",
    idPeriode: "1",
    idPengajar: "1",
    idMahasiswa: ["4", "5"],
  },
  {
    id: "3",
    kodeMatkul: "IN401",
    namaMatkul: "BASIS DATA",
    sks: 3,
    kelas: "A",
    status: "aktif",
    namaPeriode: "2025/2026 - Ganjil",
    namaPengajar: "Dosen Pengampu",
    deskripsi:
      "Perancangan basis data, SQL, normalisasi, dan implementasi database.",
    idPeriode: "1",
    idPengajar: "1",
    idMahasiswa: ["6", "7"],
  },
  {
    id: "4",
    kodeMatkul: "IN421",
    namaMatkul: "NATURAL LANGUAGE PROGRAMMING",
    sks: 3,
    kelas: "A",
    status: "aktif",
    namaPeriode: "2025/2026 - Ganjil",
    namaPengajar: "Dosen Pengampu",
    deskripsi:
      "Pengolahan bahasa alami menggunakan teknik NLP dan machine learning.",
    idPeriode: "1",
    idPengajar: "1",
    idMahasiswa: ["8", "9"],
  },
  {
    id: "5",
    kodeMatkul: "IN499",
    namaMatkul: "TUGAS AKHIR",
    sks: 6,
    kelas: "A",
    status: "aktif",
    namaPeriode: "2025/2026 - Genap",
    namaPengajar: "Dosen Pembimbing",
    deskripsi:
      "Mata kuliah akhir berupa penelitian atau proyek sebagai syarat kelulusan.",
    idPeriode: "2",
    idPengajar: "2",
    idMahasiswa: ["10"],
  },
];

/* =======================
   PAGE DOSEN
======================= */
export default function Dosen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const filteredMatakuliah = matakuliahList.filter((matkul) =>
    `${matkul.kodeMatkul} ${matkul.namaMatkul}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      className="
        w-full
        max-w-[1400px]
        mx-auto
        px-4 sm:px-6 lg:px-8
        space-y-8
      "
    >
      {/* TITLE + BREADCRUMB */}
      <div className="space-y-2 sm:space-y-3">
        <div className="text-xl sm:text-2xl">
          <Title title="Courses" items={breadcrumbItems} />
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* SEARCH */}
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

        {/* FILTER */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowFilter(!showFilter)}
            className="
              flex items-center gap-2
              border-2 border-black
              bg-white
              text-black
              shadow-[3px_3px_0_0_#000]
              hover:bg-blue-900
              hover:text-white
              transition
            "
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

      {/* COURSE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
        {filteredMatakuliah.map((matkul) => (
          <div
            key={matkul.id}
            className="rounded-2xl border-2 border-black bg-white shadow-[5px_5px_0_0_#000] overflow-hidden"
          >
            {/* IMAGE */}
            <div className="h-32 bg-gradient-to-br from-purple-300 to-blue-200 flex items-center justify-center">
              <Icon icon="mdi:code-tags" className="text-5xl text-red-500" />
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-sm leading-snug">
                {matkul.kodeMatkul} - {matkul.namaMatkul}
              </h3>

              <p className="text-xs text-gray-600 line-clamp-3">
                {matkul.deskripsi}
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
                  {matkul.namaPeriode}
                </span>
              </div>
            </div>

            {/* ACTION */}
            <div className="p-4 pt-0">
              <Button
                onClick={() =>
                  navigate(`/dosen/matakuliah/${matkul.id}`)
                }
                className="
                  w-full
                  bg-blue-900
                  text-white
                  shadow-[3px_3px_0_0_#000]
                  hover:translate-x-0.5
                  hover:translate-y-0.5
                  transition
                "
              >
                Continue
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
