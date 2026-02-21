import { useNavigate, useParams } from "react-router-dom";
import type { MeetingEntity } from "../../services/meeting.service";

export default function MateriTugasPertemuanCard({
  data,
}: {
  data: MeetingEntity;
}) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <button
      type="button"
      onClick={() =>
        navigate(`/dosen/courses/${id}/materi-tugas/pertemuan/${data.id}`)
      }
      className="
        w-full text-left
        rounded-xl
        border border-gray-200
        bg-white
        px-6 py-5
        transition
        hover:shadow-sm
      "
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Pertemuan {data.pertemuan}</p>

          <h2 className="text-2xl sm:text-2xl font-bold text-primary">
            {data.judul || `Pertemuan ${data.pertemuan}`}
          </h2>
        </div>

        <span className="text-[#0B1C7A] text-lg">{">"}</span>
      </div>
    </button>
  );
}