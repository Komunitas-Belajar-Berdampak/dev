const descStyle = `
  .matkul-desc p { margin-top: 0.75rem; margin-bottom: 0.75rem; }
  .matkul-desc p:first-child { margin-top: 0; }
  .matkul-desc p:last-child { margin-bottom: 0; }
  .matkul-desc h1, .matkul-desc h2, .matkul-desc h3 { margin-top: 1.25rem; margin-bottom: 0.5rem; }
  .matkul-desc ul, .matkul-desc ol { margin-top: 0.5rem; margin-bottom: 0.5rem; padding-left: 1.25rem; }
  .matkul-desc li { margin-top: 0.25rem; margin-bottom: 0.25rem; }
  .matkul-desc blockquote { margin: 0.75rem 0; }
`;

interface MatkulDescProps {
  description?: string | { content: string } | null;
  kodeMatkul?: string;
  namaMatkul?: string;
}

export default function MatkulDesc({
  description,
  kodeMatkul = "IN213",
  namaMatkul = "Web Dasar",
}: MatkulDescProps) {
  const html =
    typeof description === "object" && description !== null
      ? (description as any).content ?? ""
      : (description as string) ?? "";

  return (
    <div className="space-y-10">
      {/* TITLE CARD */}
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-6">
        <h2 className="text-2xl font-bold text-primary text-center">
          Deskripsi {kodeMatkul} – {namaMatkul}
        </h2>
      </div>

      {/* DESCRIPTION */}
      <div className="px-2">
        {html ? (
          <>
            <style>{descStyle}</style>
            <div
              className={[
                "matkul-desc",
                "prose prose-sm max-w-none",
                // paragraph & spacing
                "prose-p:text-primary prose-p:leading-relaxed prose-p:my-3",
                // headings
                "prose-headings:text-primary prose-headings:font-bold",
                "prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg",
                // inline marks
                "prose-strong:text-primary prose-strong:font-bold",
                "prose-em:italic",
                "prose-u:underline",
                "prose-s:line-through",
                // code
                "prose-code:bg-gray-100 prose-code:rounded prose-code:px-1 prose-code:text-pink-600 prose-code:text-xs",
                // blockquote
                "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-primary",
                // lists
                "prose-ul:text-primary prose-ul:list-disc prose-ul:pl-5",
                "prose-ol:text-primary prose-ol:list-decimal prose-ol:pl-5",
                "prose-li:text-primary prose-li:my-1",
                // link
                "prose-a:text-blue-600 prose-a:underline",
                // global color
                "text-primary",
              ].join(" ")}
              style={{ lineHeight: "1.8" }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </>
        ) : (
          <p className="italic text-primary/60 text-center">
            Belum ada deskripsi mata kuliah.
          </p>
        )}
      </div>
    </div>
  );
}