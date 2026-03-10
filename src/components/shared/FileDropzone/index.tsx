// components/ui/file-dropzone.tsx
"use client";

import { useCallback, useState } from "react";
import { useDropzone, type Accept } from "react-dropzone";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/cn";

interface FileDropzoneProps {
  onFileSelect?: (file: File) => void;
  onFileRemove?: () => void;
  accept?: Accept;
  maxSize?: number;
  className?: string;
  disabled?: boolean;
  initialFile?: {
    name: string;
    size: string;
    tipe: string;
    path?: string;
  } | null;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const FileDropzone = ({
  onFileSelect,
  onFileRemove,
  accept,
  maxSize = 10 * 1024 * 1024,
  className,
  disabled,
  initialFile,
}: FileDropzoneProps) => {
  const [preview, setPreview] = useState<{
    name: string;
    size: string;
    tipe: string;
    path?: string;
  } | null>(initialFile ?? null);

  const [showModal, setShowModal] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const path = URL.createObjectURL(file);

      setPreview({
        name: file.name,
        size: formatFileSize(file.size),
        tipe: file.type,
        path,
      });

      onFileSelect?.(file);
    },
    [onFileSelect],
  );

  const removeFile = () => {
    if (preview?.path && !initialFile?.path) {
      URL.revokeObjectURL(preview.path);
    }
    setPreview(null);
    onFileRemove?.();
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      multiple: false,
      disabled,
    });

  const isImage = preview?.tipe?.startsWith("image/");
  const isPdf = preview?.tipe === "application/pdf";

  return (
    <div className={className}>
      {!preview ? (
        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <input {...getInputProps()} />
          <Icon
            icon="tabler:upload"
            className="mb-2 text-muted-foreground"
            width={40}
            height={40}
          />
          <p className="text-sm font-medium">
            {isDragActive
              ? "Drop file here..."
              : "Drag & drop or click to upload"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Max size: {formatFileSize(maxSize)}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* File info row */}
          <div
            className="flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
            onClick={() => setShowModal(true)}
          >
            <div className="flex items-center gap-3">
              <Icon
                icon={isImage ? "tabler:photo" : "tabler:file-filled"}
                className="text-primary"
                width={32}
                height={32}
              />
              <div>
                <p className="max-w-[200px] truncate text-sm font-medium">
                  {preview.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {preview.size} • {preview.tipe}
                </p>
              </div>
            </div>

            {!disabled && !initialFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="rounded-full p-1 hover:bg-muted"
              >
                <Icon icon="tabler:x" width={16} height={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && preview?.path && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative mx-4 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <p className="truncate text-sm font-medium">{preview.name}</p>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full p-1 hover:bg-muted"
              >
                <Icon icon="tabler:x" width={18} height={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {isImage && (
                <img
                  src={preview.path}
                  alt={preview.name}
                  className="max-h-[70vh] w-full object-contain"
                />
              )}
              {isPdf && (
                <iframe
                  src={preview.path}
                  className="h-[70vh] w-full"
                  title={preview.name}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {fileRejections.length > 0 && (
        <p className="mt-2 text-xs text-destructive">
          File rejected. Check file type and size.
        </p>
      )}
    </div>
  );
};

export default FileDropzone;
