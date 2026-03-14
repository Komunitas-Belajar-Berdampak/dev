import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/cn";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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

    // Validate
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

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
    setIsDeleted(true);
  };

  const displayImage = isDeleted ? null : preview || currentImage;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          "relative group rounded-lg overflow-hidden flex flex-col justify-center items-center",
          !disabled && "cursor-pointer hover:opacity-80 transition-opacity",
        )}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt="Profile"
            className="w-30 h-30 rounded-lg object-cover"
          />
        ) : (
          <Icon
            icon="boxicons:user-filled"
            className="text-primary"
            width="120"
            height="120"
          />
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />
        {!displayImage && (
          <Button
            type="button"
            disabled={disabled}
            className=""
            onClick={() => inputRef.current?.click()}
          >
            Upload Photo
          </Button>
        )}
      </div>

      {displayImage && !disabled && (
        <Button
          variant={"destructive"}
          type="button"
          onClick={handleRemove}
          className="text-xs text-red-500 hover:bg-red-700"
        >
          Delete Photo
        </Button>
      )}
    </div>
  );
};

export default AvatarUpload;
