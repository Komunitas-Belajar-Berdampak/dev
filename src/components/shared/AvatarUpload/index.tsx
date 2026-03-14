import { cn } from "@/lib/cn";
import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface AvatarUploadProps {
  className?: string;
  currentImage?: string | null;
  disabled?: boolean;
  onChange: (file: string | null) => void;
}

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const AvatarUpload = ({
  className,
  currentImage,
  disabled,
  onChange,
}: AvatarUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    const dataUrl = await fileToDataUrl(file);
    setIsDeleted(false);
    onChange(dataUrl);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
    setIsDeleted(true);
  };

  const displayImage = isDeleted ? null : preview || currentImage;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "relative w-30 h-30 rounded-full overflow-hidden flex items-center justify-center bg-muted",
          !disabled && "cursor-pointer group",
        )}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon
            icon="boxicons:user-filled"
            className="text-primary"
            width="80"
            height="80"
          />
        )}

        {/* overlay on hover */}
        {!disabled && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
            <Icon
              icon="mdi:camera"
              className="text-white"
              width="24"
              height="24"
            />
            {displayImage && (
              <button
                type="button"
                onClick={handleRemove}
                className="text-[10px] text-red-300 hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default AvatarUpload;
