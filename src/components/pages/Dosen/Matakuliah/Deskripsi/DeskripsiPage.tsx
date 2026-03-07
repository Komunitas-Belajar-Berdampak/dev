import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";

import { Button } from "@/components/ui/button";
import Title from "@/components/shared/Title";
import { useDeskripsi } from "../hooks/useDeskripsi";

const errorIcon = (
  <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5 rotate-45" />
);
const errorStyle = { background: "#dc2626", color: "#ffffff", border: "none", alignItems: "flex-start" };

function extractErrorMessage(err: any): string {
  const data = err?.response?.data;
  if (typeof data === "string" && data.length > 0) return data;
  if (typeof data?.message === "string" && data.message.length > 0) return data.message;
  if (typeof data?.error === "string" && data.error.length > 0) return data.error;
  if (typeof err?.message === "string" && err.message.length > 0) return err.message;
  return "Terjadi kesalahan saat menyimpan deskripsi.";
}

function ToolbarBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "h-7 min-w-[28px] px-1.5 rounded flex items-center justify-center text-sm transition select-none",
        active
          ? "bg-blue-900 text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-blue-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-1 self-center shrink-0" />;
}

function Toolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const headingLevel = ([1, 2, 3, 4, 5, 6] as const).find((l) =>
    editor.isActive("heading", { level: l })
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-200 bg-white">
      <ToolbarBtn title="Undo" onClick={() => editor.chain().focus().undo().run()}>
        <Icon icon="mdi:undo" />
      </ToolbarBtn>
      <ToolbarBtn title="Redo" onClick={() => editor.chain().focus().redo().run()}>
        <Icon icon="mdi:redo" />
      </ToolbarBtn>

      <Divider />

      <select
        value={headingLevel ?? "p"}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "p") editor.chain().focus().setParagraph().run();
          else editor.chain().focus().setHeading({ level: Number(v) as any }).run();
        }}
        className="h-7 rounded border border-gray-200 bg-white px-1.5 text-xs text-gray-700 outline-none cursor-pointer hover:border-blue-900 transition"
      >
        <option value="p">H1 ▾</option>
        <option value="1">H1</option>
        <option value="2">H2</option>
        <option value="3">H3</option>
        <option value="4">H4</option>
        <option value="5">H5</option>
        <option value="6">H6</option>
      </select>

      <select
        defaultValue=""
        onChange={(e) => {
          const v = e.target.value;
          if (v === "bullet") editor.chain().focus().toggleBulletList().run();
          if (v === "ordered") editor.chain().focus().toggleOrderedList().run();
          (e.target as HTMLSelectElement).value = "";
        }}
        className="h-7 rounded border border-gray-200 bg-white px-1.5 text-xs text-gray-700 outline-none cursor-pointer hover:border-blue-900 transition"
      >
        <option value="" disabled>≡ ▾</option>
        <option value="bullet">• Bullet</option>
        <option value="ordered">1. Ordered</option>
      </select>

      <Divider />

      <ToolbarBtn
        title="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Icon icon="mdi:format-indent-increase" />
      </ToolbarBtn>
      <ToolbarBtn
        title="Clear Formatting"
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
      >
        <Icon icon="mdi:format-clear" />
      </ToolbarBtn>

      <Divider />

      <ToolbarBtn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <span className="font-bold text-xs">B</span>
      </ToolbarBtn>
      <ToolbarBtn title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <span className="italic text-xs font-serif">I</span>
      </ToolbarBtn>
      <ToolbarBtn title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <span className="line-through text-xs">S</span>
      </ToolbarBtn>
      <ToolbarBtn title="Inline Code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
        <Icon icon="mdi:code-tags" className="text-sm" />
      </ToolbarBtn>
      <ToolbarBtn title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <span className="underline text-xs">U</span>
      </ToolbarBtn>
      <ToolbarBtn title="Highlight" onClick={() => {}}>
        <Icon icon="mdi:format-color-highlight" className="text-sm" />
      </ToolbarBtn>
      <ToolbarBtn
        title="Link"
        active={editor.isActive("link")}
        onClick={() => {
          if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
          } else {
            const url = window.prompt("URL:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }
        }}
      >
        <Icon icon="mdi:link-variant" className="text-sm" />
      </ToolbarBtn>
      <ToolbarBtn title="Superscript" active={editor.isActive("superscript")} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
        <span className="text-xs">x<sup>2</sup></span>
      </ToolbarBtn>
      <ToolbarBtn title="Subscript" active={editor.isActive("subscript")} onClick={() => editor.chain().focus().toggleSubscript().run()}>
        <span className="text-xs">x<sub>2</sub></span>
      </ToolbarBtn>

      <Divider />

      <ToolbarBtn title="Align Left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        <Icon icon="mdi:format-align-left" className="text-sm" />
      </ToolbarBtn>
      <ToolbarBtn title="Align Center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
        <Icon icon="mdi:format-align-center" className="text-sm" />
      </ToolbarBtn>
      <ToolbarBtn title="Align Right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
        <Icon icon="mdi:format-align-right" className="text-sm" />
      </ToolbarBtn>
      <ToolbarBtn title="Justify" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
        <Icon icon="mdi:format-align-justify" className="text-sm" />
      </ToolbarBtn>

      <Divider />

      <ToolbarBtn
        title="Insert Image"
        onClick={() => {
          const url = window.prompt("Image URL:");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
      >
        <span className="flex items-center gap-1 text-xs">
          <Icon icon="mdi:image-plus-outline" className="text-sm" />
          Add
        </span>
      </ToolbarBtn>
    </div>
  );
}

export default function DeskripsiPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error, isSaving, save } = useDeskripsi(id);

  const breadcrumbItems = [
    { label: "Courses", href: "/dosen" },
    { label: data?.namaMatkul ?? "...", href: `/dosen/courses/${id}` },
    { label: "Edit Deskripsi", href: "#" },
  ];

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Superscript,
      Subscript,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image,
    ],
    content: "",
    editorProps: {
      attributes: {
        class: [
          "min-h-[420px] px-6 py-5 outline-none focus:outline-none",
          "prose prose-sm max-w-none",
          "prose-headings:font-bold prose-headings:text-gray-900",
          "prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg",
          "prose-p:text-gray-800 prose-p:leading-relaxed",
          "prose-strong:font-bold prose-strong:text-gray-900",
          "prose-em:italic",
          "prose-u:underline",
          "prose-s:line-through",
          "prose-code:bg-gray-100 prose-code:rounded prose-code:px-1 prose-code:text-pink-600 prose-code:text-xs",
          "prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600",
          "prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5",
          "prose-a:text-blue-600 prose-a:underline",
        ].join(" "),
      },
    },
  });

  const deskripsiContent =
    typeof data?.deskripsi === "object" && data?.deskripsi !== null
      ? (data.deskripsi as any).content ?? ""
      : (data?.deskripsi as string) ?? "";

  useEffect(() => {
    if (!isLoading && editor && deskripsiContent) {
      editor.commands.setContent(deskripsiContent);
    }
  }, [isLoading, editor, deskripsiContent]);

  async function handleSave() {
    if (!editor) return;
    const html = editor.getHTML();

    try {
      await save(html);

      toast.success("Deskripsi Berhasil Disimpan!", {
        description: "Deskripsi matakuliah berhasil diperbarui.",
        icon: <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />,
        style: { background: "#16a34a", color: "#ffffff", border: "none", alignItems: "flex-start" },
        descriptionClassName: "!text-white/90",
      });

      navigate(`/dosen/courses/${id}`);
    } catch (err: any) {
      const msg = extractErrorMessage(err);
      const msgLower = msg.toLowerCase();

      let title = "Gagal Menyimpan Deskripsi!";
      let description = "Terjadi kesalahan pada server. Silakan coba lagi.";

      if (msgLower.includes("not found") || msgLower.includes("tidak ditemukan") || err?.response?.status === 404) {
        title = "Matakuliah Tidak Ditemukan!";
        description = "Data matakuliah tidak ditemukan. Mungkin sudah dihapus sebelumnya.";
      } else if (msgLower.includes("network") || msgLower.includes("timeout") || msgLower.includes("fetch")) {
        title = "Koneksi Bermasalah!";
        description = "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";
      } else if (err?.response?.status >= 500) {
        title = "Terjadi Kesalahan Server!";
        description = "Server sedang bermasalah. Silakan coba beberapa saat lagi.";
      } else if (msg && msg !== "Terjadi kesalahan saat menyimpan deskripsi.") {
        description = msg;
      }

      toast.error(title, {
        description,
        icon: errorIcon,
        style: errorStyle,
        descriptionClassName: "!text-white/90",
      });
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          Edit Deskripsi Matakuliah
        </h1>
        <Title title="" items={breadcrumbItems} />
      </div>

      {error && (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          Gagal memuat data. Coba refresh halaman.
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-[5px_5px_0_0_#000] overflow-hidden p-8 space-y-3">
          <div className="h-8 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-64 w-full animate-pulse rounded bg-gray-100" />
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-300 bg-white shadow-[5px_5px_0_0_#000] overflow-hidden">
          <Toolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pb-4">
        <Button
          variant="outline"
          className="border-2 border-black shadow-[3px_3px_0_0_#000]"
          type="button"
          onClick={() => navigate(`/dosen/courses/${id}`)}
        >
          Batal
        </Button>
        <Button
          className="bg-blue-900 text-white shadow-[3px_3px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition"
          type="button"
          onClick={handleSave}
          disabled={isSaving || isLoading}
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <Icon icon="mdi:loading" className="animate-spin" />
              Menyimpan...
            </span>
          ) : (
            "Simpan"
          )}
        </Button>
      </div>
    </div>
  );
}