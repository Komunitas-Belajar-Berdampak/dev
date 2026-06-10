import Title from "@/components/shared/Title";
import NotificationContent from "./components/NotificationContent";

const breadcrumbsItems = [
  {
    label: "Notifications",
    href: "/mahasiswa/notifications",
  },
];

const NotificationsPage = () => {
  return (
    <section className="flex h-full flex-col gap-6">
      <Title title="Notifications" items={breadcrumbsItems} />
      <NotificationContent />
    </section>
  );
};

export default NotificationsPage;
