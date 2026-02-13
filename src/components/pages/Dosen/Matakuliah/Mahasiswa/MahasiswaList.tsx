import { useParams } from "react-router-dom";
import Title from "@/components/shared/Title";
import MahasiswaTable from "../Mahasiswa/components/MahasiswaTable";
import { matakuliahDetailDummy } from "../dummy";

export default function MahasiswaList() {
  const { matkulId } = useParams();

  const matkul = matakuliahDetailDummy.find(
    (m) => m.id === matkulId
  );

  if (!matkul) {
    return (
      <p className="text-sm text-gray-500 text-center">
        Mata kuliah tidak ditemukan
      </p>
    );
  }

  const breadcrumbItems = [
    { label: "Courses", href: "/dosen" },
    {
      label: `${matkul.kodeMatkul} ${matkul.namaMatkul}`,
      href: `/dosen/matakuliah/${matkul.id}`,
    },
    { label: "Mahasiswa" },
  ];

  return (
    <div className="space-y-8">
      <Title
        title="Mahasiswa"
        items={breadcrumbItems}
      />

      {/* LIST MAHASISWA */}
      <MahasiswaTable />
    </div>
  );
}
