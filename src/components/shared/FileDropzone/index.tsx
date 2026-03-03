// components/ui/file-dropzone.tsx
"use client";

import { useCallback, useState } from "react";
import { useDropzone, type Accept } from "react-dropzone";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/cn";

interface FileInfo {
  filePath: string;
  fileSize: string;
  tipe: string;
  fileName: string;
}

interface FileDropzoneProps {
  onFileSelect?: (file: FileInfo) => void;
  onFileRemove?: () => void;
  accept?: Accept;
  maxSize?: number;
  className?: string;
  disabled?: boolean;
  initialFile?: {
    name: string;
    size: string;
    tipe: string;
  } | null;
}

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
  } | null>(initialFile ?? null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const dataUrl = await fileToDataUrl(file);

      setPreview({
        name: file.name,
        size: formatFileSize(file.size),
        tipe: file.type,
      });

      onFileSelect?.({
        filePath: dataUrl,
        fileSize: formatFileSize(file.size),
        tipe: file.type,
        fileName: file.name,
      });
    },
    [onFileSelect],
  );

  const removeFile = () => {
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
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Icon
              icon="tabler:file-filled"
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
          {!initialFile && (
            <button
              type="button"
              onClick={removeFile}
              className="rounded-full p-1 hover:bg-muted"
            >
              <Icon icon="tabler:x" width={16} height={16} />
            </button>
          )}
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
