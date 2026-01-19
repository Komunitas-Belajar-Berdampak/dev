import type { Pertemuan } from "../types";
import PertemuanCard from "./components/PertemuanCard";

export default function PertemuanList({
  pertemuan,
}: {
  pertemuan: Pertemuan[];
}) {
  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">Daftar Pertemuan</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pertemuan.map((p) => (
          <PertemuanCard key={p.id} data={p} />
        ))}
      </div>
    </div>
  );
}
