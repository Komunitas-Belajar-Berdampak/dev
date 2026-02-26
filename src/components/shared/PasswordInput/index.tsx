import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { useState } from "react";

const PasswordInput = ({ ...props }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input type={show ? "text" : "password"} {...props} className="pr-10" />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        <Icon icon={show ? "mdi:eye-off" : "mdi:eye"} width="20" height="20" />
      </button>
    </div>
  );
};

export default PasswordInput;
