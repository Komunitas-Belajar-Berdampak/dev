import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { ButtonProps } from "@base-ui/react";
import { Icon } from "@iconify/react";

const AddButton = ({ label, ...props }: { label: string } & ButtonProps) => {
  return (
    <Button
      {...props}
      className={
        (cn("w-full sm:w-auto border-2 border-black shadow-[3px_3px_0_0_#000]"),
        props.className as string)
      }
    >
      <Icon icon="icon-park-solid:add" className="mr-2" />
      {label || "Add"}
    </Button>
  );
};

export default AddButton;
