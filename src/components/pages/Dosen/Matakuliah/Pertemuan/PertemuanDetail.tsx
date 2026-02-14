import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Title from "@/components/shared/Title";
import { matakuliahDetailDummy } from "../dummy";

export default function PertemuanDetail() {
  const { pertemuanId } = useParams();

  const matkul = matakuliahDetailDummy.find((m) =>
    m.pertemuan.some((p) => p.id === pertemuanId)
  );

  const pertemuan = matkul?.pertemuan.find(
    (p) => p.id === pertemuanId
  );

  if (!matkul || !pertemuan) {
    return (
      <p className="text-sm text-gray-500 text-center">
        Pertemuan tidak ditemukan
      </p>
    );
  }

  const breadcrumbItems = [
    { label: "Courses", href: "/dosen" },
    {
      label: `${matkul.kodeMatkul} ${matkul.namaMatkul}`,
      href: `/dosen/matakuliah/${matkul.id}`,
    },
    { label: `Pertemuan ${pertemuan.pertemuan}` },
  ];

  return (
    <div className="space-y-8">
      {/* TITLE + BREADCRUMB */}
      <Title
        title={`${matkul.kodeMatkul} – ${matkul.namaMatkul}`}
        items={breadcrumbItems}
      />

      {/* PERTEMUAN TITLE CARD */}
      <div className="rounded-2xl border border-gray-200 bg-white px-8 py-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">
          Pertemuan {pertemuan.pertemuan} – {pertemuan.judul}
        </h2>
      </div>

      {/* DESKRIPSI */}
      <div className="text-blue-900 text-base max-w-full">
        <p>{pertemuan.deskripsi}</p>
      </div>

      <hr className="border-gray-200" />

      {/* MATERI */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100">
          <Icon
            icon="mdi:file-document-outline"
            className="text-2xl text-blue-800"
          />
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-blue-900">
            Materi 1 – Pengenalan HTML
          </h3>
          <p className="text-sm text-blue-900 max-w-xl">
            Berikut silahkan rekan-rekan mahasiswa bisa mendownload materi
            PPT yang telah disediakan untuk dapat dipelajari sebelum kelas dimulai
          </p>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* TUGAS */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100">
            <Icon
              icon="mdi:clipboard-check-outline"
              className="text-2xl text-pink-700"
            />
          </div>

          <div>
            <h3 className="font-semibold text-blue-900">
              Tugas 1 – Pengenalan HTML
            </h3>
          </div>
        </div>

        <button className="text-sm text-blue-900 hover:underline">
          View Submission
        </button>
      </div>

      {/* NEXT */}
      <div className="flex relative space-y-8">
        <button className="fixed bottom-12 right-12 z-50 flex items-center gap-2 text-blue-900">
          Next
          <Icon icon="mdi:chevron-right" className="text-xl" />
        </button>
      </div>
    </div>
  );
}
