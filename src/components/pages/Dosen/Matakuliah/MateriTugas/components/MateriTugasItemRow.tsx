import { Icon } from "@iconify/react";

export default function MateriTugasItemRow({
  type,
  title,
  onEdit,
  onDelete,
}: {
  type: "materi" | "tugas";
  title: string;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const isMateri = type === "materi";

  return (
    <div className="flex items-center justify-between gap-3 border-b border-gray-200 py-3">
      <div className="flex items-center gap-3">
        <div
          className={[
            "flex h-10 w-10 items-center justify-center rounded-full",
            isMateri ? "bg-indigo-100" : "bg-pink-200",
          ].join(" ")}
        >
          <Icon
            icon={isMateri ? "mdi:file-document-outline" : "mdi:format-list-checks"}
            className="text-xl text-blue-900"
          />
        </div>

        <h3 className="text-sm font-semibold text-blue-900">
          {title}
        </h3>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition"
          aria-label="Edit"
        >
          <Icon icon="mdi:pencil" className="text-base" />
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="rounded-md p-1.5 text-red-500 hover:bg-red-50 transition"
          aria-label="Delete"
        >
          <Icon icon="mdi:trash-can-outline" className="text-base" />
        </button>
      </div>
    </div>
  );
}