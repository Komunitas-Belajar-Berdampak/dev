import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react";

interface FilePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: string;
}

export const FilePreviewModalMhs = ({
  open,
  onOpenChange,
  file,
}: FilePreviewModalProps) => {
  const renderPreview = () => {
    const lower = file.toLowerCase();
    const ext = lower.split("?")[0].split("#")[0].split(".").pop() ?? "";

    const isImage =
      lower.includes("png") ||
      lower.includes("jpg") ||
      lower.includes("jpeg") ||
      lower.includes("webp") ||
      lower.includes("gif") ||
      lower.includes("bmp") ||
      lower.includes("svg") ||
      ["png", "jpg", "jpeg", "webp", "gif", "bmp", "svg"].includes(ext);

    if (isImage) {
      return (
        <img
          src={file}
          alt={"materi-preview"}
          className="max-h-[70vh] w-full object-contain"
        />
      );
    }

    const isPdf = lower.includes("pdf") || ext === "pdf";
    if (isPdf) {
      return (
        <iframe
          src={file}
          title={"materi-document"}
          className="h-[70vh] w-full rounded-md border"
        />
      );
    }

    const isVideo =
      lower.includes("video/") ||
      ["mp4", "webm", "ogg", "mov", "m4v"].includes(ext) ||
      lower.endsWith(".mp4") ||
      lower.endsWith(".webm") ||
      lower.endsWith(".ogg") ||
      lower.endsWith(".mov") ||
      lower.endsWith(".m4v");

    if (isVideo) {
      return (
        <video
          src={file}
          controls
          className="h-[70vh] w-full rounded-md border bg-black"
        />
      );
    }

    const isAudio =
      lower.includes("audio/") ||
      ["mp3", "wav", "ogg", "m4a", "aac"].includes(ext) ||
      lower.endsWith(".mp3") ||
      lower.endsWith(".wav") ||
      lower.endsWith(".ogg") ||
      lower.endsWith(".m4a") ||
      lower.endsWith(".aac");

    if (isAudio) {
      return (
        <audio src={file} controls className="w-full" />
      );
    }

    const isText =
      ["txt", "md", "markdown", "rtf", "csv", "json", "xml"].includes(ext);

    if (isText) {
      // Hanya fallback rendering sederhana via iframe agar BE mengirim content-type text dengan benar.
      // Kalau server tidak mengatur content-type, browser bisa tetap menampilkan sebagai download.
      return (
        <iframe
          src={file}
          title={"materi-text"}
          className="h-[70vh] w-full rounded-md border"
        />
      );
    }

    // Fallback for unsupported types (docx, xlsx, pptx, etc.)
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <Icon icon="tabler:file-off" width={48} className="text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Preview not available for this file type
        </p>
        <a href={file} download={file.split("/").pop()}>
          <Button variant="outline">Download File</Button>
        </a>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>{"Submission File Preview"}</DialogTitle>
        </DialogHeader>
        {renderPreview()}
      </DialogContent>
    </Dialog>
  );
};
