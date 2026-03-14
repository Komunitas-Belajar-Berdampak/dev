import Title from "@/components/shared/Title";
import ProfileContent from "../components/ProfileContent";

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

  return (
    <section className="flex flex-col gap-[35px]">
      <Title title="Edit Profile" items={breadcrumbItems} />
      <ProfileContent isEditing={true} />
    </section>
  );
};

export default EditProfilePage;
