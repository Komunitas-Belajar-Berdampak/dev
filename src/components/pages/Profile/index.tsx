import Title from "@/components/shared/Title";
import ProfileContent from "./components/ProfileContent";
import PublicFiles from "./components/PublicFiles";

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
      <PublicFiles />
    </section>
  );
};

export default ProfilePage;
