export default function PertemuanTabs({
  value,
  onChange,
}: {
  value: "materi" | "tugas";
  onChange: (v: "materi" | "tugas") => void;
}) {
  const tabBase = "relative pb-2 text-sm font-semibold transition-colors";
  const active = "text-primary";
  const inactive = "text-gray-500 hover:text-primary";

  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        className={[tabBase, value === "materi" ? active : inactive].join(" ")}
        onClick={() => onChange("materi")}
      >
        Materi
        {value === "materi" && (
          <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-blue-900" />
        )}
      </button>

      <button
        type="button"
        className={[tabBase, value === "tugas" ? active : inactive].join(" ")}
        onClick={() => onChange("tugas")}
      >
        Tugas
        {value === "tugas" && (
          <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-blue-900" />
        )}
      </button>
    </div>
  );
}