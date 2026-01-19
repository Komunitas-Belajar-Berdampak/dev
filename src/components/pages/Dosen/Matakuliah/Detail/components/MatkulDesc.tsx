interface MatkulDescProps {
  description?: string;
  kodeMatkul?: string;
  namaMatkul?: string;
}

export default function MatkulDesc({
  description,
  kodeMatkul = "IN213",
  namaMatkul = "Web Dasar",
}: MatkulDescProps) {
  return (
    <div className="space-y-10">
      {/* TITLE CARD */}
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-6">
        <h2 className="text-2xl font-bold text-blue-900 text-center">
          Deskripsi {kodeMatkul} – {namaMatkul}
        </h2>
      </div>

      {/* DESCRIPTION (DI LUAR CARD) */}
      <div className="text-blue-900 leading-relaxed space-y-6 text-sm px-2">
        {description ? (
          description.split("\n").map((text, index) => (
            <p key={index}>{text}</p>
          ))
        ) : (
          <p className="italic text-blue-700 text-center">
            Belum ada deskripsi mata kuliah.
          </p>
        )}
      </div>
    </div>
  );
}
