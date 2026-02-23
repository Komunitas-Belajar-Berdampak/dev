import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TahunAkademikDanSemesterActionDropdown({
  onDelete,
}: {
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="border-2 border-black p-1 rounded shadow-[2px_2px_0_0_#000]">
          <Icon icon="mdi:dots-horizontal" className="text-lg" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            onDelete();
          }}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <Icon icon="iconamoon:trash-fill" className="mr-2" />
          Delete Tahun Akademik dan Semester
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
