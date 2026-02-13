const mahasiswaDummy = [
  {
    id: "1",
    nim: "2272001",
    nama: "Elmosius Suli",
  },
  {
    id: "2",
    nim: "2272002",
    nama: "Joshua Subianto",
  },
  {
    id: "3",
    nim: "2272003",
    nama: "Nathaniel Valentino Robert",
  },
  {
    id: "4",
    nim: "2272004",
    nama: "Dheandra Halwa Ghassani",
  },
];

export default function MahasiswaTable() {
  return (
    <div
      className="
        rounded-3xl
        border border-gray-200
        bg-white
        px-6
        py-4
      "
    >
      {mahasiswaDummy.map((mhs) => (
        <div
          key={mhs.id}
          className="
            flex items-center justify-between
            py-5
            border-b last:border-b-0
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-4">
            {/* AVATAR */}
            <div
              className="
                w-12 h-12
                rounded-full
                bg-gradient-to-br from-purple-300 to-purple-400
                shadow-[3px_3px_0_#000]
              "
            />

            {/* INFO */}
            <div>
              <p className="font-semibold text-blue-900">
                {mhs.nama}
              </p>
              <p className="text-sm text-gray-400">
                {mhs.nim}
              </p>
            </div>
          </div>

          {/* ACTION */}
          <button className="text-sm font-medium text-blue-800 hover:underline">
            View Nilai
          </button>
        </div>
      ))}
    </div>
  );
}
