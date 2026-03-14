import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";

const PVDropdown = ({
  onView,
  onEdit,
  onDelete,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="border-2 border-black p-1 rounded shadow-[2px_2px_0_0_#000]">
          <Icon icon="mdi:dots-horizontal" className="text-lg" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={onView}
          className="cursor-pointer text-base-700"
        >
          <Icon icon="mdi:eye-outline" className="mr-2 text-primary" />
          View Private File
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onEdit}
          className="cursor-pointer text-base-700"
        >
          <Icon icon="mdi:pencil" className="mr-2 text-primary" />
          Edit Private File
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="cursor-pointer text-base-700"
        >
          <Icon icon="fluent-mdl2:delete" className="mr-2 text-red-500" />
          Delete Private File
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PVDropdown;

// export default function FakultasActionDropdown({
//   onEdit,
// }: Props) {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <button className="border-2 border-black p-1 rounded shadow-[2px_2px_0_0_#000]">
//           <Icon icon="mdi:dots-horizontal" className="text-lg" />
//         </button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent align="end" className="w-48">
//         <DropdownMenuItem
//           onClick={onEdit}
//           className="cursor-pointer text-base-700"
//         >
//           <Icon icon="mdi:pencil" className="mr-2" />
//           Edit Fakultas
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
