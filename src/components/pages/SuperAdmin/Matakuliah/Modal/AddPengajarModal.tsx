import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { useDosenOptions } from "../hooks/useDosenOptions";

export type PengajarEntity = {
  id: string;
  nrp: string;
  nama: string;
};

const PAGE_SIZE = 10;

const errorIcon = (
  <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5 rotate-45" />
);
const errorStyle = { background: "#dc2626", color: "#ffffff", border: "none", alignItems: "flex-start" };

export default function AddPengajarModal({
  open,
  onClose,
  onSubmit,
  existingIds = [],
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { id: string }) => Promise<void> | void;
  existingIds?: string[];
}) {
  const { options: allOptions, loading } = useDosenOptions();
  const options = useMemo(
    () => allOptions.filter((o) => !existingIds.includes(o.id)),
    [allOptions, existingIds],
  );

  const [selectedId, setSelectedId] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const visible = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);
  const hasMore = visible.length < filtered.length;

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  useEffect(() => {
    if (dropdownOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [dropdownOpen]);

  useEffect(() => { setPage(1); }, [search]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setPage((p) => p + 1); },
      { root: listRef.current, threshold: 0.1 }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [hasMore, visible]);

  const handleSelect = (id: string, label: string) => {
    setSelectedId(id);
    setSelectedLabel(label);
    setDropdownOpen(false);
    setSearch("");
  };

  const submit = async () => {
    if (!selectedId) return;

    setSubmitting(true);
    try {
      await onSubmit({ id: selectedId });
      setSelectedId("");
      setSelectedLabel("");
      onClose();

      toast.success("Pengajar Berhasil Ditambahkan!", {
        description: `${selectedLabel} berhasil ditambahkan sebagai pengajar.`,
        icon: <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />,
        style: { background: "#16a34a", color: "#ffffff", border: "none", alignItems: "flex-start" },
        descriptionClassName: "!text-white/90",
      });
    } catch (err: any) {
      const data = err?.response?.data;
      const msg: string =
        (typeof data === "string" ? data : null) ??
        data?.message ??
        data?.error ??
        err?.message ??
        "Terjadi kesalahan saat menambahkan pengajar.";
      const msgLower = msg.toLowerCase();

      let title = "Gagal Menambahkan Pengajar!";
      let description = "Terjadi kesalahan pada server. Silakan coba lagi.";

      if (msgLower.includes("already") || msgLower.includes("sudah") || msgLower.includes("duplicate") || err?.response?.status === 409) {
        title = "Pengajar Sudah Terdaftar!";
        description = `${selectedLabel} sudah menjadi pengajar di matakuliah ini.`;
      } else if (msgLower.includes("network") || msgLower.includes("timeout") || msgLower.includes("fetch")) {
        title = "Koneksi Bermasalah!";
        description = "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";
      } else if (err?.response?.status >= 500) {
        title = "Terjadi Kesalahan Server!";
        description = "Server sedang bermasalah. Silakan coba beberapa saat lagi.";
      } else if (msg && msg !== "Terjadi kesalahan saat menambahkan pengajar.") {
        description = msg;
      }

      toast.error(title, {
        description,
        icon: errorIcon,
        style: errorStyle,
        descriptionClassName: "!text-white/90",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = useCallback(() => {
    setSelectedId("");
    setSelectedLabel("");
    setSearch("");
    setDropdownOpen(false);
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-3xl w-[calc(100%-2rem)] sm:w-full rounded-xl">
        <DialogHeader>
          <DialogTitle>Tambah Pengajar</DialogTitle>
        </DialogHeader>

        <div className="mt-4 relative" ref={containerRef}>
          <button
            type="button"
            onClick={() => { setDropdownOpen((v) => !v); setSearch(""); setPage(1); }}
            className="w-full flex items-center justify-between px-3 h-10 rounded-md border border-black bg-background text-sm transition-colors hover:border-black/40 focus:outline-none focus:border-black/40"
          >
            <span className={selectedLabel ? "text-foreground truncate" : "text-muted-foreground"}>
              {selectedLabel || "Pilih Dosen"}
            </span>
            <Icon
              icon="mdi:chevron-down"
              className={`ml-2 shrink-0 text-muted-foreground transition-transform duration-150 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute z-50 top-[calc(100%+4px)] left-0 right-0 rounded-md border border-black bg-white overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-black/10">
                <Icon icon="mdi:magnify" className="text-muted-foreground shrink-0 text-base" />
                <input
                  ref={searchRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari dosen..."
                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground text-blue-800"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Icon icon="mdi:close" className="text-sm" />
                  </button>
                )}
              </div>

              <div ref={listRef} className="max-h-52 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-6 text-sm text-muted-foreground gap-2">
                    <Icon icon="mdi:loading" className="animate-spin" />
                    Memuat dosen...
                  </div>
                ) : visible.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    {search ? `Tidak ada hasil untuk "${search}"` : "Tidak ada dosen tersedia"}
                  </div>
                ) : (
                  <>
                    {visible.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => handleSelect(o.id, o.label)}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors
                          ${selectedId === o.id
                            ? "bg-black/5 text-blue-800 font-medium"
                            : "hover:bg-black/5 text-blue-800"
                          }`}
                      >
                        <span className="truncate">{o.label}</span>
                        {selectedId === o.id && (
                          <Icon icon="mdi:check" className="shrink-0 ml-2 text-blue-800" />
                        )}
                      </button>
                    ))}

                    {hasMore && (
                      <div ref={sentinelRef} className="flex items-center justify-center py-3 text-xs text-muted-foreground gap-1">
                        <Icon icon="mdi:loading" className="animate-spin text-sm" />
                        Memuat lebih banyak...
                      </div>
                    )}
                  </>
                )}
              </div>

              {!loading && filtered.length > 0 && (
                <div className="px-3 py-1.5 border-t border-black/10 text-xs text-muted-foreground">
                  {visible.length} dari {filtered.length} dosen
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          className="w-full mt-6 border-2 border-black shadow-[3px_3px_0_0_#000]"
          onClick={submit}
          disabled={!selectedId || loading || submitting}
        >
          {submitting ? "Menyimpan..." : "Tambah Pengajar"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}