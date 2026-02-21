import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmDeleteModal({
  open,
  title,
  description,
  onClose,
  onConfirm,
  loading = false,
}: {
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="
          max-w-[440px]
          rounded-xl
          border border-gray-200
          bg-white
          p-0
        "
      >
        <div className="relative p-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            disabled={loading}
          >
          </button>

          <div className="flex flex-col items-left text-left">
            <Icon
              icon="mdi:alert-outline"
              className="text-3xl text-red-500"
            />

            <h3 className="mt-4 text-base font-semibold text-gray-900">
              {title ?? "Apakah anda yakin menghapus materi ini ?"}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {description ??
                "Jika telah dihapus materi akan terhapus permanen"}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="h-9 px-5 text-sm"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="h-9 bg-red-600 px-5 text-sm font-semibold hover:bg-red-700"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}