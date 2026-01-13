import { useParams } from "react-router-dom";
import Title from "@/components/shared/Title";
import { matakuliahDetailDummy } from "../dummy";

export default function PertemuanDetail() {
  const { pertemuanId } = useParams();

  // cari matkul + pertemuan
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

  /* =======================
     BREADCRUMB ITEMS
  ======================= */
  const breadcrumbItems = [
    { label: "Courses", href: "/dosen" },
    {
      label: `${matkul.kodeMatkul} ${matkul.namaMatkul}`,
      href: `/dosen/matakuliah/${matkul.id}`,
    },
    {
      label: `Pertemuan ${pertemuan.pertemuanKe}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* TITLE + BREADCRUMB */}
      <div className="text-xl sm:text-2xl">
        <Title
          title={`Pertemuan ${pertemuan.pertemuanKe}`}
          items={breadcrumbItems}
        />
      </div>

      {/* HEADER CARD */}
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-6">
        <h2 className="text-xl font-bold text-blue-900">
          {pertemuan.judul}
        </h2>
        <p className="text-sm text-blue-700 mt-1">
          {matkul.kodeMatkul} – {matkul.namaMatkul}
        </p>
      </div>

      {/* CONTENT */}
      <div className="text-blue-900 text-sm leading-relaxed space-y-4">
        <p>{pertemuan.deskripsi}</p>
      </div>
    </div>
  );
}
