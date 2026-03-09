import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";

import Title from "@/components/shared/Title";
import { useMatakuliahDetail } from "../hooks/useMatakuliahDetail";
import { useMahasiswaByCourse } from "../hooks/useMahasiswaByCourse";
import { useNilaiMahasiswa } from "../hooks/useNilaiMahasiswa";
import type { NilaiMahasiswaItem } from "../hooks/useNilaiMahasiswa";

function NilaiSkeleton() {
  return (
    <div className="divide-y divide-gray-200">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function NilaiRow({ item }: { item: NilaiMahasiswaItem }) {
  const persen = item.nilai !== null ? Math.round((item.nilai / item.maxNilai) * 100) : null;

  const scoreColor =
    persen === null
      ? "text-gray-400"
      : persen >= 80
      ? "text-emerald-600"
      : persen >= 60
      ? "text-amber-500"
      : "text-red-500";

  return (
    <div className="flex items-center justify-between py-5">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-300 to-purple-400 shadow-[3px_3px_0_0_#000] shrink-0" />
        <div>
          <p className="text-sm font-bold text-blue-900">{item.judul}</p>
          {item.submittedAt && (
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(item.submittedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        {item.nilai !== null ? (
          <span className={`text-sm font-bold ${scoreColor}`}>
            {item.nilai}
            <span className="text-gray-400 font-normal">/{item.maxNilai}</span>
          </span>
        ) : (
          <span className="text-xs text-gray-400 italic">Belum submit</span>
        )}
      </div>
    </div>
  );
}

export default function ViewNilaiMahasiswaPage() {
  const { id: idCourse, idMahasiswa } = useParams<{ id: string; idMahasiswa: string }>();

  const { data: course } = useMatakuliahDetail(idCourse);
  const { data: mahasiswaList } = useMahasiswaByCourse(idCourse);
  const { data: nilaiList, isLoading, error } = useNilaiMahasiswa(idCourse, idMahasiswa);

  const mahasiswa = useMemo(
    () => mahasiswaList?.find((m) => m.id === idMahasiswa),
    [mahasiswaList, idMahasiswa]
  );

  const rataRata = useMemo(() => {
    const dinilai = (nilaiList ?? []).filter((n: NilaiMahasiswaItem) => n.nilai !== null);
    if (!dinilai.length) return null;
    const total = dinilai.reduce((sum: number, n: NilaiMahasiswaItem) => sum + (n.nilai ?? 0), 0);
    return Math.round(total / dinilai.length);
  }, [nilaiList]);

  const breadcrumbItems = useMemo(
    () => [
      { label: "Courses", href: "/dosen" },
      {
        label: course ? `${course.kodeMatkul} ${course.namaMatkul}` : "Detail",
        href: idCourse ? `/dosen/courses/${idCourse}` : undefined,
      },
      {
        label: "Mahasiswa",
        href: idCourse ? `/dosen/courses/${idCourse}/mahasiswa` : undefined,
      },
      { label: mahasiswa?.nama ?? "View Nilai" },
    ],
    [course, idCourse, mahasiswa]
  );

  return (
    <div className="space-y-6">
      <Title title="Nilai" items={breadcrumbItems} />

      <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-300 to-purple-400 shadow-[3px_3px_0_0_#000] shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-blue-900 text-base truncate">
            {mahasiswa?.nama ?? "-"}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">
            {mahasiswa?.nim ?? mahasiswa?.nrp ?? "-"}
          </p>
        </div>
        {rataRata !== null && (
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400">Rata-rata</p>
            <p className="text-2xl font-bold text-blue-900">{rataRata}</p>
          </div>
        )}
      </div>

      {isLoading ? (
        <NilaiSkeleton />
      ) : error ? (
        <p className="text-sm text-red-600">{String(error)}</p>
      ) : !nilaiList?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Icon icon="mdi:clipboard-text-outline" className="text-7xl text-gray-200" />
          <p className="mt-6 text-lg font-bold text-blue-900">Belum Ada Tugas</p>
          <p className="mt-2 text-sm text-gray-500 max-w-sm">
            Belum ada tugas yang dibuat untuk mata kuliah ini.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {nilaiList.map((item: NilaiMahasiswaItem) => (
            <NilaiRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}