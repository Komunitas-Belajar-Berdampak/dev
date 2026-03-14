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
  file: {
    nama: string;
    path: string; // base64 data URL
    tipe: string;
  };
}

export const FilePreviewModal = ({
  open,
  onOpenChange,
  file,
}: FilePreviewModalProps) => {
  const renderPreview = () => {
    if (file.tipe.startsWith("image/")) {
      return (
        <img
          src={file.path}
          alt={file.nama}
          className="max-h-[70vh] w-full object-contain"
        />
      );
    }

    if (file.tipe === "application/pdf") {
      return (
        <iframe
          src={file.path}
          title={file.nama}
          className="h-[70vh] w-full rounded-md border"
        />
      );
    }

    // Fallback for unsupported types (xlsx, docx, etc.)
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <Icon
          icon="tabler:file-off"
          width={48}
          className="text-muted-foreground"
        />
        <p className="text-sm text-muted-foreground">
          Preview not available for this file type
        </p>
        <a href={file.path} download={file.nama}>
          <Button variant="outline">Download File</Button>
        </a>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>{file.nama}</DialogTitle>
        </DialogHeader>
        {renderPreview()}
      </DialogContent>
    </Dialog>
  );
};
