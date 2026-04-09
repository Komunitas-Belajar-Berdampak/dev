import Title from "@/components/shared/Title";
import ProfileContent from "./components/ProfileContent";
import PublicFiles from "./components/PublicFiles";
import { useParams } from "react-router-dom";
import { useFetchProfile } from "./hooks/useFetchProfile";
import type { UserProfile } from "@/types/profile";

const ProfilePage = () => {
  const breadcrumbItems = [
    {
      label: "Profile",
      href: "/profile",
    },
  ];
  const { id } = useParams();
  const { data, isPending } = useFetchProfile(id);
  return (
    <section className="flex flex-col gap-[35px]">
      <Title title="Profile" items={breadcrumbItems} />
      <ProfileContent
        isEditing={false}
        data={data as UserProfile}
        isPending={isPending}
      />
      <PublicFiles id={data?.id as string} />
    </section>
  );
};

export default ProfilePage;
