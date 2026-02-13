import type { Pertemuan } from "../types";
import PertemuanCard from "./components/PertemuanCard";
import { Icon } from "@iconify/react";

export default function PertemuanList({
  pertemuan,
}: {
  pertemuan: Pertemuan[];
}) {
  if (!pertemuan || pertemuan.length === 0) {
    return (
      <div className="space-y-4 py-8">
        <div
          className="
            rounded-2xl
            border-2 border-dashed border-black
            bg-white
            p-10
            text-center
            shadow-[6px_6px_0_0_#000]
          "
        >
          <div className="flex flex-col items-center gap-3">
            <Icon
              icon="mdi:calendar-remove-outline"
              className="text-4xl text-gray-400"
            />
            <p className="text-sm text-gray-600">
              Belum ada pertemuan untuk mata kuliah ini.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
        {pertemuan.map((p) => (
          <PertemuanCard key={p.id} data={p} />
        ))}
      </div>
    </div>
  );
}
