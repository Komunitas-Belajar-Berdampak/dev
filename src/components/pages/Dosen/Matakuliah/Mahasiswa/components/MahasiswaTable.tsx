import { useNavigate, useParams } from "react-router-dom";
import type { MahasiswaCourseItem } from "../../hooks/useMahasiswaByCourse";

export default function MahasiswaTable({ data }: { data: MahasiswaCourseItem[] }) {
  const navigate = useNavigate();
  const { id: idCourse } = useParams<{ id: string }>();

  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Belum ada mahasiswa di mata kuliah ini.
      </p>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {data.map((mhs) => (
        <div
          key={mhs.id}
          className="flex items-center justify-between py-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-300 to-purple-400 shadow-[4px_4px_0_0_#000] shrink-0" />
            <div>
              <p className="text-sm font-bold text-blue-900">{mhs.nama}</p>
              <p className="text-sm text-gray-400/70">
                {mhs.nim ?? mhs.nrp ?? "-"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/dosen/courses/${idCourse}/mahasiswa/${mhs.id}/nilai`)}
            className="text-sm font-medium text-blue-800 hover:underline"
          >
            View Nilai
          </button>
        </div>
      ))}
    </div>
  );
}