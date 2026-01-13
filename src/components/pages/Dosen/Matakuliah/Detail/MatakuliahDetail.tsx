import { useParams } from "react-router-dom";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { matakuliahDetailDummy } from "../dummy";
import MatkulDesc from "./components/MatkulDesc";
import PertemuanList from "../Pertemuan/PertemuanList";
import Title from "@/components/shared/Title";

export default function MatakuliahDetail() {
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState(false);

  const data = matakuliahDetailDummy.find(
    (item) => item.id === id
  );

  if (!data) {
    return (
      <p className="text-center text-sm text-gray-500">
        Mata kuliah tidak ditemukan
      </p>
    );
  }

  const breadcrumbItems = [
    { label: "Courses", href: "/dosen" },
    { label: `${data.kodeMatkul} ${data.namaMatkul}` },
  ];

  return (
    <div className="space-y-6">
      {/* TITLE + BREADCRUMB */}
      <div className="text-xl sm:text-2xl">
        <Title
          title={`${data.kodeMatkul} – ${data.namaMatkul}`}
          items={breadcrumbItems}
        />
      </div>

      {/* HEADER ACTION */}
      <div className="flex justify-end relative">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition"
        >
          <Icon icon="mdi:cog-outline" className="text-xl text-blue-900" />
        </button>

        {open && (
          <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-gray-200 bg-white shadow-lg text-sm overflow-hidden">
            <button className="w-full px-4 py-3 text-left hover:bg-gray-50">
              View Materi & Tugas
            </button>
            <button className="w-full px-4 py-3 text-left hover:bg-gray-50">
              Edit Deskripsi
            </button>
            <button className="w-full px-4 py-3 text-left hover:bg-gray-50">
              View Dashboard
            </button>
            <button className="w-full px-4 py-3 text-left hover:bg-gray-50">
              View Mahasiswa
            </button>
          </div>
        )}
      </div>

      <MatkulDesc
        description={data.deskripsi}
        kodeMatkul={data.kodeMatkul}
        namaMatkul={data.namaMatkul}
      />

      <PertemuanList pertemuan={data.pertemuan} />
    </div>
  );
}
