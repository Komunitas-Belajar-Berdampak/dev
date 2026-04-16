import { useState } from "react";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string | null;
  userName: string | null;
  userNrp: string | null;
}

export default function ResetPasswordModal({
  open,
  onClose,
  onSuccess,
  userId,
  userName,
  userNrp, 
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    if (!userId || !userNrp) return;

    try {
      setLoading(true);
      setError(null);
      await api.put(`/users/${userId}`, { password: userNrp, isDefaultPassword: true, });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Gagal mereset password.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-2 border-black shadow-[4px_4px_0_0_#000]">
        <DialogHeader>
          <DialogTitle className="text-blue-900 text-lg font-bold flex items-center gap-2">
            <Icon icon="mdi:lock-reset" className="text-2xl" />
            Reset Password
          </DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <p className="text-sm text-gray-600">
            Reset password{" "}
            <span className="font-semibold text-blue-900">{userName ?? "user ini"}</span>{" "}
            ke default?
          </p>
          <div className="mt-3 rounded-md border border-black/10 bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-500 mb-1">Password baru</p>
            <p className="font-mono font-semibold text-blue-800 tracking-wider">
              {userNrp ?? "-"}
            </p>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="border-2 border-black shadow-[2px_2px_0_0_#000]"
          >
            Batal
          </Button>
          <Button
            onClick={handleReset}
            disabled={loading}
            className="border-2 border-black shadow-[2px_2px_0_0_#000]"
          >
            {loading ? (
              <Icon icon="mdi:loading" className="mr-2 animate-spin" />
            ) : (
              <Icon icon="mdi:lock-reset" className="mr-2" />
            )}
            {loading ? "Mereset..." : "Reset Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}