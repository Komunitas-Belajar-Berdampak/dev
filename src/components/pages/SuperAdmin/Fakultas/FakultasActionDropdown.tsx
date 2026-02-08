import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function FakultasActionDropdown({
  onEdit,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="border-2 border-black p-1 rounded shadow-[2px_2px_0_0_#000]">
          <Icon icon="mdi:dots-horizontal" className="text-lg" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={onEdit}
          className="cursor-pointer text-base-700"
        >
          <Icon icon="mdi:pencil" className="mr-2" />
          Edit Fakultas
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
