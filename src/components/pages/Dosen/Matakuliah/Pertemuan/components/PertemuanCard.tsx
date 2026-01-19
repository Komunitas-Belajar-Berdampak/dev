import type { Pertemuan } from "../../types";

export default function PertemuanCard({ data }: { data: Pertemuan }) {
  return (
    <div className="border-2 border-black rounded-xl p-4 shadow-[3px_3px_0_#000] hover:bg-blue-50 transition">
      <h3 className="font-bold">
        Pertemuan {data.pertemuanKe}
      </h3>
      <p className="text-sm">{data.judul}</p>
    </div>
  );
}
