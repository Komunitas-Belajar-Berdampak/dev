import type { Pertemuan } from "../../types";
import { useNavigate, useParams } from "react-router-dom";

export default function PertemuanCard({ data }: { data: Pertemuan }) {
  const navigate = useNavigate();
  const { matkulId } = useParams();

  return (
    <div
      onClick={() =>
        navigate(`/dosen/matakuliah/${matkulId}/pertemuan/${data.id}`)
      }
      className="
        rounded-2xl
        border-2 border-black
        bg-white
        p-6
        shadow-[6px_6px_0_0_#000]
        transition
        hover:translate-x-0.5
        hover:translate-y-0.5
        hover:bg-blue-50
      "
    >
      <h3 className="font-bold text-lg text-blue-900">
        Pertemuan {data.pertemuanKe}
      </h3>

      <p className="text-sm text-blue-800 mt-2 leading-relaxed">
        {data.judul}
      </p>
    </div>
  );
}
