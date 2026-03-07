import { useState } from "react";
import type { Pertemuan } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import EditJudulPertemuanModal from "../Detail/components/EditJudulPertemuanModal";

function EmptyState() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-black bg-white p-10 text-center shadow-[6px_6px_0_0_#000]">
      <div className="flex flex-col items-center gap-3">
        <Icon icon="mdi:calendar-remove-outline" className="text-4xl text-gray-400" />
        <p className="text-sm text-gray-600">Belum ada pertemuan untuk mata kuliah ini.</p>
      </div>
    </div>
  );
}

type SelectedPertemuan = {
  id: string;
  pertemuan: number;
  judul: string;
};

export default function PertemuanList({
  pertemuan,
  onRefetch,
}: {
  pertemuan: Pertemuan[];
  onRefetch?: () => void;
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const limit = 8;

  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedPertemuan | null>(null);

  if (!pertemuan?.length) return <EmptyState />;

  const totalPages = Math.ceil(pertemuan.length / limit);
  const paginated = pertemuan.slice((page - 1) * limit, page * limit);

  return (
    <>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {paginated.map((p) => (
            <div
              key={p.id}
              className="
                rounded-2xl
                border-2 border-black
                bg-white
                p-6
                shadow-[5px_5px_0_0_#000]
                hover:translate-x-0.5
                hover:translate-y-0.5
                hover:shadow-[3px_3px_0_0_#000]
                hover:bg-blue-50
                transition-all
                group
                flex flex-col gap-3
                cursor-pointer
              "
              onClick={() => navigate(`/dosen/courses/${id}/pertemuan/${p.id}`)}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-900 text-white text-sm font-bold shrink-0">
                  {p.pertemuan}
                </span>

                {/* Tombol edit — stopPropagation biar tidak trigger navigate */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected({ id: p.id, pertemuan: p.pertemuan, judul: p.judul });
                    setEditOpen(true);
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-100 transition"
                  title="Edit judul"
                >
                  <Icon icon="mdi:pencil-outline" className="text-base" />
                </button>
              </div>

              <h3 className="font-bold text-blue-900 text-sm leading-snug line-clamp-3">
                {p.judul}
              </h3>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-end">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setPage((p) => Math.max(p - 1, 1))} />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={() => setPage((p) => Math.min(p + 1, totalPages))} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {selected && (
        <EditJudulPertemuanModal
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setSelected(null);
          }}
          idPertemuan={selected.id}
          nomorPertemuan={selected.pertemuan}
          judulAwal={selected.judul}
          onSuccess={() => onRefetch?.()}
        />
      )}
    </>
  );
}