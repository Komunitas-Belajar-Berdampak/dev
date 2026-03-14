import { cn } from "@/lib/cn";

const ProfileCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("p-4 rounded-xl border border-neutral-300", className)}>
      {children}
    </div>
  );
};

export default ProfileCard;
