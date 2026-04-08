import Title from "@/components/shared/Title";
import ProfileContent from "../components/ProfileContent";
import { useParams } from "react-router-dom";
import { useFetchProfile } from "../hooks/useFetchProfile";
import type { UserProfile } from "@/types/profile";

const EditProfilePage = () => {
  const breadcrumbItems = [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Edit Profile",
      href: "/profile/edit",
    },
  ];
  const { id } = useParams();
  const { data, isPending } = useFetchProfile(id);

  return (
    <section className="flex flex-col gap-[35px]">
      <Title title="Edit Profile" items={breadcrumbItems} />
      <ProfileContent
        isEditing={true}
        data={data as UserProfile}
        isPending={isPending}
      />
    </section>
  );
};

export default EditProfilePage;
