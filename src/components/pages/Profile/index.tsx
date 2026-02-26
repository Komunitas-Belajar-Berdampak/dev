import Title from "@/components/shared/Title";
import ProfileContent from "./components/ProfileContent";

const ProfilePage = () => {
  const breadcrumbItems = [
    {
      label: "Profile",
      href: "/profile",
    },
  ];

  return (
    <section className="flex flex-col gap-[35px]">
      <Title title="Profile" items={breadcrumbItems} />
      <ProfileContent isEditing={false} />
    </section>
  );
};

export default ProfilePage;
