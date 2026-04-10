import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  onEdit?: () => void;
  onEditPassword?: () => void;
}

export default function UserActionDropdown({ onEdit, onEditPassword }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="border-2 border-black p-1 rounded shadow-[2px_2px_0_0_#000]">
          <Icon icon="mdi:dots-horizontal" className="text-lg" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={onEdit} className="cursor-pointer text-base-700">
          <Icon icon="mdi:pencil" className="mr-2" />
          Edit User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEditPassword} className="cursor-pointer text-base-700">
          <Icon icon="mdi:lock-reset" className="mr-2" />
          Edit Password
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}