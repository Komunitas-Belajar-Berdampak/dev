import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { useTahunAkademikDanSemesterById } from "./hooks/useTahunAkademikDanSemesterById";
import AddSemesterModal from "./Modal/AddSemesterModal";

export default function TahunAkademikDanSemesterDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const termId = String(id ?? "");

  const { data, loading, error, refetch } =
    useTahunAkademikDanSemesterById(termId);

  const [openAddSemester, setOpenAddSemester] = useState(false);

  const semesters = useMemo(() => {
    const list = (data?.semesters ?? []).slice();
    list.sort((a, b) => a - b);
    return list;
  }, [data?.semesters]);

  if (loading) {
    return (
      <div className="space-y-4 bg-white p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-7 w-72" />
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white p-6 space-y-4">
        <div className="text-red-600">{error ?? "Data tidak ditemukan"}</div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-2 border-black shadow-[3px_3px_0_0_#000]"
            onClick={() => navigate(-1)}
          >
            <Icon icon="mdi:arrow-left" className="mr-2" />
            Kembali
          </Button>
          <Button
            className="border-2 border-black shadow-[3px_3px_0_0_#000]"
            onClick={() => refetch()}
          >
            Coba lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-blue-900">
              Informasi Tahun Akademik
            </h2>
            <p className="text-xs text-muted-foreground">
              Detail periode akademik yang sedang dipilih
            </p>
          </div>

          {data.status === "aktif" ? (
            <Badge variant="success">Aktif</Badge>
          ) : (
            <Badge variant="danger">Tidak Aktif</Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-blue-900">
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Periode</div>
            <div className="font-semibold">{data.periode}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Semester Type</div>
            <div className="font-semibold">{data.semesterType}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Tanggal Mulai</div>
            <div className="font-semibold">
              {new Date(data.startDate).toLocaleDateString("id-ID")}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Tanggal Selesai</div>
            <div className="font-semibold">
              {new Date(data.endDate).toLocaleDateString("id-ID")}
            </div>
          </div>

        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-blue-900">
              Daftar Semester
            </h2>
            <p className="text-xs text-muted-foreground">
              Semester yang tersedia dalam periode ini
            </p>
          </div>

          <Button
            size="sm"
            className="border-2 border-black shadow-[3px_3px_0_0_#000]"
            onClick={() => setOpenAddSemester(true)}
          >
            <Icon icon="mdi:plus" className="mr-2" />
            Tambah Semester
          </Button>
        </div>

        {semesters.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6 text-center border border-dashed rounded-xl">
            Belum ada semester yang ditambahkan.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {semesters.map((s) => (
              <div
                key={s}
                className="border border-black/10 rounded-xl p-4 bg-white hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-blue-900">
                    Semester {s}
                  </div>

                  <Icon
                    icon="mdi:calendar-month"
                    className="text-blue-900/50"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddSemesterModal
        open={openAddSemester}
        onClose={() => setOpenAddSemester(false)}
        term={data}
        onSuccess={() => refetch()}
      />
    </div>
  );
}