import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@iconify/react";

const DeleteConfirmationModal = ({
  isOpen,
  onOpenChange,
  onDelete,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onDelete: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <header className="flex items-center gap-4">
            <div className="p-2 rounded-2xl bg-red-50">
              <Icon
                icon="heroicons-outline:exclamation"
                fontSize={25}
                className="text-red-500"
              />
            </div>
            <p className="font-semibold text-lg">
              Apakah Anda yakin ingin menghapus file ini?
            </p>
          </header>
          <p className="text-gray-400">
            Jika tugas dihapus, maka file akan dihapus secara permanen.
          </p>
        </DialogHeader>
        <Separator className="bg-gray-400" />
        <main className="flex items-center gap-4">
          <Button
            className="grow bg-white text-black! border hover:bg-gray-100!"
            onClick={onOpenChange}
          >
            Cancel
          </Button>
          <Button
            className="grow bg-red-500 hover:bg-red-700"
            type="button"
            onClick={onDelete}
          >
            Delete
          </Button>
        </main>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
{
  /* <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="max-w-4xl">
    <DialogHeader>
      <DialogTitle>{file.nama}</DialogTitle>
    </DialogHeader>
    {renderPreview()}
  </DialogContent>
</Dialog>; */
}
