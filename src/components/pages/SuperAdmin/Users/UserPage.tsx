import Title from "@/components/shared/Title";
import UserTable from "./UserTable";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const UserPage = () => {
  return (
    <div
      className="
        w-full
        max-w-[1400px]
        mx-auto
        px-4 sm:px-6 lg:px-8
        space-y-6 sm:space-y-8
      "
    >
      {/* TITLE + BREADCRUMB */}
      <div className="space-y-2 sm:space-y-3">
        {/* TITLE RESPONSIVE */}
        <div className="text-xl sm:text-2xl">
          <Title title="Data User" />
        </div>

        {/* BREADCRUMB RESPONSIVE */}
        <Breadcrumb>
          <BreadcrumbList className="flex flex-wrap text-sm">
            <BreadcrumbItem>
              <BreadcrumbLink href="/super-admin">Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink href="/super-admin">
                Super Admin
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Data User</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <UserTable />
      </div>
    </div>
  );
};

export default UserPage;
