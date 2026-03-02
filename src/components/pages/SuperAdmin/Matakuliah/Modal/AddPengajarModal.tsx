import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

import { useDosenOptions } from "../hooks/useDosenOptions";

export type PengajarEntity = {
  id: string;
  nrp: string;
  nama: string;
};

const PAGE_SIZE = 10;

export default function AddPengajarModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { id: string }) => void;
}) {
  const { options, loading } = useDosenOptions();

  const [selectedId, setSelectedId] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Filter by search
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  // Paginated (infinite)
  const visible = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);
  const hasMore = visible.length < filtered.length;

  // Close on outside click
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

  // Focus search when dropdown opens
  useEffect(() => {
    if (dropdownOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [dropdownOpen]);

  // Reset page when search changes
  useEffect(() => { setPage(1); }, [search]);

  // Infinite scroll sentinel
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

  const submit = () => {
    if (!selectedId) return;
    onSubmit({ id: selectedId });
    setSelectedId("");
    setSelectedLabel("");
    onClose();
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Pengajar</DialogTitle>
        </DialogHeader>

        <div className="mt-4 relative" ref={containerRef}>
          {/* Trigger — pakai style SelectTrigger yang sama */}
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

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute z-50 top-[calc(100%+4px)] left-0 right-0 rounded-md border border-black bg-white overflow-hidden">

              {/* Search */}
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

              {/* List */}
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

                    {/* Sentinel for infinite scroll */}
                    {hasMore && (
                      <div ref={sentinelRef} className="flex items-center justify-center py-3 text-xs text-muted-foreground gap-1">
                        <Icon icon="mdi:loading" className="animate-spin text-sm" />
                        Memuat lebih banyak...
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer count */}
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
          disabled={!selectedId || loading}
        >
          Tambah Pengajar
        </Button>
      </DialogContent>
    </Dialog>
  );
}