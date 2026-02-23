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

  const { data, loading, error, refetch, isFetching } =
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

  const statusBadge =
    data.status === "aktif" ? (
      <Badge variant="success">Aktif</Badge>
    ) : (
      <Badge variant="danger">Tidak Aktif</Badge>
    );

  return (
    <div className="bg-white w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="border-2 border-black shadow-[3px_3px_0_0_#000]"
            onClick={() => navigate(-1)}
          >
            <Icon icon="mdi:arrow-left" />
          </Button>

          <div>
            <div className="text-lg font-bold text-blue-900">
              Detail Tahun Akademik
            </div>
            <div className="text-sm text-muted-foreground">
              Klik tombol tambah untuk menambah semester
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isFetching ? (
            <div className="text-xs text-muted-foreground">Refreshing...</div>
          ) : null}
          {statusBadge}
        </div>
      </div>

      {/* Card info periode */}
      <div className="rounded-md border border-black/10 p-4 space-y-2">
        <div className="text-base font-semibold text-blue-900">{data.periode}</div>
        <div className="text-sm text-muted-foreground">
          Semester Type: <span className="font-medium text-blue-900">{data.semesterType}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Periode tanggal:{" "}
          <span className="font-medium text-blue-900">
            {new Date(data.startDate).toLocaleDateString("id-ID")} -{" "}
            {new Date(data.endDate).toLocaleDateString("id-ID")}
          </span>
        </div>
      </div>

      {/* Section semesters */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-blue-900">Daftar Semester</div>
          <div className="text-sm text-muted-foreground">
            Semester yang termasuk dalam periode ini
          </div>
        </div>

        <Button
          className="border-2 border-black shadow-[3px_3px_0_0_#000]"
          onClick={() => setOpenAddSemester(true)}
        >
          <Icon icon="mdi:plus" className="mr-2" />
          Tambah Semester
        </Button>
      </div>

      <div className="rounded-md border border-black/10 p-4">
        {semesters.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Belum ada semester di periode ini.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {semesters.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-full border border-black/10 text-sm text-blue-900"
              >
                Semester {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Modal tambah semester */}
      <AddSemesterModal
        open={openAddSemester}
        onClose={() => setOpenAddSemester(false)}
        term={data}
        onSuccess={() => refetch()}
      />
    </div>
  );
}